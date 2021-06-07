import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  DashboardCollectionsLocation,
  DashboardLocation,
  DashboardOverviewLocation,
  DashboardSystemStatusLocation,
  ExplorerBlocksLocation,
  ExplorerIndexesLocation,
  ExplorerLocation,
  ExplorerLogsLocation,
  ExplorerReceiptsLocation,
  ExplorerTracesLocation,
  ExplorerTransactionsLocation,
  NamesAdressesLocation,
  NamesBlocksLocation,
  NamesLocation,
  NamesMonitorsLocation,
  NamesSignaturesLocation,
  NamesTagsLocation,
  RootLocation,
  SupportAboutUsLocation,
  SupportContactUsLocation,
  SupportDocumentationLocation,
  SupportHotKeysLocation,
  SupportLicensingLocation,
  SupportLocation,
  SystemCachesLocation,
  SystemLocation,
  SystemSchemasLocation,
  SystemScrapersLocation,
  SystemSkinsLocation,
} from './locations';

import {
  DashboardView,
  ExplorerView,
  NamesView,
  SupportView,
  SystemView,
} from './views';

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
    path: DashboardCollectionsLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: DashboardSystemStatusLocation,
    exact: true,
    component: DashboardView,
  },
  {
    path: NamesLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesMonitorsLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesAdressesLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesTagsLocation,
    exact: true,
    component: NamesView,
  },
  {
    path: NamesSignaturesLocation,
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
    path: ExplorerIndexesLocation,
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
    path: SystemLocation,
    exact: true,
    component: SystemView,
  },
  {
    path: SystemScrapersLocation,
    exact: true,
    component: SystemView,
  },
  {
    path: SystemCachesLocation,
    exact: true,
    component: SystemView,
  },
  {
    path: SystemSkinsLocation,
    exact: true,
    component: SystemView,
  },
  {
    path: SystemSchemasLocation,
    exact: true,
    component: SystemView,
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
