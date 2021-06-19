import { BaseView } from '@components/BaseView';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import React, { useCallback } from 'react';
import {
  AccountEventsLocation,
  AccountFunctionsLocation,
  AccountTransactionsLocation,
  DashboardAccountsLocation
} from '../../../../locations';
import { cookieVars } from '../../../../utils';
import { AccountEvents } from './Tabs/Events';
import { AccountFunctions } from './Tabs/Functions';
import { AccountTransactions } from './Tabs/Transactions';

export const AccountsView = () => {
  const [transactions, loading] = useCommand('export', {
    addrs: '0xf503017d7baf7fbc0fff7492b751025c6a78179b',
    fmt: 'json',
    articulate: true,
    accounting: true,
    max_records: 2000,
    ether: true,
    cache_txs: true,
    cache_traces: true,
  });
  if (transactions.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch transactions',
    });
  }

  const getData = useCallback((response) => (response.status === 'fail' ? [] : response.data), []);
  const title = '';
  var tabs = [
    {
      name: 'Transactions',
      location: AccountTransactionsLocation,
      component: <AccountTransactions data={getData(transactions)} loading={loading}/>
    },
    {
      name: 'Functions',
      location: AccountFunctionsLocation,
      component: <AccountFunctions data={getData(transactions)} loading={loading}/>
    },
    {
      name: 'Events',
      location: AccountEventsLocation,
      component: <AccountEvents data={getData(transactions)} loading={loading}/>
    },
  ];

  return (
    <BaseView
      title={title}
      defaultActive={AccountTransactionsLocation}
      baseActive={DashboardAccountsLocation}
      cookieName={cookieVars.dashboard_account_sub_tab}
      subBase={true}
      tabs={tabs}
      position='left'
    />
  );
};
