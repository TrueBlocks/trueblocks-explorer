import React from 'react';

import { Block, getBlocks } from '@sdk';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

import {
  addColumn, addNumColumn, BaseTable,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';

export const Blocks = () => {
  const blocksCall = useSdk(() => getBlocks({
    chain: `${process.env.CHAIN}`,
    blocks: [],
    list: 0,
    listCount: 12,
    cache: true,
  }));

  if (isFailedCall(blocksCall)) {
    createErrorNotification({
      description: 'Could not fetch blocks',
    });
  }

  const theData = isSuccessfulCall(blocksCall) ? blocksCall.data : [];

  return <BaseTable dataSource={theData} columns={blockListSchema} loading={blocksCall.loading} />;
};

const blockListSchema: ColumnsType<Block> = [
  addColumn({
    title: 'Date',
    dataIndex: 'timestamp',
    configuration: {
      render: (value) => (
        <div>
          <div>{dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div style={{ fontStyle: 'italic' }}>{dayjs.unix(value).fromNow()}</div>
        </div>
      ),
    },
  }),
  addColumn({
    title: 'Hash',
    dataIndex: 'hash',
    configuration: {
      render: (value, record) => (
        <div>
          <div>{value}</div>
          <div style={{ fontStyle: 'italic' }}>{Intl.NumberFormat().format(record.blockNumber)}</div>
        </div>
      ),
      width: 620,
    },
  }),
  addColumn({
    title: 'Miner',
    dataIndex: 'miner',
    configuration: {
      render: (value, record) => (
        <div>
          <div>{value}</div>
          <div style={{ fontStyle: 'italic' }}>
            {record.unclesCnt === null || record.unclesCnt === 0 ? '' : `${record.unclesCnt} uncle`}
          </div>
        </div>
      ),
      width: 400,
    },
  }),
  addNumColumn({
    title: 'Difficulty',
    dataIndex: 'difficulty',
    configuration: {
      width: 180,
    },
  }),
  addNumColumn({
    title: 'Gas Used',
    dataIndex: 'gasUsed',
  }),
  addNumColumn({
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
  }),
  addNumColumn({
    title: 'nTransactions',
    dataIndex: 'transactionsCnt',
  }),
];
