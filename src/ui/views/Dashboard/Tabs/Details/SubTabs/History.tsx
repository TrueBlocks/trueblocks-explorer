import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ColumnsType } from 'antd/lib/table';
import { intersection } from 'fp-ts/lib/Array';
import { fold } from 'fp-ts/lib/Option';

import { BaseView } from '@components/BaseView';
import { FilterButton } from '@components/FilterButton';
import { addColumn, BaseTable } from '@components/Table';
import { useSearchParams } from '@hooks/useSearchParams';
import {
  filterTransactionsByAsset,
  filterTransactionsByEventName,
  filterTransactionsByFunctionName,
  TransactionEquality,
} from '@modules/filters/transaction';
import {
  Transaction,
} from '@modules/types';

import {
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryReconsLocation,
  DashboardAccountsHistoryTracesLocation,
} from '../../../../../Routes';
import { useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';
import { DateDisplay } from '../components/DateDisplay';
import { ExtraDisplay } from '../components/ExtraDisplay';
import { FromToDisplay } from '../components/FromToDisplay';
import { StatementDisplay } from '../components/StatementDisplay';
import { HistoryEvents } from './HistoryEvents';
import { HistoryFunctions } from './HistoryFunctions';
import { HistoryRecons } from './HistoryRecons';

const searchParamAsset = 'asset';
const searchParamEvent = 'event';
const searchParamFunction = 'function';

export const History = ({ params }: { params: AccountViewParams }) => {
  const { theData, loading } = params;
  const { currentAddress, namesMap } = useGlobalState();
  const history = useHistory();
  const { pathname } = useLocation();
  const [assetToFilterBy, setAssetToFilterBy] = useState('');
  const [eventToFilterBy, setEventToFilterBy] = useState('');
  const [functionToFilterBy, setFunctionToFilterBy] = useState('');
  const searchParams = useSearchParams();

  const assetNameToDisplay = useMemo(() => {
    if (!assetToFilterBy) return '';

    const matchedName = namesMap.get(assetToFilterBy);

    if (!matchedName) return '';

    return matchedName.name;
  }, [assetToFilterBy, namesMap]);

  useEffect(
    () => {
      setAssetToFilterBy(
        searchParams.get(searchParamAsset) || '',
      );

      setEventToFilterBy(
        searchParams.get(searchParamEvent) || '',
      );

      setFunctionToFilterBy(
        searchParams.get(searchParamFunction) || '',
      );
    },
    [searchParams],
  );

  const filteredData = useMemo(() => {
    if (!assetToFilterBy && !eventToFilterBy && !functionToFilterBy) return theData;

    const getSubsetOfData = fold<Transaction[], Transaction[]>(
      () => [],
      (someTransactions) => someTransactions,
    );

    const byAsset = filterTransactionsByAsset(assetToFilterBy, theData);
    const byEvent = filterTransactionsByEventName(eventToFilterBy, theData);
    const byFunction = filterTransactionsByFunctionName(functionToFilterBy, theData);

    // This is very naive and suboptimal implementation of filtering feature. We have to
    // come up with some general and performant method of filtering large datasets, then
    // we can improve here.
    const nonEmptyResults = [byAsset, byEvent, byFunction]
      .map(getSubsetOfData)
      .filter(({ length }) => length > 0);

    if (nonEmptyResults.length === 1) return nonEmptyResults[0];

    if (!nonEmptyResults.length) return [];

    return nonEmptyResults
      .reduce(intersection(TransactionEquality));
  }, [assetToFilterBy, eventToFilterBy, functionToFilterBy, theData]);

  const makeClearFilter = (searchParamKey: string) => () => {
    const searchString = searchParams.delete(searchParamKey).toString();
    history.replace(`${pathname}?${searchString}`);
  };

  const activeAssetFilter = (
    <FilterButton
      visible={Boolean(assetToFilterBy)}
      onClick={makeClearFilter(searchParamAsset)}
    >
      Asset:
      {' '}
      {assetNameToDisplay || assetToFilterBy}
    </FilterButton>
  );

  const activeEventFilter = (
    <FilterButton
      visible={Boolean(eventToFilterBy)}
      onClick={makeClearFilter(searchParamEvent)}
    >
      Event:
      {' '}
      {eventToFilterBy}
    </FilterButton>
  );

  const activeFunctionFilter = (
    <FilterButton
      visible={Boolean(functionToFilterBy)}
      onClick={makeClearFilter(searchParamFunction)}
    >
      Function:
      {' '}
      {functionToFilterBy}
    </FilterButton>
  );

  const siderRender = (record: any) => (
    <AccountHistorySider key='account-transactions' record={record} params={params} />
  );
  return (
    <div>
      {activeAssetFilter}
      {activeEventFilter}
      {activeFunctionFilter}

      <BaseTable
        dataSource={filteredData}
        columns={transactionSchema}
        loading={loading}
        extraData={currentAddress}
        siderRender={siderRender}
      />
    </div>
  );
};

export const AccountHistorySider = ({ record, params }: { record: any; params: AccountViewParams }) => {
  const tabs = [
    {
      name: 'Recons',
      location: DashboardAccountsHistoryReconsLocation,
      component: <HistoryRecons record={record} params={params} />,
    },
    {
      name: 'Events',
      location: DashboardAccountsHistoryEventsLocation,
      component: <HistoryEvents record={record} />,
    },
    {
      name: 'Function',
      location: DashboardAccountsHistoryFunctionsLocation,
      component: <HistoryFunctions record={record} />,
    },
    {
      name: 'Traces',
      location: DashboardAccountsHistoryTracesLocation,
      component: <pre>{JSON.stringify(record?.traces, null, 2)}</pre>,
    },
    {
      name: 'Custom',
      location: DashboardAccountsHistoryCustomLocation,
      component: <pre>{JSON.stringify(record?.to, null, 2)}</pre>,
    },
  ];

  return <BaseView title='' cookieName='COOKIE_DASHBOARD_DETAILS' tabs={tabs} />;
};

export const transactionSchema: ColumnsType<Transaction> = [
  addColumn({
    title: 'Date',
    dataIndex: 'date',
    configuration: {
      width: '15%',
      render: (unused, record) => <DateDisplay record={record} />,
    },
  }),
  addColumn({
    title: 'From / To',
    dataIndex: 'from',
    configuration: {
      width: '30%',
      render: (unused, record) => <FromToDisplay record={record} />,
    },
  }),
  addColumn({
    title: 'Reconciliations (asset, beg, in, out, gasOut, end, check)',
    dataIndex: 'compressedTx',
    configuration: {
      width: '50%',
      render: (unused, record) => <StatementDisplay record={record} />,
    },
  }),
  addColumn({
    title: '',
    dataIndex: 'statements',
    configuration: {
      width: '5%',
      render: (unused, record) => <ExtraDisplay record={record} />,
    },
  }),
];
