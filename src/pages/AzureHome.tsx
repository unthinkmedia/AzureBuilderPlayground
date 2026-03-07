import React, { useState } from 'react';
import {
  Text,
  Link,
  makeStyles,
  tokens,
  TabList,
  Tab,
  DataGrid,
  DataGridHeader,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridHeaderCell,
  createTableColumn,
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowRight20Regular,
  Open12Regular,
} from '@fluentui/react-icons';
import {
  AzureGlobalHeader,
  AzureServiceIcon,
  CardButton,
} from '@azure-storybook/components';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  scrollArea: {
    flex: 1,
    overflow: 'auto',
    padding: '24px 40px 48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
    maxWidth: '1150px',
  },

  // Azure services row
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
  },
  servicesRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  serviceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '88px',
    padding: '12px 4px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: tokens.fontFamilyBase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  createIconCircle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  serviceLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForegroundLink,
    lineHeight: tokens.lineHeightBase200,
  },
  moreServicesCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '88px',
    padding: '12px 4px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: tokens.fontFamilyBase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  moreServicesArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    color: tokens.colorBrandForegroundLink,
    fontSize: '28px',
  },

  // Resources section
  resourcesSection: {
    marginBottom: '32px',
  },
  tabContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '0',
    marginTop: '8px',
  },
  tableWrapper: {
    padding: '0',
  },
  resourceIcon: {
    display: 'inline-flex',
    marginRight: '8px',
    verticalAlign: 'middle',
  },
  seeAll: {
    display: 'block',
    padding: '12px 16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  // Navigate section
  navigateSection: {
    marginBottom: '32px',
  },
  navigateRow: {
    display: 'flex',
    gap: '12px',
  },
  navigateCardWrapper: {
    display: 'flex',
    flex: '1 1 0',
    minWidth: 0,
    '& > button': {
      width: '100%',
      maxWidth: 'none',
      minWidth: 0,
    },
  },

  // Tools section
  toolsSection: {
    marginBottom: '32px',
  },
  toolsRow: {
    display: 'flex',
    gap: '12px',
  },
  toolCardWrapper: {
    display: 'flex',
    flex: '1 1 0',
    minWidth: 0,
    '& > button': {
      width: '100%',
      maxWidth: 'none',
      minWidth: 0,
    },
  },

  // Useful links + mobile app row
  bottomRow: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap',
  },
  usefulLinksSection: {
    flex: '1 1 400px',
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px 32px',
    marginTop: '8px',
  },
  linkItem: {
    fontSize: tokens.fontSizeBase300,
  },
  mobileAppSection: {
    flex: '0 0 auto',
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  badge: {
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: tokens.colorNeutralForeground1,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: '6px 12px',
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase100,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badgeLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badgeSmall: {
    fontSize: '8px',
    lineHeight: '1',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  badgeBig: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: '1.2',
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

// ─── Data ────────────────────────────────────────────────────────

const azureServices = [
  { icon: 'all-resources', label: 'All resources' },
  { icon: 'subscriptions', label: 'Subscriptions' },
  { icon: 'resource-groups', label: 'Resource\ngroups' },
  { icon: 'entraid', label: 'Microsoft Entra\nID' },
  { icon: 'apps', label: 'App Services' },
  { icon: 'api-management', label: 'API\nManagement..' },
  { icon: 'people', label: 'Microsoft Entra\nroles and...' },
  { icon: 'cosmosdb', label: 'Azure Cosmos\nDB' },
];

const navigateItems = [
  { icon: 'subscriptions', label: 'Subscriptions' },
  { icon: 'resource-groups', label: 'Resource groups' },
  { icon: 'all-resources', label: 'All resources' },
  { icon: 'dataarea', label: 'Dashboard' },
];

const toolItems = [
  {
    icon: 'learn',
    title: 'Microsoft Learn',
    description: 'Learn Azure with free online training from Microsoft',
    external: true,
  },
  {
    icon: 'monitor',
    title: 'Azure Monitor',
    description: 'Monitor your apps and infrastructure',
    external: false,
  },
  {
    icon: 'defender-for-cloud',
    title: 'Microsoft Defender for Cloud',
    description: 'Secure your apps and infrastructure',
    external: false,
  },
  {
    icon: 'cost-management',
    title: 'Cost Management',
    description: 'Analyze and optimize your cloud spend for free',
    external: false,
  },
];

interface RecentResource {
  name: string;
  icon: string;
  type: string;
  lastViewed: string;
}

const recentResources: RecentResource[] = [
  { name: 'coherence-preview', icon: 'apps', type: 'Static Web App', lastViewed: '2 hours ago' },
  { name: 'coherence-preview-rg', icon: 'resource-groups', type: 'Resource group', lastViewed: '4 hours ago' },
  { name: 'Service 360 Test', icon: 'subscriptions', type: 'Subscription', lastViewed: '4 hours ago' },
];

const usefulLinks = [
  { label: 'Technical Documentation', external: true },
  { label: 'Azure Services', external: true },
  { label: 'Recent Azure Updates', external: true },
  { label: 'Azure Migration Tools', external: false },
  { label: 'Find an Azure expert', external: false },
  { label: 'Quickstart Center', external: false },
];

const columns = [
  createTableColumn<RecentResource>({
    columnId: 'name',
    renderHeaderCell: () => 'Name',
    renderCell: (item) => (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <AzureServiceIcon name={item.icon} size={16} />
        <Link style={{ marginLeft: '8px' }}>{item.name}</Link>
      </span>
    ),
  }),
  createTableColumn<RecentResource>({
    columnId: 'type',
    renderHeaderCell: () => 'Type',
    renderCell: (item) => item.type,
  }),
  createTableColumn<RecentResource>({
    columnId: 'lastViewed',
    renderHeaderCell: () => 'Last Viewed',
    renderCell: (item) => item.lastViewed,
  }),
];

// ─── Component ───────────────────────────────────────────────────

const AzureHome: React.FC = () => {
  const styles = useStyles();
  const [resourceTab, setResourceTab] = useState<string>('recent');

  return (
    <div className={styles.page}>
      <AzureGlobalHeader />
      <div className={styles.scrollArea}>
        <div className={styles.innerContent}>
        {/* Azure services */}
        <Text as="h2" className={styles.sectionTitle}>Azure services</Text>
        <div className={styles.servicesRow}>
          {/* Create a resource - custom card with + icon */}
          <button className={styles.serviceCard}>
            <div className={styles.createIconCircle}>
              <Add24Regular />
            </div>
            <Text className={styles.serviceLabel}>Create a{'\n'}resource</Text>
          </button>

          {azureServices.map((svc) => (
            <CardButton
              key={svc.label}
              variant="square"
              icon={svc.icon}
              label={svc.label}
            />
          ))}

          {/* More services arrow */}
          <button className={styles.moreServicesCard}>
            <div className={styles.moreServicesArrow}>
              <ArrowRight20Regular />
            </div>
            <Text className={styles.serviceLabel}>More services</Text>
          </button>
        </div>

        {/* Resources */}
        <div className={styles.resourcesSection}>
          <Text as="h2" className={styles.sectionTitle}>Resources</Text>
          <TabList
            selectedValue={resourceTab}
            onTabSelect={(_e, data) => setResourceTab(data.value as string)}
          >
            <Tab value="recent">Recent</Tab>
            <Tab value="favorite">Favorite</Tab>
          </TabList>
          <div className={styles.tabContent}>
            <div className={styles.tableWrapper}>
              <DataGrid
                items={recentResources}
                columns={columns}
                getRowId={(item) => item.name}
              >
                <DataGridHeader>
                  <DataGridRow>
                    {({ renderHeaderCell }) => (
                      <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<RecentResource>>
                  {({ item, rowId }) => (
                    <DataGridRow<RecentResource> key={rowId}>
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            </div>
            <Link className={styles.seeAll}>See all</Link>
          </div>
        </div>

        {/* Navigate */}
        <div className={styles.navigateSection}>
          <Text as="h2" className={styles.sectionTitle}>Navigate</Text>
          <div className={styles.navigateRow}>
            {navigateItems.map((item) => (
              <div key={item.label} className={styles.navigateCardWrapper}>
                <CardButton
                  variant="horizontal"
                  icon={item.icon}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className={styles.toolsSection}>
          <Text as="h2" className={styles.sectionTitle}>Tools</Text>
          <div className={styles.toolsRow}>
            {toolItems.map((tool) => (
              <div key={tool.title} className={styles.toolCardWrapper}>
                <CardButton
                  variant="horizontal"
                  icon={tool.icon}
                  label={tool.title}
                  description={tool.description}
                  external={tool.external}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Useful links + Azure mobile app */}
        <div className={styles.bottomRow}>
          <div className={styles.usefulLinksSection}>
            <Text as="h2" className={styles.sectionTitle}>Useful links</Text>
            <div className={styles.linksGrid}>
              {usefulLinks.map((link) => (
                <Link key={link.label} className={styles.linkItem}>
                  {link.label}
                  {link.external && <> <Open12Regular /></>}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.mobileAppSection}>
            <Text as="h2" className={styles.sectionTitle}>Azure mobile app</Text>
            <div className={styles.badgeRow}>
              <button className={styles.badge}>
                <span style={{ fontSize: '20px' }}>&#63743;</span>
                <span className={styles.badgeLabel}>
                  <span className={styles.badgeSmall}>Download on the</span>
                  <span className={styles.badgeBig}>App Store</span>
                </span>
              </button>
              <button className={styles.badge}>
                <span style={{ fontSize: '20px' }}>&#9654;</span>
                <span className={styles.badgeLabel}>
                  <span className={styles.badgeSmall}>GET IT ON</span>
                  <span className={styles.badgeBig}>Google Play</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AzureHome;
