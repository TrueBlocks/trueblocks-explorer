import { BaseView } from '@components/BaseView';
import React from 'react';
import {
  DashboardAccountsLocation,
  DashboardCollectionsLocation,
  DashboardLocation,
  DashboardMonitorsLocation,
  DashboardOverviewLocation,
} from '../../locations';
import useGlobalState from '../../state';
import { cookieVars } from '../../utils';
import { AccountsView } from './Tabs/Accounts/Accounts';
import { Collections } from './Tabs/Collections';
import { Monitors } from './Tabs/Monitors';
import { Overview } from './Tabs/Overview';

export const DashboardView = ({ match }: { match?: any }) => {
  const { accountAddress } = useGlobalState();
  const title = 'Dashboard';
  var tabs = [
    { name: 'Overview', location: DashboardOverviewLocation, component: <Overview />, disabled: false },
    {
      name: 'Accounts',
      location: DashboardAccountsLocation,
      component: <AccountsView initAddress={accountAddress} />,
      disabled: false,
    },
    { name: 'Monitors', location: DashboardMonitorsLocation, component: <Monitors />, disabled: false },
    { name: 'Collections', location: DashboardCollectionsLocation, component: <Collections />, disabled: false },
  ];

  return (
    <BaseView
      title={title}
      defaultActive={DashboardOverviewLocation}
      baseActive={DashboardLocation}
      cookieName={cookieVars.dashboard_current_tab}
      tabs={tabs}
    />
  );
};
