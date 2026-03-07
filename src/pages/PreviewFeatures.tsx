import React from 'react';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  SearchBox,
  Switch,
  Text,
  createTableColumn,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Dismiss20Regular,
  People20Regular,
  Save20Regular,
} from '@fluentui/react-icons';
import {
  AzureBreadcrumb,
  AzureGlobalHeader,
  AzureServiceIcon,
  CommandBar,
  FilterPill,
  PageHeader,
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
  description: {
    padding: '12px 16px',
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  gridWrapper: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
  },
});

// ─── Data ────────────────────────────────────────────────────────

const navItems: NavItem[] = [
    { key: 'overview', label: 'Overview', icon: <AzureServiceIcon name="info" size={18} /> },
    { key: 'preview-features', label: 'Preview features', icon: <AzureServiceIcon name="previewfeatures" size={18} />, selected: true },
    { key: 'diagnose', label: 'Diagnose and solve problems', icon: <AzureServiceIcon name="wrench" size={18} /> },
    { key: 'manage', label: 'Manage', children: [{ key: 'users', label: 'Users', icon: <AzureServiceIcon name="people" size={18} /> }, { key: 'groups', label: 'Groups', icon: <AzureServiceIcon name="group" size={18} /> }, { key: 'external-identities', label: 'External Identities', icon: <AzureServiceIcon name="externalidentities" size={18} /> }, { key: 'roles', label: 'Roles and administrators', icon: <AzureServiceIcon name="shield" size={18} /> }, { key: 'admin-units', label: 'Administrative units', icon: <AzureServiceIcon name="organization" size={18} /> }, { key: 'delegated-admin', label: 'Delegated admin partners', icon: <AzureServiceIcon name="people" size={18} /> }, { key: 'enterprise-apps', label: 'Enterprise applications', icon: <AzureServiceIcon name="apps" size={18} /> }, { key: 'devices', label: 'Devices', icon: <AzureServiceIcon name="laptop" size={18} /> }, { key: 'app-registrations', label: 'App registrations', icon: <AzureServiceIcon name="grid" size={18} /> }, { key: 'identity-governance', label: 'Identity Governance', icon: <AzureServiceIcon name="shield" size={18} /> }, { key: 'app-proxy', label: 'Application proxy', icon: <AzureServiceIcon name="globe" size={18} /> }, { key: 'custom-security', label: 'Custom security attributes', icon: <AzureServiceIcon name="lock" size={18} /> }, { key: 'licenses', label: 'Licenses', icon: <AzureServiceIcon name="certificate" size={18} /> }] },
  ];

type Item = { id: string; name: string, category: string, services: string, releaseType: string, releaseDate: string, state: string };

const items: Item[] = []; // TODO: populate with real data

const columns = [
    createTableColumn({
      columnId: 'name',
      renderHeaderCell: () => 'Name',
      renderCell: (item) => <Text>{item.name}</Text>,
    }),
    createTableColumn({
      columnId: 'category',
      renderHeaderCell: () => 'Category',
      renderCell: (item) => <Text>{item.category}</Text>,
    }),
    createTableColumn({
      columnId: 'services',
      renderHeaderCell: () => 'Services',
      renderCell: (item) => <Text>{item.services}</Text>,
    }),
    createTableColumn({
      columnId: 'releaseType',
      renderHeaderCell: () => 'Release type',
      renderCell: (item) => <Text>{item.releaseType}</Text>,
    }),
    createTableColumn({
      columnId: 'releaseDate',
      renderHeaderCell: () => 'Release date',
      renderCell: (item) => <Text>{item.releaseDate}</Text>,
    }),
    createTableColumn({
      columnId: 'state',
      renderHeaderCell: () => 'State',
      renderCell: (item) => item.state === 'On' ? <Switch checked /> : <Text>{item.state}</Text>,
    }),
  ];

// ─── Component ───────────────────────────────────────────────────

const PreviewFeatures: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      <AzureGlobalHeader />
      <div className={styles.headerSection}>
        <AzureBreadcrumb items={[{ label: 'Home' }, { label: 'Default Directory', current: true }]} />
        <PageHeader title="Default Directory | Preview features" icon={<AzureServiceIcon name="entraid" size={28} />} onPin={() => {}} onMore={() => {}} />
      </div>
      <div className={styles.body}>
        <SideNavigation items={navItems} />
        <div className={styles.content}>
          <CommandBar items={[{ items: [{ key: 'save-btn', label: 'Save', icon: <Save20Regular /> }, { key: 'discard-btn', label: 'Discard', icon: <Dismiss20Regular /> }] }, { items: [{ key: 'feedback-link', label: 'Got feedback?', icon: <People20Regular /> }] }]} />
          <Text className={styles.description}>The following preview features are available for your evaluation. Help us make them better!</Text>
          <div className={styles.filterRow}>
            <SearchBox placeholder="Search" style={{ minWidth: 200 }} />
            <FilterPill />
          </div>
          <div className={styles.gridWrapper}>
            <DataGrid
              items={items}
              columns={columns}
              sortable
              getRowId={(item) => item.id}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Item>>
                {({ item, rowId }) => (
                  <DataGridRow<Item> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewFeatures;
