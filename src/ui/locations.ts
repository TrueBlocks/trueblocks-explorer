export const RootLocation = '/';

export const DashboardLocation = '/dashboard';
export const DashboardAccountsLocation = '/dashboard/accounts';
export const DashboardMonitorsLocation = '/dashboard/monitors';
export const DashboardCollectionsLocation = '/dashboard/collections';
export const DashboardAccountsAddressLocationTemplate = '/dashboard/accounts/:address';
export const DashboardAccountsAddressLocation = (address: string) => `/dashboard/accounts/${address}`;

export const AccountReconciliationsLocation = '/dashboard/accounts/reconciliations';
export const AccountFunctionsLocation = '/dashboard/accounts/functions';
export const AccountGasLocation = '/dashboard/accounts/gas';
export const AccountTracesLocation = '/dashboard/accounts/traces';

export const AccountReconciliationsLocationAddressTemplate = '/dashboard/accounts/reconciliations/:address';
export const AccountFunctionsLocationAddressTemplate = '/dashboard/accounts/functions/:address';
export const AccountGasLocationAddressTemplate = '/dashboard/accounts/gas/:address';
export const AccountTracesLocationAddressTemplate = '/dashboard/accounts/traces/:address';

export const AccountReconciliationsLocationAddress = (address: string) =>
  `/dashboard/accounts/reconciliations/${address}`;
export const AccountFunctionsLocationAddress = (address: string) => `/dashboard/accounts/functions/${address}`;
export const AccountGasLocationAddress = (address: string) => `/dashboard/accounts/gas/${address}`;
export const AccountTracesLocationAddress = (address: string) => `/dashboard/accounts/traces/${address}`;

export const NamesLocation = '/names';
export const NamesAddressesLocation = '/names/addresses';
export const NamesTagsLocation = '/names/tags';
export const NamesFuncSigsLocation = '/names/funcsigs';
export const NamesEventSigsLocation = '/names/eventsigs';
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
export const SettingsIndexGridLocation = '/settings/indexes/grid';
export const SettingsIndexTableLocation = '/settings/indexes/table';
export const SettingsIndexChartsLocation = '/settings/indexes/charts';
export const SettingsCachesLocation = '/settings/caches';
export const SettingsSkinsLocation = '/settings/skins';
export const SettingsSchemasLocation = '/settings/schemas';

export const SupportLocation = '/support';
export const SupportContactUsLocation = '/support/contact-us';
export const SupportDocumentationLocation = '/support/documentation';
export const SupportHotKeysLocation = '/support/hot-keys';
export const SupportLicensingLocation = '/support/licensing';
export const SupportAboutUsLocation = '/support/about-us';
