/*
 * Parts of this file were generated with makeClass --js. Edit only those parts of
 * the code outside of the BEG_CODE/END_CODE sections
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { address } from '@modules/types';

import {
  DashboardView, ExplorerView, NamesView, SettingsView, SupportView,
} from './views';

const Mousetrap = require('mousetrap');

// BEG_CODE_LOCATIONS
export const RootLocation = '/';

export const DashboardLocation = '/dashboard';
export const DashboardMonitorsLocation = '/dashboard/monitors';
export const DashboardAccountsLocation = '/dashboard/accounts';
export const DashboardAccountsAssetsLocation = '/dashboard/accounts/assets';
export const DashboardAccountsHistoryLocation = '/dashboard/accounts/history';
export const DashboardAccountsHistoryReconsLocation = '/dashboard/accounts/history/recons';
export const DashboardAccountsHistoryFunctionsLocation = '/dashboard/accounts/history/functions';
export const DashboardAccountsHistoryEventsLocation = '/dashboard/accounts/history/events';
export const DashboardAccountsHistoryTracesLocation = '/dashboard/accounts/history/traces';
export const DashboardAccountsHistoryCustomLocation = '/dashboard/accounts/history/custom';
export const DashboardAccountsNeighborsLocation = '/dashboard/accounts/neighbors';
export const DashboardAccountsGasLocation = '/dashboard/accounts/gas';
export const DashboardAccountsChartsLocation = '/dashboard/accounts/charts';
export const DashboardAccountsFunctionsLocation = '/dashboard/accounts/functions';
export const DashboardAccountsEventsLocation = '/dashboard/accounts/events';
export const DashboardCollectionsLocation = '/dashboard/collections';

export const NamesLocation = '/names';
export const NamesAddressesLocation = '/names/addresses';
export const NamesTagsLocation = '/names/tags';
export const NamesSignaturesLocation = '/names/signatures';
export const NamesSignaturesFunctionsLocation = '/names/signatures/functions';
export const NamesSignaturesEventsLocation = '/names/signatures/events';
export const NamesBlocksLocation = '/names/blocks';

export const ExplorerLocation = '/explorer';
export const ExplorerBlocksLocation = '/explorer/blocks';
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
// END_CODE_LOCATIONS

// BEG_CODE_TEMPLATES
export const DashboardAccountsAddressTemplate = '/dashboard/accounts/:address';
export const DashboardAccountsReconsAddressTemplate = '/dashboard/accounts/recons/:address';
export const DashboardAccountsFunctionsAddressTemplate = '/dashboard/accounts/functions/:address';
export const DashboardAccountsGasAddressTemplate = '/dashboard/accounts/gas/:address';
export const DashboardAccountsTracesAddressTemplate = '/dashboard/accounts/traces/:address';

export const DashboardAccountsAddressLocation = (address: address) => `/dashboard/accounts?address=${address}`;
// export const DashboardAccountsReconsLocationAddress = (address: string) => `/dashboard/accounts/recons/${address}`;
// export const DashboardAccountsFunctionsLocationAddress = (address: string) => `/dashboard/accounts/functions/${address}`;
// export const DashboardAccountsGasLocationAddress = (address: string) => `/dashboard/accounts/gas/${address}`;
// export const DashboardAccountsTracesLocationAddress = (address: string) => `/dashboard/accounts/traces/${address}`;
// END_CODE_TEMPLATES

// BEG_CODE_ROUTES
export const routes = [
  {
    path: RootLocation,
    exact: true,
    component: DashboardView,
    helpText: 'The dashboard overview page gives you an overview of your holdings among other things.',
  },
  {
    path: DashboardLocation,
    exact: true,
    component: DashboardView,
    helpText: 'The dashboard overview page gives you an overview of your holdings among other things.',
  },
  {
    path: DashboardMonitorsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'Monitors are named addresses that you have indicated are of interest and should be monitored by the scrapers.',
  },
  {
    path: DashboardAccountsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the transactional history of an account.',
  },
  {
    path: DashboardAccountsAssetsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'See all assets for a given address.',
  },
  {
    path: DashboardAccountsHistoryLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the transactional history of an account.',
  },
  {
    path: DashboardAccountsHistoryReconsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the reconciliation history of an account.',
  },
  {
    path: DashboardAccountsHistoryFunctionsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the functions for a transaction.',
  },
  {
    path: DashboardAccountsHistoryEventsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the events in transaction.',
  },
  {
    path: DashboardAccountsHistoryTracesLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the history of traces for the transaction.',
  },
  {
    path: DashboardAccountsHistoryCustomLocation,
    exact: true,
    component: DashboardView,
    helpText: 'View the logo of the to address for the transaction.',
  },
  {
    path: DashboardAccountsNeighborsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'See all assets for a given address.',
  },
  {
    path: DashboardAccountsGasLocation,
    exact: true,
    component: DashboardView,
    helpText: 'Analyze gas usage.',
  },
  {
    path: DashboardAccountsChartsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'See all assets for a given address.',
  },
  {
    path: DashboardAccountsFunctionsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'See all assets for a given address.',
  },
  {
    path: DashboardAccountsEventsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'See all assets for a given address.',
  },
  {
    path: DashboardCollectionsLocation,
    exact: true,
    component: DashboardView,
    helpText: 'Collections allow you to group together multiple monitored addresses.',
  },
  {
    path: DashboardAccountsAddressTemplate,
    exact: false,
    component: DashboardView,
    helpText: '',
  },
  {
    path: DashboardAccountsReconsAddressTemplate,
    exact: false,
    component: DashboardView,
    helpText: '',
  },
  {
    path: DashboardAccountsFunctionsAddressTemplate,
    exact: false,
    component: DashboardView,
    helpText: '',
  },
  {
    path: DashboardAccountsGasAddressTemplate,
    exact: false,
    component: DashboardView,
    helpText: '',
  },
  {
    path: DashboardAccountsTracesAddressTemplate,
    exact: false,
    component: DashboardView,
    helpText: '',
  },
  {
    path: NamesLocation,
    exact: true,
    component: NamesView,
    helpText: 'Names are common or known addresses that have been given a name.',
  },
  {
    path: NamesAddressesLocation,
    exact: true,
    component: NamesView,
    helpText: 'Named addresses are a convenient way to keep track of human-readable names for addresses.',
  },
  {
    path: NamesTagsLocation,
    exact: true,
    component: NamesView,
    helpText: 'Tags are groupings used to collect together named addresses.',
  },
  {
    path: NamesSignaturesFunctionsLocation,
    exact: true,
    component: NamesView,
    helpText: 'The function and event signatures tab allows you to add/edit/delete four byte signatures.',
  },
  {
    path: NamesSignaturesEventsLocation,
    exact: true,
    component: NamesView,
    helpText: 'The function and event signatures tab allows you to add/edit/delete four byte signatures.',
  },
  {
    path: NamesSignaturesLocation,
    exact: true,
    component: NamesView,
    helpText: 'The function and event signatures tab allows you to add/edit/delete four byte signatures.',
  },
  {
    path: NamesBlocksLocation,
    exact: true,
    component: NamesView,
    helpText: 'The blocks tab allows you to name particular blocks such as notable smart contract deployments, hard forks, or other blocks.',
  },
  {
    path: ExplorerLocation,
    exact: true,
    component: ExplorerView,
    helpText: 'View the contents of the TrueBlocks index cache.',
  },
  {
    path: ExplorerBlocksLocation,
    exact: true,
    component: ExplorerView,
    helpText: 'View blockchain block details.',
  },
  {
    path: ExplorerTransactionsLocation,
    exact: true,
    component: ExplorerView,
    helpText: 'View blockchain transaction details.',
  },
  {
    path: ExplorerReceiptsLocation,
    exact: true,
    component: ExplorerView,
    helpText: 'View blockchain receipt details.',
  },
  {
    path: ExplorerLogsLocation,
    exact: true,
    component: ExplorerView,
    helpText: 'View blockchain log details.',
  },
  {
    path: ExplorerTracesLocation,
    exact: true,
    component: ExplorerView,
    helpText: 'View blockchain trace details.',
  },
  {
    path: SettingsLocation,
    exact: true,
    component: SettingsView,
    helpText: 'This screen allows you to adjust the way TrueBlocks two scrapers work.',
  },
  {
    path: SettingsScrapersLocation,
    exact: true,
    component: SettingsView,
    helpText: 'This screen allows you to adjust the way TrueBlocks two scrapers work.',
  },
  {
    path: SettingsIndexesLocation,
    exact: true,
    component: SettingsView,
    helpText: 'View the contents of the TrueBlocks index cache.',
  },
  {
    path: SettingsIndexesGridLocation,
    exact: true,
    component: SettingsView,
    helpText: 'Grid view of the index cache.',
  },
  {
    path: SettingsIndexesTableLocation,
    exact: true,
    component: SettingsView,
    helpText: 'Table view of the index cache.',
  },
  {
    path: SettingsIndexesChartsLocation,
    exact: true,
    component: SettingsView,
    helpText: 'Visual display of the index cache.',
  },
  {
    path: SettingsIndexesManifestLocation,
    exact: true,
    component: SettingsView,
    helpText: 'The index manifestation.',
  },
  {
    path: SettingsCachesLocation,
    exact: true,
    component: SettingsView,
    helpText: 'View, edit, clean, recover space from the TrueBlocks caches.',
  },
  {
    path: SettingsSkinsLocation,
    exact: true,
    component: SettingsView,
    helpText: 'Change the skin or them of the application.',
  },
  {
    path: SettingsDataModelLocation,
    exact: true,
    component: SettingsView,
    helpText: 'View and edit the data types for the various screens and tables.',
  },
  {
    path: SupportLocation,
    exact: true,
    component: SupportView,
    helpText: 'Information on contacting TrueBlocks, LLC.',
  },
  {
    path: SupportContactUsLocation,
    exact: true,
    component: SupportView,
    helpText: 'Information on contacting TrueBlocks, LLC.',
  },
  {
    path: SupportDocumentationLocation,
    exact: true,
    component: SupportView,
    helpText: 'Links to various documentation sites.',
  },
  {
    path: SupportHotKeysLocation,
    exact: true,
    component: SupportView,
    helpText: 'A view of all the hot-keys for the program.',
  },
  {
    path: SupportLicensingLocation,
    exact: true,
    component: SupportView,
    helpText: 'Licensing information about the software.',
  },
  {
    path: SupportAboutUsLocation,
    exact: true,
    component: SupportView,
    helpText: 'A short history of TrueBlocks, LLC.',
  },
];
// END_CODE_ROUTES

// BEG_CODE_KEYS
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
// END_CODE_KEYS

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
