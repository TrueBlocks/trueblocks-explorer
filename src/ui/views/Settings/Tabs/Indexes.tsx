import React from 'react';

import { ColumnsType } from 'antd/lib/table';

import { BaseView } from '@components/BaseView';
import { addColumn, addNumColumn } from '@components/Table';
import { useFetchDataCaches } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import { Chunk } from '@modules/types';

import {
  SettingsIndexesChartsLocation,
  SettingsIndexesGridLocation,
  SettingsIndexesManifestLocation,
  SettingsIndexesTableLocation,
} from '../../../Routes';
import { IndexCharts } from './SubTabs/IndexCharts';
import { IndexGrid } from './SubTabs/IndexGrid';
import { IndexManifest } from './SubTabs/IndexManifest';
import { IndexTable } from './SubTabs/IndexTable';

export const IndexesView = () => {
  const { theData, loading, status } = useFetchDataCaches('status', { mode: 'index', details: true });
  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch indexes',
    });
  }

  const tabs = [
    {
      name: 'Grid',
      location: SettingsIndexesGridLocation,
      component: <IndexGrid key='grid' theData={theData} loading={loading} />,
    },
    {
      name: 'Table',
      location: SettingsIndexesTableLocation,
      component: <IndexTable key='table' theData={theData} loading={loading} />,
    },
    {
      name: 'Charts',
      location: SettingsIndexesChartsLocation,
      component: <IndexCharts key='chart' theData={theData} loading={loading} />,
    },
    {
      name: 'Manifest',
      location: SettingsIndexesManifestLocation,
      component: <IndexManifest key='manifest' />,
    },
  ];

  return <BaseView title='' cookieName='COOKIE_SETTINGS_INDEX' tabs={tabs} position='left' />;
};

function padLeft(num: number, size: number, char: string = '0') {
  let s = `${num}`;
  while (s.length < size) s = char + s;
  return s;
}

const renderBlockRange = (record: Chunk) => (
  <div>
    <div>
      {padLeft(record.firstApp, 9)}
      -
      {padLeft(record.latestApp, 9)}
    </div>
    <i>
      {Intl.NumberFormat().format(record.latestApp - record.firstApp + 1)}
      {' '}
      blocks
    </i>
  </div>
);

export const indexSchema: ColumnsType<Chunk> = [
  addColumn({
    title: 'Block Range',
    dataIndex: 'firstApp',
    configuration: {
      render: (item, record) => renderBlockRange(record),
      width: '200px',
    },
  }),
  addColumn({
    title: 'File Date',
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
