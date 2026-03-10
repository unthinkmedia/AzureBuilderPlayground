#!/usr/bin/env npx tsx
/**
 * Deploy the current experiment to Azure Builder Hub.
 *
 * Zero-config: reads deploy.config.json (committed to the template).
 * The Hub API returns a time-limited SAS upload URL, so no storage
 * credentials are needed on the client.
 *
 * Usage:
 *   npx tsx scripts/deploy-to-hub.ts [--skip-thumbnail] [--skip-build]
 *
 * Override config via env vars (optional):
 *   HUB_API_URL   – Override the Hub URL from deploy.config.json
 *   HUB_DEPLOY_KEY – Override the deploy key from deploy.config.json
 */

import { execSync, spawn } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

// ── Helpers ──

function fatal(message: string): never {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function findFiles(dir: string, predicate: (path: string) => boolean): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      results.push(...findFiles(full, predicate));
    } else if (predicate(full)) {
      results.push(full);
    }
  }
  return results;
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

function getGitOwner(): string {
  try {
    const url = execSync("git remote get-url origin", { encoding: "utf-8" }).trim();
    const match = url.match(/[:/]([^/]+)\/[^/]+(?:\.git)?$/);
    return match?.[1] ?? "unknown";
  } catch {
    return "unknown";
  }
}

function getGitRepoName(): string {
  try {
    const url = execSync("git remote get-url origin", { encoding: "utf-8" }).trim();
    const match = url.match(/\/([^/]+?)(?:\.git)?$/);
    return match?.[1] ?? "unknown";
  } catch {
    return "unknown";
  }
}

function getGitUser(): string {
  try {
    return execSync("git config user.name", { encoding: "utf-8" }).trim() || "unknown";
  } catch {
    return "unknown";
  }
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Server at ${url} did not respond within ${timeoutMs}ms`);
}

/**
 * Upload a file to blob storage using the SAS URL returned by the Hub API.
 * The SAS URL points to the container; we append the blob path.
 */
async function uploadBlob(
  sasUrl: string,
  blobPath: string,
  content: Buffer,
  contentType: string,
): Promise<void> {
  // SAS URL format: https://account.blob.core.windows.net/container?sasToken
  // We insert the blob path between the container and the query string
  const [baseUrl, queryString] = sasUrl.split("?");
  const blobUrl = `${baseUrl}/${blobPath}?${queryString}`;

  const res = await fetch(blobUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": contentType,
      "Content-Length": String(content.length),
    },
    body: content,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${blobPath}: ${res.status} ${text}`);
  }
}

// ── Load config ──
const configPath = join(process.cwd(), "deploy.config.json");
if (!existsSync(configPath)) fatal("deploy.config.json not found. This file ships with the template.");

const config = JSON.parse(readFileSync(configPath, "utf-8")) as {
  hubApiUrl?: string;
  deployKey?: string;
};

// Env vars override config for CI and power-user scenarios
const HUB_API_URL = process.env.HUB_API_URL || config.hubApiUrl;
const DEPLOY_KEY = process.env.HUB_DEPLOY_KEY || config.deployKey;

if (!HUB_API_URL) fatal("hubApiUrl missing from deploy.config.json");
if (!DEPLOY_KEY || DEPLOY_KEY === "REPLACE_WITH_DEPLOY_KEY") {
  fatal("deployKey in deploy.config.json has not been set. Ask your team lead for the deploy key.");
}

const cliArgs = process.argv.slice(2);
const skipThumbnail = cliArgs.includes("--skip-thumbnail");
const skipBuild = cliArgs.includes("--skip-build");

// ── 1. Read experiment metadata ──
console.log("\n📦 Reading experiment metadata…");
const experimentPath = join(process.cwd(), "experiment.json");
if (!existsSync(experimentPath)) fatal("experiment.json not found in project root");

const experiment = JSON.parse(readFileSync(experimentPath, "utf-8")) as {
  name?: string;
  description?: string;
};
const experimentName = experiment.name ?? "Untitled";
const description = experiment.description ?? "";

