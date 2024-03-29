/*
 * Parts of this file were generated with makeClass --js. Edit only those parts of
 * the code outside of the BEG_CODE/END_CODE sections
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Mousetrap from 'mousetrap';

import {
  DashboardView, ExplorerView, NamesView, SettingsView, SupportView,
} from './views';

export const RootLocation = '/';

export const DashboardLocation = '/dashboard';
export const DashboardMonitorsLocation = '/dashboard/monitors';
export const DashboardAccountsLocation = '/address';
export const DashboardAccountsAddressLocation = '/address/:address';
export const DashboardAccountsAssetsLocation = '/address/:address/assets';
export const DashboardAccountsHistoryLocation = '/address/:address/history';
export const DashboardAccountsHistoryReconsLocation = '/address/:address/history/recons';
export const DashboardAccountsHistoryFunctionsLocation = '/address/:address/history/functions';
export const DashboardAccountsHistoryEventsLocation = '/address/:address/history/events';

export const DashboardAccountsHistoryCustomLocation = '/address/:address/history/custom';
export const DashboardAccountsNeighborsLocation = '/address/:address/neighbors';
export const DashboardAccountsGasLocation = '/address/:address/gas';
// export const DashboardAccountsChartsLocation = '/address/:address/charts';
export const DashboardAccountsFunctionsLocation = '/address/:address/functions';
export const DashboardAccountsEventsLocation = '/address/:address/events';
export const DashboardCollectionsLocation = '/dashboard/collections';

export const NamesLocation = '/names';
export const NamesAddressesLocation = '/names/addresses';
export const NamesTagsLocation = '/names/tags';
export const NamesSignaturesLocation = '/names/signatures';
export const NamesSignaturesFunctionsLocation = '/names/signatures/functions';
export const NamesSignaturesEventsLocation = '/names/signatures/events';
export const NamesBlocksLocation = '/names/blocks';

export const ExplorerLocation = '/explorer';
export const ExplorerBlocksLocation = '/explorer/blocks/:block?';
export const ExplorerTransactionsLocation = '/explorer/transactions';
export const ExplorerReceiptsLocation = '/explorer/receipts';
export const ExplorerLogsLocation = '/explorer/logs';
export const ExplorerTracesLocation = '/explorer/traces';

export const SettingsLocation = '/settings';
export const SettingsScrapersLocation = '/settings/scrapers';
export const SettingsIndexesLocation = '/settings/indexes';
export const SettingsIndexesGridLocation = '/settings/indexes/grid';
export const SettingsIndexesTableLocation = '/settings/indexes/table';
export const SettingsIndexesChartsLocation = '/settings/indexes/charts';
export const SettingsIndexesManifestLocation = '/settings/indexes/manifest';
export const SettingsCachesLocation = '/settings/caches';
export const SettingsSkinsLocation = '/settings/skins';
export const SettingsDataModelLocation = '/settings/datamodel';

export const SupportLocation = '/support';
export const SupportContactUsLocation = '/support/contact-us';
export const SupportDocumentationLocation = '/support/documentation';
export const SupportHotKeysLocation = '/support/hot-keys';
export const SupportLicensingLocation = '/support/licensing';
export const SupportAboutUsLocation = '/support/about-us';

export const rootLocations = [
  RootLocation,
];

export const dashboardLocations = [
  DashboardLocation,
  DashboardMonitorsLocation,
  DashboardAccountsLocation,
  DashboardAccountsAddressLocation,
  DashboardAccountsAssetsLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsHistoryReconsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsNeighborsLocation,
  DashboardAccountsGasLocation,
  // DashboardAccountsChartsLocation,
  DashboardAccountsFunctionsLocation,
  DashboardAccountsEventsLocation,
  DashboardCollectionsLocation,
];

const namesLocations = [
  NamesLocation,
  NamesAddressesLocation,
  NamesTagsLocation,
  NamesSignaturesLocation,
  NamesSignaturesFunctionsLocation,
  NamesSignaturesEventsLocation,
  NamesBlocksLocation,
];

const explorerLocations = [
  ExplorerLocation,
  ExplorerBlocksLocation,
  ExplorerTransactionsLocation,
  ExplorerReceiptsLocation,
  ExplorerLogsLocation,
  ExplorerTracesLocation,
];

const settingsLocations = [
  SettingsLocation,
  SettingsScrapersLocation,
  SettingsIndexesLocation,
  SettingsIndexesGridLocation,
  SettingsIndexesTableLocation,
  SettingsIndexesChartsLocation,
  SettingsIndexesManifestLocation,
  SettingsCachesLocation,
  SettingsSkinsLocation,
  SettingsDataModelLocation,
];

const supportLocations = [
  SupportLocation,
  SupportContactUsLocation,
  SupportDocumentationLocation,
  SupportHotKeysLocation,
  SupportLicensingLocation,
  SupportAboutUsLocation,
];

// Config objects
const routes = [
  {
    path: rootLocations.concat(dashboardLocations),
    exact: true,
    component: DashboardView,
  },
  {
    path: namesLocations,
    exact: true,
    component: NamesView,
  },
  {
    path: explorerLocations,
    exact: true,
    component: ExplorerView,
  },
  {
    path: settingsLocations,
    exact: true,
    component: SettingsView,
  },
  {
    path: supportLocations,
    exact: true,
    component: SupportView,
  },
];

Mousetrap.bind('s m', () => {
  window.location.href = DashboardMonitorsLocation;
});
Mousetrap.bind('s a', () => {
  window.location.href = DashboardAccountsLocation;
});
Mousetrap.bind('s n', () => {
  window.location.href = NamesLocation;
});
Mousetrap.bind('s e', () => {
  window.location.href = ExplorerLocation;
});
Mousetrap.bind('e b', () => {
  window.location.href = ExplorerBlocksLocation;
});
Mousetrap.bind('e t', () => {
  window.location.href = ExplorerTransactionsLocation;
});
Mousetrap.bind('e r', () => {
  window.location.href = ExplorerReceiptsLocation;
});
Mousetrap.bind('e l', () => {
  window.location.href = ExplorerLogsLocation;
});
Mousetrap.bind('e c', () => {
  window.location.href = ExplorerTracesLocation;
});
Mousetrap.bind('s s', () => {
  window.location.href = SettingsLocation;
});
Mousetrap.bind('s u', () => {
  window.location.href = SupportContactUsLocation;
});
Mousetrap.bind('s k', () => {
  window.location.href = SupportHotKeysLocation;
});

export const Routes = () => (
  <Switch>
    {routes.map((props, index) => {
      // eslint-disable-next-line react/prop-types
      const key = props.path[0] + index;

      return (
        // eslint-disable-next-line react/prop-types
        <Route key={key} path={props.path} component={props.component} exact={props.exact} />
      );
    })}
    <DashboardView />
  </Switch>
);
