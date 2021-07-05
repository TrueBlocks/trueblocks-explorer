import { addColumn, addNumColumn, BaseTable } from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { Monitor } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback } from 'react';

export const IndexTable = () => {
  const [indexes, loading] = useCommand('status', { mode: 'index', details: true });
  if (indexes.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch indexes',
    });
  }

  const getData = useCallback((response) => {
    return response.status === 'fail' || !response.data[0].caches ? [] : response.data[0].caches[0].items;
  }, []);

  return <BaseTable data={getData(indexes)} columns={indexSchema} loading={loading} />;
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
    configuration: {
      render: (item: number) => <div style={{ color: 'red', fontWeight: 800 }}>{item}</div>,
    },
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
    title: 'index_hash',
    dataIndex: 'index_hash',
  }),
  addColumn({
    title: 'bloom_hash',
    dataIndex: 'bloom_hash',
  }),
];
