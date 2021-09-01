import React from 'react';
import { createUseStyles } from 'react-jss';

import {
  Divider,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { BaseView, ViewTab } from '@components/BaseView';
import { addColumn } from '@components/Table';
import {
  Transaction,
} from '@modules/types';

import {
  DashboardAccountsChartsLocation,
  DashboardAccountsEventsLocation,
  DashboardAccountsFunctionsLocation,
  DashboardAccountsGasLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsNeighborsLocation,
} from '../../../../Routes';
import { AccountViewParams } from '../../Dashboard';
import {
  Charts, Events, Functions, Gas, History, Neighbors,
} from '../SubTabs';
import { AddressBar } from './AddressBar';
import { DateDisplay } from './DateDisplay';
import { ExtraDisplay } from './ExtraDisplay';
import { FromToDisplay } from './FromToDisplay';
import { StatementDisplay } from './StatementDisplay';
import { ViewOptions } from './ViewOptions';

export const DetailsView = ({ params }: { params: AccountViewParams }) => {
  const {
    theData, theMeta, uniqAssets, loading,
  } = params;
  if (!theData || !uniqAssets) return <></>;

  const leftSideTabs: ViewTab[] = [
    {
      name: 'Charts',
      location: DashboardAccountsChartsLocation,
      component: <Charts params={params} />,
    },
    {
      name: 'History',
      location: DashboardAccountsHistoryLocation,
      component: <History params={params} />,
    },
    {
      name: 'Events',
      location: DashboardAccountsEventsLocation,
      component: <Events theData={theData} loading={loading} />,
    },
    {
      name: 'Functions',
      location: DashboardAccountsFunctionsLocation,
      component: <Functions theData={theData} loading={loading} />,
    },
    {
      name: 'Gas',
      location: DashboardAccountsGasLocation,
      component: <Gas theData={theData} loading={loading} />,
    },
    {
      name: 'Neighbors',
      location: DashboardAccountsNeighborsLocation,
      component: <Neighbors theData={theData} theMeta={theMeta} loading={loading} />,
    },
  ];

  return (
    <div>
      <AddressBar params={params} />
      <Divider style={{ height: '1px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr' }}>
        <BaseView cookieName='COOKIE_DASHBOARD_ACCOUNTS' tabs={leftSideTabs} position='left' />
        <ViewOptions params={params} />
      </div>
    </div>
  );
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

export const useAcctStyles = createUseStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 28fr 3fr',
  },
  cardHolder: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '2px',
    padding: '4px',
  },
  card: {
    border: '1px solid lightgrey',
    width: '600px',
  },
  tableHead: {
    padding: '0px',
    margin: '0px',
    overflowX: 'hidden',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '+1',
    borderBottom: '1px solid lightgrey',
  },
  tableRow: {
    padding: '0px',
    margin: '0px',
    overflowX: 'hidden',
    textAlign: 'right',
  },
});
