import { DashboardAccountsLocation, DashboardCollectionsLocation, DashboardMonitorsLocation } from '../../Routes';
import { useGlobalNames, useGlobalState } from '../../State';
import { Collections } from './Tabs/Collections';
import { DetailsView } from './Tabs/Details';
import { Monitors } from './Tabs/Monitors';
import { BaseView } from '@components/BaseView';
import { emptyData, Result, toFailedResult, toSuccessfulData } from '@hooks/useCommand';
import { runCommand } from '@modules/core';
import { createErrorNotification } from '@modules/error_notification';
import { AssetHistory, AssetHistoryArray, Reconciliation, Transaction, TransactionArray } from '@modules/types';
import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import React, { useCallback, useEffect, useState } from 'react';

export const DashboardView = () => {
  const [loading, setLoading] = useState(false);
  const [staging, setStaging] = useState(false);
  const [hideZero, setHideZero] = useState('all');
  const [hideNamed, setHideNamed] = useState(false);
  const [hideReconciled, setHideReconciled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [period, setPeriod] = useState('by tx');

  const { currentAddress } = useGlobalState();
  const { denom, setDenom } = useGlobalState();
  const { namesMap } = useGlobalNames();
  const { totalRecords, setTotalRecords } = useGlobalState();
  const { transactions, setTransactions } = useGlobalState();

  if (transactions?.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch transactions',
    });
  }

  useEffect(() => {
    (async () => {
      if (currentAddress?.slice(0, 2) === '0x') {
        setLoading(true);
        const eitherResponse = await runCommand('list', {
          count: true,
          appearances: true,
          addrs: currentAddress,
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
  }, [currentAddress, staging]);

  useEffect(() => {
    (async () => {
      if (totalRecords && (transactions?.data?.length || 0) < totalRecords) {
        const eitherResponse = await runCommand('export', {
          addrs: currentAddress,
          fmt: 'json',
          cache_txs: true,
          cache_traces: true,
          staging: false, //staging,
          unripe: false, // unripe: true,
          ether: true,
          dollars: false,
          articulate: true,
          accounting: true,
          reversed: false,
          relevant: true,
          // summarize_by: 'monthly',
          first_record: transactions?.data?.length || 0,
          max_records:
            (transactions?.data?.length || 0) < 50
              ? 10
              : (transactions?.data?.length || 0) < 150
              ? 71
              : (transactions?.data?.length || 0) < 1500
              ? 239
              : 639 /* an arbitrary number not too big, not too small, that appears not to repeat */,
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
  }, [totalRecords, transactions]);

  const getMeta = useCallback((response) => (response?.status === 'fail' ? [] : response?.meta), []);
  let theMeta: any = getMeta(transactions);
  const getData = useCallback((response) => (response?.status === 'fail' ? [] : response?.data), []);
  let theData: TransactionArray = getData(transactions);
  theData = theData?.map((item: Transaction, i: number) => {
    if (typeof item === 'object') item.id = (i + 1).toString();
    return {
      ...item,
      fromName: namesMap[item.from] || { name: '' },
      toName: namesMap[item.to] || { name: '' },
    };
  });
  theData = theData?.filter((item: Transaction) => {
    if (!hideReconciled) return true;
    const unrecon = item.statements?.filter((item: Reconciliation) => {
      return !item.reconciled;
    });
    return unrecon && unrecon.length > 0;
  });

  let uniqAssets: any = [];

  if (theData) {
    theData.map((tx: Transaction) => {
      tx.statements?.map((statement: Reconciliation) => {
        if (uniqAssets.find((asset: AssetHistory) => asset.assetAddr === statement.assetAddr) === undefined) {
          uniqAssets.push({
            assetAddr: statement.assetAddr,
            assetSymbol: statement.assetSymbol,
            balHistory: [],
          });
        }
      });

      uniqAssets.map((asset: AssetHistory, index: number) => {
        const found = tx.statements?.find((statement: Reconciliation) => asset.assetAddr === statement.assetAddr);
        if (found) {
          uniqAssets[index].balHistory = [
            ...uniqAssets[index].balHistory,
            { balance: found.endBal, date: new Date(found.timestamp * 1000) },
          ];
        }
      });
    });

    uniqAssets.sort(function (a: any, b: any) {
      if (b.balHistory.length === a.balHistory.length) {
        if (b.balHistory.length === 0) {
          return b.assetAddr - a.assetAddr;
        }
        return b.balHistory[b.balHistory.length - 1].balance - a.balHistory[a.balHistory.length - 1].balance;
      }
      return b.balHistory.length - a.balHistory.length;
    });

    uniqAssets = uniqAssets.filter((asset: AssetHistory) => {
      if (asset.balHistory.length === 0) return false;
      const show =
        hideZero === 'all' ||
        (hideZero === 'show' && Number(asset.balHistory[asset.balHistory.length - 1].balance) === 0) ||
        (hideZero === 'hide' && Number(asset.balHistory[asset.balHistory.length - 1].balance) > 0);
      return show && (!hideNamed || !namesMap[asset.assetAddr]);
    });
  }

  const params: AccountViewParams = {
    loading: loading,
    setLoading: setLoading,
    prefs: {
      denom: denom,
      setDenom: setDenom,
      staging: staging,
      setStaging: setStaging,
      hideZero: hideZero,
      setHideZero: setHideZero,
      hideNamed: hideNamed,
      setHideNamed: setHideNamed,
      hideReconciled: hideReconciled,
      setHideReconciled: setHideReconciled,
      showDetails: showDetails,
      setShowDetails: setShowDetails,
      period: period,
      setPeriod: setPeriod,
    },
    totalRecords: totalRecords,
    theData: theData,
    setTransactions: setTransactions,
    theMeta: theMeta,
    uniqAssets: uniqAssets,
  };

  const tabs = [
    { name: 'Monitors', location: DashboardMonitorsLocation, component: <Monitors /> },
    {
      name: 'Details',
      location: DashboardAccountsLocation,
      component: <DetailsView params={params} />,
    },
    { name: 'Collections', location: DashboardCollectionsLocation, component: <Collections /> },
  ];

  return (
    <BaseView
      title={'Dashboard'}
      cookieName={'COOKIE_DASHBOARD'}
      tabs={tabs}
    />
  );
};

declare type stateSetter<Type> = React.Dispatch<React.SetStateAction<Type>>;
export declare type UserPrefs = {
  denom: string;
  setDenom: any;
  staging: boolean;
  setStaging: stateSetter<boolean>;
  hideZero: string;
  setHideZero: stateSetter<string>;
  hideNamed: boolean;
  setHideNamed: stateSetter<boolean>;
  hideReconciled: boolean;
  setHideReconciled: stateSetter<boolean>;
  showDetails: boolean;
  setShowDetails: stateSetter<boolean>;
  period: string;
  setPeriod: stateSetter<string>;
};

export declare type AccountViewParams = {
  prefs: UserPrefs;
  loading: boolean;
  setLoading: stateSetter<boolean>;
  totalRecords: number | null;
  theData: any;
  setTransactions: any;
  theMeta: any;
  uniqAssets: AssetHistoryArray;
};
