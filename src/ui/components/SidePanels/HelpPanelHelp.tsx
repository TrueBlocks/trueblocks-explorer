import React from 'react';
import {
  AccountFunctionsLocation,
  AccountGasLocation,
  AccountReconcsLocation,
  AccountTracesLocation,
  AccountTransactionsLocation,
  DashboardAccountsLocation,
  DashboardCollectionsLocation,
  DashboardIndexesLocation,
  DashboardLocation,
  DashboardMonitorsLocation,
  DashboardOverviewLocation,
  ExplorerBlocksLocation,
  ExplorerLocation,
  ExplorerLogsLocation,
  ExplorerReceiptsLocation,
  ExplorerTracesLocation,
  ExplorerTransactionsLocation,
  IndexChartsLocation,
  IndexGridLocation,
  IndexTableLocation,
  NamesAddressesLocation,
  NamesBlocksLocation,
  NamesEventSigsLocation,
  NamesFuncSigsLocation,
  NamesLocation,
  NamesTagsLocation,
  RootLocation,
  SettingsCachesLocation,
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
} from '../../locations';

export const helpRoutes = [
  {
    route: RootLocation,
    helpText: 'The dashboard overview page gives you an overview of your holdings among other things.',
  },
  {
    route: DashboardLocation,
    helpText: 'The dashboard overview page gives you an overview of your holdings among other things.',
  },
  {
    route: DashboardAccountsLocation,
    helpText: 'View the transactional history of an account.',
  },
  {
    route: AccountTracesLocation,
    helpText: 'View the history of traces for the transaction.',
  },
  {
    route: AccountGasLocation,
    helpText: 'View the event history of an account.',
  },
  {
    route: AccountReconcsLocation,
    helpText: 'View the reconciliation history of an account.',
  },
  {
    route: AccountFunctionsLocation,
    helpText: 'View the functional history of an account.',
  },
  {
    route: AccountTransactionsLocation,
    helpText: 'View transactional history of an account.',
  },
  {
    route: DashboardOverviewLocation,
    helpText: 'The dashboard overview page gives you an overview of your holdings among other things.',
  },
  {
    route: DashboardMonitorsLocation,
    helpText:
      'Monitors are named addresses that you have indicated are "of interest" and should be monitored by the scrapers.',
  },
  {
    route: DashboardCollectionsLocation,
    helpText: 'Collections allow you to group together multiple monitored addresses.',
  },
  {
    route: DashboardIndexesLocation,
    helpText: (
      <div>
        <p>View the contents of the TrueBlocks index cache.</p>
        <p>
          For more information on the process of extracting the index,
          <a target='_blank' href='https://github.com/TrueBlocks/trueblocks-docs/issues/12'>
            see here
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    route: IndexChartsLocation,
    helpText: 'Charts related to the index cache.',
  },
  {
    route: IndexGridLocation,
    helpText: 'Grid view of the index cache.',
  },
  {
    route: IndexTableLocation,
    helpText: 'Table view of the index cache.',
  },
  {
    route: NamesLocation,
    helpText: 'Names are common or known addresses that have been given a name.',
  },
  {
    route: NamesAddressesLocation,
    helpText: 'Named addresses are a convenient way to keep track of human-readable names for addresses.',
  },
  {
    route: NamesTagsLocation,
    helpText: 'Tags are groupings used to collect together named addresses.',
  },
  {
    route: NamesFuncSigsLocation,
    helpText: 'The function signatures tab allows you to add/edit/delete four byte signatures.',
  },
  {
    route: NamesEventSigsLocation,
    helpText: 'The event signatures tab allows you to add/edit/delete event signatures.',
  },
  {
    route: NamesBlocksLocation,
    helpText:
      'The blocks tab allows you to name particular blocks such as notable smart contract deployments, hard forks, or other blocks.',
  },
  {
    route: ExplorerLocation,
    helpText: 'View the contents of the TrueBlocks index cache.',
  },
  {
    route: ExplorerBlocksLocation,
    helpText: 'View blockchain block details.',
  },
  {
    route: ExplorerTransactionsLocation,
    helpText: 'View blockchain transaction details.',
  },
  {
    route: ExplorerReceiptsLocation,
    helpText: 'View blockchain receipt details.',
  },
  {
    route: ExplorerLogsLocation,
    helpText: 'View blockchain log details.',
  },
  {
    route: ExplorerTracesLocation,
    helpText: 'View blockchain trace details.',
  },
  {
    route: SettingsLocation,
    helpText: 'This screen allows you to adjust the way TrueBlocks two scrapers work.',
  },
  {
    route: SettingsScrapersLocation,
    helpText: 'This screen allows you to adjust the way TrueBlocks two scrapers work.',
  },
  {
    route: SettingsCachesLocation,
    helpText: 'View, edit, clean, recover space from the TrueBlocks caches.',
  },
  {
    route: SettingsSkinsLocation,
    helpText: 'Change the skin or them of the application.',
  },
  {
    route: SettingsSchemasLocation,
    helpText: 'View and edit the schemas for the various screens and tables.',
  },
  {
    route: SupportLocation,
    helpText: 'Information on contacting TrueBlocks, LLC.',
  },
  {
    route: SupportContactUsLocation,
    helpText: 'Information on contacting TrueBlocks, LLC.',
  },
  {
    route: SupportDocumentationLocation,
    helpText: 'Links to various documentation sites.',
  },
  {
    route: SupportHotKeysLocation,
    helpText: 'A view of all the hot-keys for the program.',
  },
  {
    route: SupportLicensingLocation,
    helpText: 'Licensing information about the software.',
  },
  {
    route: SupportAboutUsLocation,
    helpText: 'A short history of TrueBlocks, LLC.',
  },
];
