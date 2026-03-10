---
name: deploy-to-hub
description: >
  Deploy, share, or send the current experiment to Azure Builder Hub.
  Triggers when the user says "deploy this", "deploy to hub", "share this",
  "send this", "send to hub", "publish this", "push to hub", or similar phrases.
---

# Deploy to Hub Skill

Deploy the current experiment from the Playground sandbox to Azure Builder Hub so it appears in the gallery for other Microsoft employees.

**Zero-config** — the deploy key and Hub URL are in `deploy.config.json` which ships with the template. No `.env` file or secrets setup required.

## When to Use

This skill triggers on any of these user intents:
- "Deploy this" / "Deploy to hub" / "Deploy my experiment"
- "Share this" / "Share to hub"
- "Send this" / "Send to hub"
- "Publish this to hub"
- "Push to hub"

## Prerequisites

The only prerequisite is that `deploy.config.json` in the project root has a valid `deployKey`. This ships pre-configured with the template — no action needed from the user.

## Step-by-Step Workflow

### Step 1: Pre-Flight Check

1. Check that `experiment.json` has been updated from default values. If it still says `"My Experiment"` / `"A playground for rapid prototyping"`, infer a name and description from the user's work, then update it.
2. Run `npm install` if `node_modules/` doesn't exist.

### Step 2: Deploy

Run the deploy script:

```bash
npm run deploy
```

If the user wants to skip thumbnail generation (faster deploy), use:

```bash
npm run deploy:quick
```

### Step 3: Report

After the script completes, extract the output and tell the user:

- The project ID
- The version number
- The Hub URL where they can view it
- The preview URL

Example output:
> "Your experiment has been deployed to Hub as project `abc123` (version 2).
> View it at: https://victorious-ocean-0ea8ca710.5.azurestaticapps.net/project/abc123
> Preview: https://victorious-ocean-0ea8ca710.5.azurestaticapps.net/api/projects/abc123/preview/"

## Flags

| Flag | Effect |
|------|--------|
| `--skip-thumbnail` | Skip Playwright thumbnail generation (faster) |
| `--skip-build` | Skip `npm run build` (use existing dist/) |

## Troubleshooting

| Error | Fix |
|-------|-----|
| `deploy.config.json not found` | You must be in the project root |
| `deployKey has not been set` | The template's `deploy.config.json` still has the placeholder. Ask your team lead for the key. |
| `experiment.json not found` | You must be in the project root |
| `Hub registration failed (401)` | The deploy key doesn't match the Hub's key |
| `Thumbnail generation failed` | Use `--skip-thumbnail` or install Playwright: `npx playwright install chromium` |
