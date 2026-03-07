import React, { useState } from 'react';
import {
  Link,
  MessageBar,
  MessageBarBody,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowSync20Regular,
  Delete20Regular,
  Globe20Regular,
  Key20Regular,
  People20Regular,
} from '@fluentui/react-icons';
import {
  AzureBreadcrumb,
  AzureGlobalHeader,
  AzureServiceIcon,
  CardButton,
  CommandBar,
  EssentialsPanel,
  PageHeader,
  PageTabs,
  SideNavigation,
} from '@azure-storybook/components';
import type { NavItem } from '@azure-storybook/components';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    minWidth: 0,
  },
  essentialsWrapper: {
    padding: '0 24px',
  },
  tabContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  viewAppCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '20px 0',
  },
  appIllustration: {
    width: '80px',
    height: '80px',
    flexShrink: 0,
  },
  appDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, auto)',
    gap: '4px 32px',
  },
  appDetailsLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  appDetailsValue: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  productionCards: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  productionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px 20px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    flex: '1 1 240px',
    maxWidth: '320px',
    minWidth: '240px',
  },
  productionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  productionCardTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForegroundLink,
  },
  productionCardDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
  statusDot: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: tokens.colorNeutralForeground4,
  },
  makeTheMostCards: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  visitButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 16px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    fontFamily: tokens.fontFamilyBase,
    marginTop: '4px',
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
});

// ─── Data ────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: <AzureServiceIcon name="info" size={18} />, selected: true },
  { key: 'activity-log', label: 'Activity log', icon: <AzureServiceIcon name="clock" size={18} /> },
  { key: 'access-control', label: 'Access control (IAM)', icon: <AzureServiceIcon name="shield" size={18} /> },
  { key: 'tags', label: 'Tags', icon: <AzureServiceIcon name="tag" size={18} /> },
  { key: 'diagnose', label: 'Diagnose and solve problems', icon: <AzureServiceIcon name="wrench" size={18} /> },
  { key: 'resource-visualizer', label: 'Resource visualizer', icon: <AzureServiceIcon name="eye" size={18} /> },
  { key: 'settings', label: 'Settings', children: [] },
  { key: 'monitoring', label: 'Monitoring', children: [] },
  { key: 'automation', label: 'Automation', children: [] },
  { key: 'help', label: 'Help', children: [] },
];

const essentialsLeft = [
  { label: 'Resource group', value: 'coherence-preview-rg', isLink: true, labelAction: { text: 'move' } },
  { label: 'Subscription', value: 'PXT Staging Cloud', isLink: true, labelAction: { text: 'move' } },
  { label: 'Subscription ID', value: 'fbd8f8d0-f72e-4ab2-9add-d4e065e99213' },
  { label: 'Location', value: 'Global' },
  { label: 'Sku', value: 'Free' },
  { label: 'Tags', value: 'Add tags', isLink: true, labelAction: { text: 'edit' } },
];

const essentialsRight = [
  { label: 'URL', value: 'https://blue-glacier-0efa94c1e.6.azurestaticapps.net', isLink: true },
];

const essentialsActions = [
  { label: 'View Cost' },
  { label: 'JSON View' },
];

const productionCards = [
  {
    icon: 'globe',
    title: 'Add a custom domain',
    description: 'Add a custom domain and use Azure Domain Name System to manage your domains.',
  },
  {
    icon: 'scalingup',
    title: 'Upgrade your hosting plan',
    description: 'Upgrade your hosting plan for increased file and bandwidth limits and an uptime service level agreement (SLA).',
  },
  {
    icon: 'frontdoor',
    title: 'Enable enterprise grade edge',
    description: 'Enable faster page loads, enhance security, and optimize reliability for your global applications with the power of Azure Front Door.',
  },
];

const makeTheMostCards = [
  {
    icon: 'database',
    title: 'Database connections',
    description: 'Access a database from your static web app without writing custom server-side code.',
  },
  {
    icon: 'functionapp',
    title: 'Add a serverless backend',
    description: 'Link a managed serverless backend using Azure Functions or Azure Container App to help simplify backend API calls.',
  },
  {
    icon: 'deploymentslots',
    title: 'Use preview environments',
    description: 'Deploy a preview version of your site to a temporary URL. Review changes before merging pull request.',
  },
  {
    icon: 'visualstudiocode',
    title: 'Streamline development with IDE',
    description: 'Build and debug your modern Azure hosted web and cloud applications.',
  },
];

