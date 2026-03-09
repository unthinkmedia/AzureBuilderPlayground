import React, { useState } from 'react';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Link,
  SearchBox,
  Select,
  Text,
  createTableColumn,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import {
  Add20Regular,
  ArrowDownload20Regular,
  ArrowSync20Regular,
  Delete20Regular,
  Eye20Regular,
  Open20Regular,
  Tag20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  GroupList20Regular,
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
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  addFilterLink: {
    fontSize: tokens.fontSizeBase200,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  gridWrapper: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    flexShrink: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  pageButton: {
    minWidth: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  pageButtonActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    borderTopColor: tokens.colorBrandBackground,
    borderRightColor: tokens.colorBrandBackground,
    borderBottomColor: tokens.colorBrandBackground,
    borderLeftColor: tokens.colorBrandBackground,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
});

// ─── Data ────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { key: 'resource-manager', label: 'Resource Manager', icon: <AzureServiceIcon name="resource-manager" size={18} /> },
  { key: 'all-resources', label: 'All resources', icon: <AzureServiceIcon name="all-resources" size={18} />, selected: true },
  { key: 'favorite-resources', label: 'Favorite resources', icon: <AzureServiceIcon name="favorites" size={18} /> },
  { key: 'recent-resources', label: 'Recent resources', icon: <AzureServiceIcon name="recent" size={18} /> },
  { key: 'resource-groups', label: 'Resource groups', icon: <AzureServiceIcon name="resource-groups" size={18} /> },
  { key: 'tags', label: 'Tags', icon: <AzureServiceIcon name="tags" size={18} /> },
  { key: 'organization', label: 'Organization', children: [
    { key: 'service-groups', label: 'Service groups', icon: <AzureServiceIcon name="people" size={18} /> },
    { key: 'management-groups', label: 'Management groups', icon: <AzureServiceIcon name="management-groups" size={18} /> },
    { key: 'subscriptions', label: 'Subscriptions', icon: <AzureServiceIcon name="subscriptions" size={18} /> },
  ] },
  { key: 'tools', label: 'Tools', children: [
    { key: 'resource-graph-explorer', label: 'Resource graph explorer', icon: <AzureServiceIcon name="resource-graph-explorer" size={18} /> },
    { key: 'resource-graph-queries', label: 'Resource graph queries', icon: <AzureServiceIcon name="resource-graph-queries" size={18} /> },
    { key: 'resource-visualizer', label: 'Resource visualizer', icon: <AzureServiceIcon name="resource-visualizer" size={18} /> },
    { key: 'resource-explorer', label: 'Resource explorer', icon: <AzureServiceIcon name="resource-explorer" size={18} /> },
    { key: 'arm-api-playground', label: 'ARM API playground', icon: <AzureServiceIcon name="arm-api-playground" size={18} /> },
    { key: 'resource-mover', label: 'Resource mover', icon: <AzureServiceIcon name="resource-mover" size={18} /> },
  ] },
  { key: 'deployments', label: 'Deployments', children: [
    { key: 'templates', label: 'Templates', icon: <AzureServiceIcon name="templates" size={18} /> },
    { key: 'template-specs', label: 'Template specs', icon: <AzureServiceIcon name="template-specs" size={18} /> },
  ] },
  { key: 'help', label: 'Help', children: [
    { key: 'support', label: 'Support + troubleshooting', icon: <AzureServiceIcon name="help-support" size={18} /> },
  ] },
];

type ResourceItem = {
  id: string;
  name: string;
  type: string;
  resourceGroup: string;
  location: string;
  subscription: string;
};

const items: ResourceItem[] = [
  { id: '1', name: '0.0.1 (AzHPCImageGallery/AlmaLinuxHPC-8.6-gen2/0.0.1)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '2', name: '0.0.1 (AzHPCImageGallery/AlmaLinuxHPC-8.7-gen2/0.0.1)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '3', name: '0.0.1 (AzHPCImageGallery/CentOSHPC-7.9-gen2/0.0.1)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '4', name: '0.0.1 (AzHPCImageGallery/CentOSHPC-8.3-gen2/0.0.1)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '5', name: '0.0.1 (AzHPCImageGallery/Experimental/0.0.1)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '6', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-18.04-H100-gen2/0...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '7', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-18.04-LTS-gen1/0.0...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '8', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-18.04-LTS-gen2/0.0...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '9', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-18.04-driver470-LTS...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'South Central US', subscription: 'HPCScrub1' },
  { id: '10', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-18.04-driver470-LTS...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'South Central US', subscription: 'HPCScrub1' },
  { id: '11', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-18.04-gen2/0.0.1)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '12', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-20.04-H100-gen2/0...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'West US 2', subscription: 'HPCScrub1' },
  { id: '13', name: '0.0.1 (AzHPCImageGallery/UbuntuHPC-20.04-ROCm-gen2/...)', type: 'VM image version', resourceGroup: 'azhpc-images-rg', location: 'South Central US', subscription: 'HPCScrub1' },
];

