import React from 'react';

import { getPins } from '@sdk';
import { ColumnsType } from 'antd/lib/table';

import { ResourceTable } from '@components/ResourceTable';
import { addColumn } from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { ManifestRecord } from '@modules/types';

export const IndexManifest = () => {
  const pinsCall = useSdk(() => getPins({ list: true }));

  return (
    <ResourceTable
      resourceName='manifest'
      call={pinsCall}
      columns={manifestSchema}
    />
  );
};

export const manifestSchema: ColumnsType<ManifestRecord> = [
  addColumn({
    title: 'File Name',
    dataIndex: 'fileName',
    configuration: {
      width: '200px',
    },
  }),
  addColumn({
    title: 'Bloom Hash',
    dataIndex: 'bloomHash',
  }),
  addColumn({
    title: 'Index Hash',
    dataIndex: 'indexHash',
  }),
];
