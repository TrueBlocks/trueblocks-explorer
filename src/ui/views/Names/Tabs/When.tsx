import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import {
  addActionsColumn, addColumn, addNumColumn, BaseTable, TableActions,
} from '@components/Table';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import { Block } from '@modules/types';

export const When = () => {
  const { theData, loading, status } = useFetchData('when', { list: true });

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch named blocks',
    });
  }

  return <BaseTable dataSource={theData} columns={whenSchema} loading={loading} />;
};

const whenSchema: ColumnsType<Block> = [
  addNumColumn({
    title: 'Block Number',
    dataIndex: 'blockNumber',
    configuration: {
      width: 200,
    },
  }),
  addColumn({
    title: 'Date',
    dataIndex: 'date',
  }),
  addColumn({
    title: 'Name',
    dataIndex: 'name',
  }),
  addColumn({
    title: 'Timestamp',
    dataIndex: 'timestamp',
  }),
  addActionsColumn(
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

function getTableActions(item: Block) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
