import { addColumn, addNumColumn, BaseTable } from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { Monitor } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback } from 'react';
import { indexSchema } from '../Indexes';

export const IndexTable = ({ theData, loading }: { theData: any[]; loading: boolean }) => {
  return <BaseTable dataSource={theData} columns={indexSchema} loading={loading} />;
};

function padLeft(num: number, size: number, char: string = '0') {
  var s = num + '';
  while (s.length < size) s = char + s;
  return s;
}

const renderBlockRange = (record: Monitor) => {
  return (
    <div>
      <div>
        {padLeft(record.firstApp, 9)}
        {'-'}
        {padLeft(record.latestApp, 9)}
      </div>
      <i>{Intl.NumberFormat().format(record.latestApp - record.firstApp + 1)} blocks</i>
    </div>
  );
};
