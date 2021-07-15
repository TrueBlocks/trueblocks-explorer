import {
  DashboardAccountsLocation,
  DashboardCollectionsLocation,
  DashboardLocation,
  DashboardMonitorsLocation,
} from '../../Routes';
import React, { useEffect, useState } from 'react';
import { Result, emptyData, toFailedResult, toSuccessfulData } from '@hooks/useCommand';

import { AccountsView } from './Tabs/Accounts/Accounts';
import { BaseView } from '@components/BaseView';
import { Collections } from './Tabs/Collections';
import { either as Either } from 'fp-ts';
import { Monitors } from './Tabs/Monitors';
import { cookieVars } from '../../utils';
import { createErrorNotification } from '@modules/error_notification';
import { pipe } from 'fp-ts/lib/function';
import { runCommand } from '@modules/core';
import useGlobalState from '../../state';

export const DashboardView = ({ match }: { match?: any }) => {
  const { accountAddress, setAccountAddress, transactions, setTransactions, totalRecords, setTotalRecords } =
    useGlobalState();
  const { names } = useGlobalState();
  const [named, setNamed] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const name = names && names[accountAddress];
    if (name) setNamed(name.name);
  }, [accountAddress, names]);

  useEffect(() => {
    (async () => {
      if (accountAddress?.slice(0, 2) === '0x') {
        setLoading(true);
        const eitherResponse = await runCommand('list', {
          count: true,
          appearances: true,
          addrs: accountAddress,
        });
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        //@ts-ignore
        setTotalRecords(result.data[0]?.nRecords);
        setLoading(false);
      }
    })();
  }, [accountAddress]); //, denom, staging]);

  useEffect(() => {
    (async () => {
      if (totalRecords && (transactions?.data.length || 0) < totalRecords) {
        const eitherResponse = await runCommand('export', {
          addrs: accountAddress,
          fmt: 'json',
          cache_txs: true,
          cache_traces: true,
          staging: false, //staging,
          // unripe: true,
          ether: true,
          //denom === 'ether',
          dollars: false,
          //denom === 'dollars',
          articulate: true,
          accounting: true,
          reversed: false,
          first_record: transactions?.data?.length || 0,
          max_records:
            (transactions?.data?.length || 0) < 100
              ? 10
              : 31 /* an arbitrary number not too big, not too small, that appears not to repeat */,
        });
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        let newTransactions: Result = transactions?.data ? { ...transactions } : toSuccessfulData(emptyData);
        //@ts-ignore
        newTransactions.data =
          newTransactions.data.length === 1 ? [...result.data] : [...newTransactions.data, ...result.data];
        setTransactions(newTransactions);
      }
    })();
  }, [totalRecords, transactions]); //, denom, staging]);

  if (transactions?.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch transactions',
    });
  }

  const title = `Dashboard [${accountAddress ? accountAddress : ''} ${accountAddress ? named : ''}]`;
  const tabs = [
    { name: 'Monitors', location: DashboardMonitorsLocation, component: <Monitors />, disabled: false },
    {
      name: 'Account Details',
      location: DashboardAccountsLocation,
      component: (
        <AccountsView
          loading={loading}
          setLoading={setLoading}
          accountAddress={accountAddress}
          setAccountAddress={setAccountAddress}
          totalRecords={totalRecords}
          setTotalRecords={setTotalRecords}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      ),
      disabled: false,
    },
    { name: 'Collections', location: DashboardCollectionsLocation, component: <Collections />, disabled: false },
  ];

  // console.log('DashboardView');
  return (
    <BaseView
      title={title}
      defaultActive={DashboardMonitorsLocation}
      baseActive={DashboardLocation}
      cookieName={cookieVars.dashboard_current_tab}
      tabs={tabs}
    />
  );
};