const columns = [
  createTableColumn<ResourceItem>({
    columnId: 'name',
    renderHeaderCell: () => 'Name ↑',
    renderCell: (item) => (
      <Link style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <AzureServiceIcon name="grid" size={16} />
        {item.name}
      </Link>
    ),
  }),
  createTableColumn<ResourceItem>({
    columnId: 'type',
    renderHeaderCell: () => 'Type',
    renderCell: (item) => <Text>{item.type}</Text>,
  }),
  createTableColumn<ResourceItem>({
    columnId: 'resourceGroup',
    renderHeaderCell: () => 'Resource Group',
    renderCell: (item) => <Link>{item.resourceGroup}</Link>,
  }),
  createTableColumn<ResourceItem>({
    columnId: 'location',
    renderHeaderCell: () => 'Location',
    renderCell: (item) => <Text>{item.location}</Text>,
  }),
  createTableColumn<ResourceItem>({
    columnId: 'subscription',
    renderHeaderCell: () => 'Subscription',
    renderCell: (item) => <Link>{item.subscription}</Link>,
  }),
];

// ─── Component ───────────────────────────────────────────────────

const AllResources: React.FC = () => {
  const styles = useStyles();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={styles.page}>
      <AzureGlobalHeader />
      <div className={styles.headerSection}>
        <AzureBreadcrumb items={[{ label: 'Home' }, { label: 'Resource Manager', current: true }]} />
        <PageHeader
          title="Resource Manager | All resources"
          icon={<AzureServiceIcon name="all-resources" size={28} />}
          onPin={() => {}}
          onMore={() => {}}
          copilotSuggestions={{
            suggestions: [
              { label: 'Generate Terraform templates for selected resources' },
              { label: 'Review capacity errors across resources' },
              { label: 'Generate Bicep code for managing multiple resources' },
            ],
          }}
        />
      </div>
      <div className={styles.body}>
        <SideNavigation items={navItems} />
        <div className={styles.content}>
          <CommandBar
            items={[
              {
                items: [
                  { key: 'create-btn', label: 'Create', icon: <Add20Regular /> },
                  { key: 'manage-view-btn', label: 'Manage view', icon: <Eye20Regular /> },
                  { key: 'refresh-btn', label: 'Refresh', icon: <ArrowSync20Regular /> },
                  { key: 'export-csv-btn', label: 'Export to CSV', icon: <ArrowDownload20Regular /> },
                  { key: 'open-query-btn', label: 'Open query', icon: <Open20Regular /> },
                ],
              },
              {
                items: [
                  { key: 'assign-tags-btn', label: 'Assign tags', icon: <Tag20Regular /> },
                  { key: 'delete-btn', label: 'Delete', icon: <Delete20Regular />, disabled: true },
                  { key: 'add-service-group-btn', label: 'Add to service group', icon: <Add20Regular /> },
                ],
              },
            ]}
            farItems={[
              { key: 'group-by', label: 'Group by none', icon: <GroupList20Regular /> },
            ]}
          />
          <div className={styles.filterRow}>
            <SearchBox placeholder="Filter for any field..." style={{ minWidth: 200 }} />
            <FilterPill label="Subscription" value="17 selected" />
            <FilterPill label="Resource Group" value="all" />
            <FilterPill label="Type" value="all" />
            <FilterPill label="Location" value="all" />
            <Link className={styles.addFilterLink}>
              <Add20Regular /> Add filter
            </Link>
          </div>
          <div className={styles.gridWrapper}>
            <DataGrid
              items={items}
              columns={columns}
              sortable
              selectionMode="multiselect"
              getRowId={(item) => item.id}
            >
              <DataGridHeader>
                <DataGridRow selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all rows' } }}>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<ResourceItem>>
                {({ item, rowId }) => (
                  <DataGridRow<ResourceItem> key={rowId} selectionCell={{ checkboxIndicator: { 'aria-label': `Select ${item.name}` } }}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
          <div className={styles.pagination}>
            <Text size={200}>Showing 1 - 13 of 2730. Display count:</Text>
            <Select size="small" defaultValue="auto" style={{ minWidth: 60 }}>
              <option>auto</option>
              <option>15</option>
              <option>30</option>
              <option>50</option>
              <option>100</option>
            </Select>
            <button className={styles.pageButton} aria-label="Previous page"><ChevronLeft20Regular /></button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={mergeClasses(styles.pageButton, p === currentPage && styles.pageButtonActive)}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button className={styles.pageButton} aria-label="Next page"><ChevronRight20Regular /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllResources;
