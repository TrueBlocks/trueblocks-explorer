import React from 'react';

import { getWhen } from '@sdk';
import { ColumnsType } from 'antd/lib/table';

import { ResourceTable } from '@components/ResourceTable';
import {
  addActionsColumn, addColumn, addNumColumn, TableActions,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { FixedWhenParameters } from '@modules/type_fixes';
import { Block } from '@modules/types';

export const When = () => {
  const dataCall = useSdk(() => getWhen({ list: true } as FixedWhenParameters));

  return (
    <ResourceTable
      resourceName='tags'
      call={dataCall}
      columns={whenSchema}
    />
  );
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
