import { addColumn, addNumColumn, TableActions } from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { Monitor } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback } from 'react';

export const IndexCharts = () => {
  const [indexes, loading] = useCommand('status', { mode: 'index', details: true });
  if (indexes.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch indexes',
    });
  }

  const getData = useCallback((response) => {
    return response.status === 'fail' || !response.data[0].caches ? [] : response.data[0].caches[0].items;
  }, []);

  return <div>Charts of the index</div>;
};

const indexSchema: ColumnsType<Monitor> = [
  addColumn({
    title: 'FileDate',
    dataIndex: 'fileDate',
  }),
  addNumColumn({
    title: 'nAddrs',
    dataIndex: 'nAddrs',
  }),
  addNumColumn({
    title: 'nApps',
    dataIndex: 'nApps',
  }),
  addNumColumn({
    title: 'firstApp',
    dataIndex: 'firstApp',
  }),
  addNumColumn({
    title: 'latestApp',
    dataIndex: 'latestApp',
  }),
  addNumColumn({
    title: 'firstTs',
    dataIndex: 'firstTs',
  }),
  addNumColumn({
    title: 'latestTs',
    dataIndex: 'latestTs',
  }),
  addNumColumn({
    title: 'indexSizeBytes',
    dataIndex: 'indexSizeBytes',
  }),
  addNumColumn({
    title: 'bloomSizeBytes',
    dataIndex: 'bloomSizeBytes',
  }),
  addColumn({
    title: 'indexHash',
    dataIndex: 'indexHash',
  }),
  addColumn({
    title: 'bloomHash',
    dataIndex: 'bloomHash',
  }),
];

function getTableActions(item: Monitor) {
  const onClick = (action: string, item: Monitor) => {
    switch (action) {
      case 'remove':
        console.log('Deleting the monitor', item);
        break;
      default:
        console.log('Clicked action', action, item);
    }
  };

  return <TableActions item={item} onClick={onClick} />;
}
