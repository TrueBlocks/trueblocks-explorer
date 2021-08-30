import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import { BaseView } from '@components/BaseView';
import { addActionsColumn, addColumn, TableActions } from '@components/Table';
import { Function } from '@modules/types';

import { NamesSignaturesEventsLocation, NamesSignaturesFunctionsLocation } from '../../../Routes';
import { EventSignatures } from './SubTabs/EventSignatures';
import { FunctionSignatures } from './SubTabs/FunctionSignatures';

export const Signatures = () => {
  const tabs = [
    {
      name: 'Functions',
      location: NamesSignaturesFunctionsLocation,
      component: <FunctionSignatures />,
    },
    {
      name: 'Events',
      location: NamesSignaturesEventsLocation,
      component: <EventSignatures />,
    },
  ];

  return <BaseView title='' cookieName='COOKIE_NAMES_SIGNATURES' tabs={tabs} position='left' />;
};

export const abiSignature: ColumnsType<Function> = [
  addColumn<Function>({
    title: 'Source',
    dataIndex: 'abi_source',
    configuration: {
      width: 200,
    },
  }),
  addColumn<Function>({
    title: 'Encoding',
    dataIndex: 'encoding',
  }),
  addColumn<Function>({
    title: 'Name',
    dataIndex: 'name',
  }),
  addColumn<Function>({
    title: 'Signature',
    dataIndex: 'signature',
  }),
  addActionsColumn<Function>(
    {
      title: '',
      dataIndex: '',
    },
    {
      width: 150,
      getComponent: getTableActions,
    },
  ),
];

function getTableActions(item: Function) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
