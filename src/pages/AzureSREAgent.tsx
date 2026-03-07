import React, { useState } from 'react';
import {
  Badge,
  Button,
  SearchBox,
  Tab,
  TabList,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Add20Regular,
  ArrowSync20Regular,
  Delete20Regular,
} from '@fluentui/react-icons';
import {
  FilterPill,
  SREGlobalHeader,
} from '@azure-storybook/components';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  tabBar: {
    padding: '0 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  commandBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    flexShrink: 0,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    minWidth: 0,
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '48px 24px',
  },
  emptyIllustration: {
    width: '200px',
    height: '200px',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  emptyDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    textAlign: 'center' as const,
    maxWidth: '400px',
  },
});

// ─── Empty-state illustration (inline SVG) ───────────────────────

const AgentIllustration: React.FC = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* outer ring */}
    <circle cx="100" cy="100" r="70" stroke="#E1DFDD" strokeWidth="2" strokeDasharray="6 4" />

    {/* inner gradient shape */}
    <defs>
      <linearGradient id="agentGrad" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0078D4" />
        <stop offset="50%" stopColor="#B146C2" />
        <stop offset="100%" stopColor="#E3478B" />
      </linearGradient>
    </defs>
    <path
      d="M100 55 C120 55, 140 70, 140 90 C140 105, 130 120, 115 130
         C108 134, 100 145, 100 145
         C100 145, 92 134, 85 130
         C70 120, 60 105, 60 90
         C60 70, 80 55, 100 55Z"
      fill="url(#agentGrad)"
      opacity="0.85"
    />
    {/* "S" letterform */}
    <text
      x="100"
      y="108"
      textAnchor="middle"
      fontSize="36"
      fontWeight="700"
      fill="white"
      fontFamily="Segoe UI, sans-serif"
    >
      S
    </text>

    {/* orbiting dots */}
    <circle cx="44" cy="130" r="6" fill="#0078D4" />
    <circle cx="156" cy="130" r="6" fill="#E3478B" />
    <circle cx="60" cy="52" r="5" fill="#B146C2" />
    <circle cx="140" cy="52" r="5" fill="#50E6FF" />
    <circle cx="100" cy="28" r="4" fill="#9B59B6" />
    <circle cx="42" cy="88" r="4" fill="#50E6FF" />
    <circle cx="158" cy="88" r="4" fill="#B146C2" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────

const AzureSREAgent: React.FC = () => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<string>('agent-spaces');

  return (
    <div className={styles.page}>
      <SREGlobalHeader />

      {/* Horizontal tabs */}
      <div className={styles.tabBar}>
        <TabList
          selectedValue={activeTab}
          onTabSelect={(_, data) => setActiveTab(data.value as string)}
        >
          <Tab value="agents">Agents</Tab>
          <Tab value="agent-spaces">Agent Spaces</Tab>
          <Tab value="external-agents">External agents</Tab>
        </TabList>
      </div>

      {/* Command bar */}
      <div className={styles.commandBar}>
        <Button appearance="primary" icon={<Add20Regular />}>
          Create agent space
        </Button>
        <Button appearance="subtle" icon={<ArrowSync20Regular />}>
          Refresh
        </Button>
        <Button appearance="subtle" icon={<Delete20Regular />} disabled>
          Delete
        </Button>
      </div>

      {/* Search + filter pills */}
      <div className={styles.filterRow}>
        <SearchBox placeholder="Search agent spaces" style={{ minWidth: 200 }} />
        <FilterPill label="Subscription" value="All subscriptions" />
        <FilterPill label="Resource group" value="All resource groups" />
        <FilterPill label="Region" value="All regions" />
      </div>

      {/* Content — empty state */}
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <AgentIllustration />
          <Text className={styles.emptyTitle}>No agent spaces found</Text>
          <Text className={styles.emptyDescription}>
            Agent spaces help organize and manage groups of agents.
          </Text>
          <Button appearance="primary" icon={<Add20Regular />}>
            Create agent space
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AzureSREAgent;
