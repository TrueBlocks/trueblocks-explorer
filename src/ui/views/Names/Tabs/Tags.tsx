import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import {
  addActionsColumn, addColumn, BaseTable, TableActions,
} from '@components/Table';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import { Tag } from '@modules/types/Tag';

export const Tags = () => {
  const { theData, loading, status } = useFetchData('names', { tags: '' });

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch tags',
    });
  }

  return <BaseTable dataSource={theData} columns={tagSchema} loading={loading} />;
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
