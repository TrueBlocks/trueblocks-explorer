import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AccountFunctionsLocation,
  AccountFunctionsLocationAddressTemplate,
  AccountGasLocation,
  AccountGasLocationAddressTemplate,
  AccountReconsLocation,
  AccountReconsLocationAddressTemplate,
  AccountTracesLocation,
  AccountTracesLocationAddressTemplate,
  AccountTransactionsLocation,
  AccountTransactionsLocationAddressTemplate,
  DashboardAccountsAddressLocationTemplate,
  DashboardAccountsLocation,
  DashboardCollectionsLocation,
  DashboardLocation,
  DashboardMonitorsLocation,
  DashboardOverviewLocation,
  ExplorerBlocksLocation,
  ExplorerLocation,
  ExplorerLogsLocation,
  ExplorerReceiptsLocation,
  ExplorerTracesLocation,
  ExplorerTransactionsLocation,
  NamesAddressesLocation,
  NamesBlocksLocation,
  NamesEventSigsLocation,
  NamesFuncSigsLocation,
  NamesLocation,
  NamesTagsLocation,
  RootLocation,
  SettingsCachesLocation,
  SettingsIndexChartsLocation,
  SettingsIndexesLocation,
  SettingsIndexGridLocation,
  SettingsIndexTableLocation,
  SettingsLocation,
  SettingsSchemasLocation,
  SettingsScrapersLocation,
  SettingsSkinsLocation,
  SupportAboutUsLocation,
  SupportContactUsLocation,
  SupportDocumentationLocation,
  SupportHotKeysLocation,
  SupportLicensingLocation,
  SupportLocation,
} from './locations';
import { DashboardView, ExplorerView, NamesView, SettingsView, SupportView } from './views';

const routes = [
  {
    path: RootLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: DashboardLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: DashboardOverviewLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: DashboardAccountsLocation,
    exact: true,
    component: DashboardView,
  },
  { path: DashboardAccountsAddressLocationTemplate, component: DashboardView },
  { path: AccountTransactionsLocationAddressTemplate, component: DashboardView },
  { path: AccountFunctionsLocationAddressTemplate, component: DashboardView },
  { path: AccountGasLocationAddressTemplate, component: DashboardView },
  { path: AccountTracesLocationAddressTemplate, component: DashboardView },
  { path: AccountReconsLocationAddressTemplate, component: DashboardView },
  {
    path: AccountTransactionsLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: AccountFunctionsLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: AccountGasLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: AccountTracesLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: AccountReconsLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: DashboardMonitorsLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: DashboardCollectionsLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: NamesLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesAddressesLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesTagsLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesFuncSigsLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesEventSigsLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesBlocksLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: ExplorerLocation,
    exact: true,
    component: ExplorerView,
  },
  {
    path: ExplorerBlocksLocation,
    exact: true,
    component: ExplorerView,
  },
  {
    path: ExplorerTransactionsLocation,
    exact: true,
    component: ExplorerView,
  },
  {
    path: ExplorerReceiptsLocation,
    exact: true,
    component: ExplorerView,
  },
  {
    path: ExplorerLogsLocation,
    exact: true,
    component: ExplorerView,
  },
  {
    path: ExplorerTracesLocation,
    exact: true,
    component: ExplorerView,
  },
  {
    path: SettingsLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsScrapersLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsIndexesLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsIndexGridLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsIndexTableLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsIndexChartsLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsCachesLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsSkinsLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SettingsSchemasLocation,
    exact: true,
    component: SettingsView,
  },
  {
    path: SupportLocation,
    exact: true,
    component: SupportView,
  },
  {
    path: SupportContactUsLocation,
    exact: true,
    component: SupportView,
  },
  {
    path: SupportDocumentationLocation,
    exact: true,
    component: SupportView,
  },
  {
    path: SupportHotKeysLocation,
    exact: true,
    component: SupportView,
  },
  {
    path: SupportLicensingLocation,
    exact: true,
    component: SupportView,
  },
  {
    path: SupportAboutUsLocation,
    exact: true,
    component: SupportView,
  },
];

const CustomRoute = (props: any) => {
  const { path, component, exact } = props;

  return <Route path={path} component={component} exact={exact} />;
};

export const Routes = () => (
  <Switch>
    {routes.map((props) => (
      <CustomRoute key={props.path} {...props} />
    ))}
    <DashboardView />
  </Switch>
);
