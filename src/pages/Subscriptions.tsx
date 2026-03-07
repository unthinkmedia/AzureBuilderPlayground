import React from 'react';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Link,
  SearchBox,
  Text,
  createTableColumn,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Add20Regular,
  ArrowDownload20Regular,
  Eye20Regular,
  List20Regular,
  Shield20Regular,
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
  { key: 'resource-manager', label: 'Resource Manager', icon: <AzureServiceIcon name="settings" size={18} /> },
  { key: 'all-resources', label: 'All resources', icon: <AzureServiceIcon name="grid" size={18} /> },
  { key: 'favorite-resources', label: 'Favorite resources', icon: <AzureServiceIcon name="star" size={18} /> },
  { key: 'recent-resources', label: 'Recent resources', icon: <AzureServiceIcon name="clock" size={18} /> },
  { key: 'resource-groups', label: 'Resource groups', icon: <AzureServiceIcon name="folder" size={18} /> },
  { key: 'tags', label: 'Tags', icon: <AzureServiceIcon name="tag" size={18} /> },
  { key: 'organization', label: 'Organization', children: [
    { key: 'service-groups', label: 'Service groups', icon: <AzureServiceIcon name="people" size={18} /> },
    { key: 'management-groups', label: 'Management groups', icon: <AzureServiceIcon name="organization" size={18} /> },
  ] },
  { key: 'subscriptions', label: 'Subscriptions', icon: <AzureServiceIcon name="key" size={18} />, selected: true },
  { key: 'tools', label: 'Tools', children: [
    { key: 'resource-graph-explorer', label: 'Resource graph explorer', icon: <AzureServiceIcon name="dataarea" size={18} /> },
    { key: 'resource-graph-queries', label: 'Resource graph queries', icon: <AzureServiceIcon name="document" size={18} /> },
    { key: 'resource-visualizer', label: 'Resource visualizer', icon: <AzureServiceIcon name="eye" size={18} /> },
    { key: 'resource-explorer', label: 'Resource explorer', icon: <AzureServiceIcon name="search" size={18} /> },
    { key: 'arm-api-playground', label: 'ARM API playground', icon: <AzureServiceIcon name="code" size={18} /> },
    { key: 'resource-mover', label: 'Resource mover', icon: <AzureServiceIcon name="arrowmove" size={18} /> },
  ] },
  { key: 'deployments', label: 'Deployments', children: [
    { key: 'templates', label: 'Templates', icon: <AzureServiceIcon name="document" size={18} /> },
    { key: 'template-specs', label: 'Template specs', icon: <AzureServiceIcon name="document" size={18} /> },
  ] },
  { key: 'help', label: 'Help', children: [
    { key: 'support', label: 'Support + troubleshooting', icon: <AzureServiceIcon name="questioncircle" size={18} /> },
  ] },
];

type Item = {
  id: string;
  subscriptionName: string;
  subscriptionId: string;
  myRole: string;
  currentCost: string;
  secureScore: string;
};