const tags: string[] = [];
const schemaFiles = findFiles(process.cwd(), (f) => f.endsWith(".schema.json"));
let layout = "full-width";
for (const sf of schemaFiles) {
  try {
    const schema = JSON.parse(readFileSync(sf, "utf-8"));
    if (schema?.meta?.tags) {
      for (const t of schema.meta.tags) {
        if (typeof t === "string" && !tags.includes(t)) tags.push(t);
      }
    }
    if (schema?.meta?.layout) layout = schema.meta.layout;
  } catch {
    // skip malformed schemas
  }
}
const pageCount = Math.max(schemaFiles.length, 1);

console.log(`  Name: ${experimentName}`);
console.log(`  Tags: ${tags.length ? tags.join(", ") : "(none)"}`);
console.log(`  Layout: ${layout}`);
console.log(`  Pages: ${pageCount}`);

// ── 2. Build ──
if (!skipBuild) {
  console.log("\n🔨 Building project…");
  execSync("npm run build", { stdio: "inherit", cwd: process.cwd() });
}

const distDir = join(process.cwd(), "dist");
if (!existsSync(distDir)) fatal("dist/ directory not found. Run npm run build first.");

// ── 3. Generate thumbnail ──
if (!skipThumbnail) {
  console.log("\n📸 Generating thumbnail…");
  try {
    const previewProc = spawn("npx", ["vite", "preview", "--port", "4174"], {
      cwd: process.cwd(),
      stdio: "ignore",
      detached: true,
    });
    previewProc.unref();

    await waitForServer("http://localhost:4174", 10000);

    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto("http://localhost:4174", { waitUntil: "networkidle" });
    await page.screenshot({ path: join(distDir, "thumbnail.png") });
    await browser.close();

    try { process.kill(-previewProc.pid!, "SIGTERM"); } catch { /* already exited */ }

    console.log("  ✅ Thumbnail saved to dist/thumbnail.png");
  } catch (err) {
    console.warn(`  ⚠️  Thumbnail generation failed: ${(err as Error).message}`);
    console.warn("     Use --skip-thumbnail to skip. Deploying without thumbnail.");
  }
}

// ── 4. Register with Hub API (returns SAS upload URL) ──
console.log("\n🌐 Registering project with Hub…");
const registerBody = {
  repoOwner: getGitOwner(),
  repoName: getGitRepoName(),
  experimentName,
  description,
  tags,
  layout,
  pageCount,
  authorId: `github:${getGitOwner()}`,
  authorName: getGitUser(),
  changelog: `Deployed locally at ${new Date().toISOString()}`,
};

const registerRes = await fetch(`${HUB_API_URL}/api/deploy`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-deploy-key": DEPLOY_KEY,
  },
  body: JSON.stringify(registerBody),
});

if (!registerRes.ok) {
  const text = await registerRes.text();
  fatal(`Hub registration failed (${registerRes.status}): ${text}`);
}

const { projectId, version, uploadUrl } = (await registerRes.json()) as {
  projectId: string;
  version: number;
  uploadUrl: string;
};
console.log(`  ✅ Registered: projectId=${projectId}, version=${version}`);

// ── 5. Upload dist/ via SAS URL ──
console.log("\n☁️  Uploading to Azure Blob Storage…");
const prefix = `${projectId}/v${version}`;
const distFiles = findFiles(distDir, () => true);
let uploaded = 0;

for (const filePath of distFiles) {
  const relativePath = relative(distDir, filePath).replace(/\\/g, "/");
  const blobPath = `${prefix}/${relativePath}`;
  const content = readFileSync(filePath);
  const contentType = getMimeType(filePath);

  await uploadBlob(uploadUrl, blobPath, content, contentType);
  uploaded++;
}

console.log(`  ✅ Uploaded ${uploaded} files to experiments/${prefix}/`);

// ── Done ──
console.log("\n🎉 Deploy complete!");
console.log(`   View at: ${HUB_API_URL}/project/${projectId}`);
console.log(`   Preview: ${HUB_API_URL}/api/projects/${projectId}/preview/\n`);
