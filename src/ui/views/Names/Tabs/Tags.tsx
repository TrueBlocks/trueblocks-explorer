import React from 'react';

import { getNames } from '@sdk';
import { ColumnsType } from 'antd/lib/table';

import { ResourceTable } from '@components/ResourceTable';
import {
  addActionsColumn, addColumn, TableActions,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
// FIXME: type missing in SDK
import { Tag } from '@modules/types/Tag';

export const Tags = () => {
  const dataCall = useSdk(() => getNames({ terms: [], tags: true }));

  return (
    <ResourceTable
      resourceName='tags'
      call={dataCall}
      columns={tagSchema}
    />
  );
};

const tagSchema: ColumnsType<Tag> = [
  addColumn<Tag>({
    title: 'ID',
    dataIndex: 'tags',
  }),
  addActionsColumn<Tag>(
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

function getTableActions(item: Tag) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