// ─── Component ───────────────────────────────────────────────────

const StaticWebApp: React.FC = () => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('get-started');

  return (
    <div className={styles.page}>
      <AzureGlobalHeader />
      <div className={styles.headerSection}>
        <AzureBreadcrumb items={[{ label: 'Home' }]} />
        <PageHeader
          title="coherence-preview"
          subtitle="Static Web App"
          icon={<AzureServiceIcon name="staticapps" size={28} />}
          onPin={() => {}}
          onMore={() => {}}
        />
      </div>
      <div className={styles.body}>
        <SideNavigation items={navItems} />
        <div className={styles.content}>
          <CommandBar
            items={[
              {
                items: [
                  { key: 'view-in-browser', label: 'View app in browser', icon: <Globe20Regular /> },
                  { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
                  { key: 'delete', label: 'Delete', icon: <Delete20Regular /> },
                  { key: 'deployment-token', label: 'Manage deployment token', icon: <Key20Regular /> },
                  { key: 'feedback', label: 'Send us your feedback', icon: <People20Regular /> },
                ],
              },
            ]}
          />

          <MessageBar intent="warning" layout="multiline">
            <MessageBarBody>
              Thank you for using Azure Static Web App! Configure a deployment to publish your app.{' '}
              <Link inline>Click here to learn more.</Link>
            </MessageBarBody>
          </MessageBar>

          <div className={styles.essentialsWrapper}>
            <EssentialsPanel
              leftItems={essentialsLeft}
              rightItems={essentialsRight}
              actions={essentialsActions}
              defaultExpanded
            />
          </div>

          <PageTabs
            tabs={[
              { value: 'get-started', label: 'Get started' },
              { value: 'monitoring', label: 'Monitoring' },
            ]}
            selectedValue={activeTab}
            onTabSelect={setActiveTab}
          />

          <div className={styles.tabContent}>
            {activeTab === 'get-started' && (
              <>
                {/* View your application */}
                <div>
                  <Text className={styles.sectionTitle}>View your application</Text>
                  <div className={styles.viewAppCard}>
                    <AzureServiceIcon name="staticapps" size={80} />
                    <div className={styles.appDetails}>
                      <Text className={styles.appDetailsLabel}>Status</Text>
                      <Text className={styles.appDetailsLabel}>Environment</Text>
                      <Text className={styles.appDetailsLabel}>Domain</Text>
                      <Text className={styles.appDetailsLabel}>Hosting plan</Text>
                      <Text className={styles.appDetailsValue}>Waiting for deployment</Text>
                      <Text className={styles.appDetailsValue}>Production</Text>
                      <Link>https://blue-glacier-0efa94c1e.6.azurestaticapps.net</Link>
                      <Text className={styles.appDetailsValue}>Free</Text>
                    </div>
                  </div>
                  <button className={styles.visitButton}>Visit your site</button>
                </div>

                {/* Prepare for production */}
                <div>
                  <Text className={styles.sectionTitle}>Prepare for production (0/3 completed)</Text>
                  <div className={styles.productionCards} style={{ marginTop: '16px' }}>
                    {productionCards.map((card) => (
                      <div key={card.title} className={styles.productionCard}>
                        <div className={styles.productionCardHeader}>
                          <AzureServiceIcon name={card.icon} size={36} />
                          <Link className={styles.productionCardTitle}>{card.title}</Link>
                        </div>
                        <Text className={styles.productionCardDescription}>{card.description}</Text>
                        <div className={styles.statusDot}>
                          <span className={styles.dot} />
                          Not completed
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Make the most of your Static Web App */}
                <div>
                  <Text className={styles.sectionTitle}>Make the most of your Static Web App</Text>
                  <div className={styles.makeTheMostCards} style={{ marginTop: '16px' }}>
                    {makeTheMostCards.map((card) => (
                      <CardButton
                        key={card.title}
                        variant="horizontal"
                        icon={card.icon}
                        label={card.title}
                        description={card.description}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'monitoring' && (
              <Text style={{ color: tokens.colorNeutralForeground3 }}>
                Monitoring content will appear here.
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticWebApp;
