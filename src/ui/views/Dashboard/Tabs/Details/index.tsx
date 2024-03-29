import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';

import { useGlobalState } from '@state';

import { BaseView, ViewTab } from '@components/BaseView';
import { usePathWithAddress } from '@hooks/paths';

import {
  DashboardAccountsAddressLocation,
  DashboardAccountsEventsLocation,
  DashboardAccountsFunctionsLocation,
  DashboardAccountsGasLocation,
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsHistoryReconsLocation,
  DashboardAccountsNeighborsLocation,
} from '../../../../Routes';
import { AccountViewParams } from '../../Dashboard';
import { AddressBar } from './components/AddressBar';
import { ViewOptions } from './components/ViewOptions';
import {
  Charts,
  Events,
  Functions,
  Gas,
  History,
  Neighbors,
} from './SubTabs';

// TODO(tjayrush): We can remove the Omit since theData is not part of AccountViewParams
export const DetailsView = ({ params }: { params: Omit<AccountViewParams, 'theData'> }) => {
  const {
    filters,
  } = useGlobalState();
  const {
    loading,
  } = params;

  const generatePathWithAddress = usePathWithAddress();
  const historyPaths = useMemo(() => [
    DashboardAccountsHistoryLocation,
    DashboardAccountsHistoryReconsLocation,
    DashboardAccountsHistoryFunctionsLocation,
    DashboardAccountsHistoryEventsLocation,
    DashboardAccountsHistoryCustomLocation,
  ], []);

  const leftSideTabs: ViewTab[] = useMemo(() => [
    {
      name: 'Charts',
      location: generatePathWithAddress(DashboardAccountsAddressLocation),
      component: <Charts params={params} />,
    },
    {
      name: 'History',
      location: historyPaths.map((path) => generatePathWithAddress(path)),
      component: <History params={params} />,
    },
    {
      name: 'Events',
      location: generatePathWithAddress(DashboardAccountsEventsLocation),
      component: <Events />,
    },
    {
      name: 'Functions',
      location: generatePathWithAddress(DashboardAccountsFunctionsLocation),
      component: <Functions loading={loading} />,
    },
    {
      name: 'Gas',
      location: generatePathWithAddress(DashboardAccountsGasLocation),
      component: <Gas />,
    },
    {
      name: 'Neighbors',
      location: generatePathWithAddress(DashboardAccountsNeighborsLocation),
      component: <Neighbors />,
    },
  ],
  [generatePathWithAddress, historyPaths, loading, params]);

  return (
    <div>
      <AddressBar params={{ ...params, theData: [] }} filtersActive={filters.active} />
      <div>
        <ViewOptions params={{ ...params, theData: [] }} />
        <BaseView cookieName='COOKIE_DASHBOARD_ACCOUNTS' tabs={leftSideTabs} position='left' />
      </div>
    </div>
  );
};

export const useAcctStyles = createUseStyles({
  container: {
  },
  cardHolder: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '2px',
    padding: '1px',
  },
  card: {
    width: '100%',
    border: '2px solid darkgrey',
    marginBottom: '4px',
  },
  pre: {
    width: '100%',
    lineBreak: 'anywhere',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
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

export const headerStyle = {
  backgroundColor: 'lightgrey',
  fontSize: '16pt',
  color: 'darkBlue',
};
