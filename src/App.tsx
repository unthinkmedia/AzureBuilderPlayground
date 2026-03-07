import React, { useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';

// ─── Import generated pages here ────────────────────────────────
import PreviewFeatures from './pages/PreviewFeatures';
import Subscriptions from './pages/Subscriptions';
import AzureSREAgent from './pages/AzureSREAgent';
import StaticWebApp from './pages/StaticWebApp';
import AzureHome from './pages/AzureHome';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    marginRight: '16px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: tokens.colorNeutralForeground3,
  },
});

// Register pages: add entries as you generate new pages.
const pages: Record<string, React.FC> = {
  'Preview Features': PreviewFeatures,
  'Subscriptions': Subscriptions,
  'Azure SRE Agent': AzureSREAgent,
  'Static Web App': StaticWebApp,
  'Azure Home': AzureHome,
};

const App: React.FC = () => {
  const styles = useStyles();
  const pageNames = Object.keys(pages);
  const [active, setActive] = useState(pageNames[0] ?? '');
  const ActivePage = pages[active];

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <Text className={styles.title}>Playground</Text>
        {pageNames.map((name) => (
          <Button
            key={name}
            appearance={name === active ? 'primary' : 'subtle'}
            size="small"
            onClick={() => setActive(name)}
          >
            {name}
          </Button>
        ))}
      </div>
      <div className={styles.content}>
        {ActivePage ? (
          <ActivePage />
        ) : (
          <Text className={styles.empty} size={400}>
            No pages generated yet. Run the pipeline to create your first page.
          </Text>
        )}
      </div>
    </div>
  );
};

export default App;