const items: Item[] = [
  { id: '1', subscriptionName: '1ES-MCP', subscriptionId: '076b00c5-69cb-4fbf-927c-e3473de84ab5', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '2', subscriptionName: 'ADR-nonprod-grafana', subscriptionId: '07b929e5-80fe-4775-95f5-d25ceddf0e90', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '3', subscriptionName: 'AEP_CorePlatform_Playground_Dev', subscriptionId: '84ca48fe-c942-42e5-b492-d56681d058fa', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '4', subscriptionName: 'AG_Arch_jasonrobert', subscriptionId: 'a1e43715-e363-4f91-a4d8-b5ea2299cd0c', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '5', subscriptionName: 'AI Impact Analyzer', subscriptionId: '879c3e12-a379-45c7-b1b1-5a44f3cc2713', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '6', subscriptionName: 'AISC-DEV-02', subscriptionId: 'b2a328a7-ffff-4c09-b643-a4758cf170bc', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '7', subscriptionName: 'AISC-EngSys-01', subscriptionId: 'eef8b6d5-94da-4b36-9327-a662f2674efb', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '8', subscriptionName: 'AKS Global corpdev', subscriptionId: 'f7616b56-4c4f-481f-8a80-0e0f51d430c5', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '9', subscriptionName: 'AML - Responsible AI R&D', subscriptionId: 'e0fd569c-e34a-4249-8c24-e8d723c7f054', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '10', subscriptionName: 'AML Infra - Engineering System', subscriptionId: 'f1d79e73-f8e3-4b10-bfdb-4207ca0723ed', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '11', subscriptionName: 'Applied Sciences Group Dev', subscriptionId: 'e686ef8c-d35d-4e9b-92f8-caaaa7948c0a', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '12', subscriptionName: 'ARM Test Environment', subscriptionId: '2145a411-d149-4010-84d4-40fe8a55db44', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '13', subscriptionName: 'ASM Kustodian Corp', subscriptionId: 'a178425c-491a-416c-b313-39dce68d9b86', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '14', subscriptionName: 'ASZ_Lab_Hardware_Dev_1', subscriptionId: 'e2a8a7b3-cb7a-4930-9c79-2b0eb7bf843c', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '15', subscriptionName: 'AVNM-MSFT-01', subscriptionId: '2c505610-a5dd-473e-aa33-b31aac398e29', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '16', subscriptionName: 'AVNM-MSFT-02', subscriptionId: '531c5c86-c959-41ec-911f-5404a0b217b8', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '17', subscriptionName: 'AVNM-MSFT-03', subscriptionId: 'd1cb9e0d-697e-40cf-bc22-53501ce396c3', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
  { id: '18', subscriptionName: 'AVNM-MSFT-04', subscriptionId: '80b3c054-b86a-49b9-9a14-38f9f30f9e34', myRole: 'Resource access', currentCost: 'Unauthorized', secureScore: '-' },
];

const columns = [
  createTableColumn<Item>({
    columnId: 'subscriptionName',
    renderHeaderCell: () => 'Subscription name',
    renderCell: (item) => <Link>{item.subscriptionName}</Link>,
  }),
  createTableColumn<Item>({
    columnId: 'subscriptionId',
    renderHeaderCell: () => 'Subscription ID',
    renderCell: (item) => <Text>{item.subscriptionId}</Text>,
  }),
  createTableColumn<Item>({
    columnId: 'myRole',
    renderHeaderCell: () => 'My role',
    renderCell: (item) => <Text>{item.myRole}</Text>,
  }),
  createTableColumn<Item>({
    columnId: 'currentCost',
    renderHeaderCell: () => 'Current cost',
    renderCell: (item) => <Text>{item.currentCost}</Text>,
  }),
  createTableColumn<Item>({
    columnId: 'secureScore',
    renderHeaderCell: () => 'Secure Score',
    renderCell: (item) => <Text>{item.secureScore}</Text>,
  }),
];

// ─── Component ───────────────────────────────────────────────────

const Subscriptions: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      <AzureGlobalHeader />
      <div className={styles.headerSection}>
        <AzureBreadcrumb items={[{ label: 'Home' }, { label: 'Resource Manager', current: true }]} />
        <PageHeader title="Resource Manager | Subscriptions" icon={<AzureServiceIcon name="subscriptions" size={28} />} onPin={() => {}} onMore={() => {}} />
      </div>
      <div className={styles.body}>
        <SideNavigation items={navItems} />
        <div className={styles.content}>
          <CommandBar items={[{ items: [{ key: 'add-btn', label: 'Add', icon: <Add20Regular /> }, { key: 'manage-policies-btn', label: 'Manage Policies', icon: <Shield20Regular /> }, { key: 'view-requests-btn', label: 'View Requests', icon: <List20Regular /> }, { key: 'view-eligible-btn', label: 'View eligible subscriptions', icon: <Eye20Regular /> }, { key: 'export-csv-btn', label: 'Export to CSV', icon: <ArrowDownload20Regular /> }] }]} />
          <Text className={styles.description}>Showing subscriptions in Microsoft directory. Don't see a subscription? Switch directories</Text>
          <div className={styles.filterRow}>
            <SearchBox placeholder="Search for any ..." style={{ minWidth: 200 }} />
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

export default Subscriptions;
