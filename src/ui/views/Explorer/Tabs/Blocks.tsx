import React from 'react';

import { getBlocks } from '@sdk';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

import {
  addColumn, addNumColumn, BaseTable, TableActions,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';
import { FixedGetBlocksParameters } from '@modules/type_fixes';
import { Block } from '@modules/types';

export const Blocks = () => {
  // FIXME: typecast
  const blocksCall = useSdk(() => getBlocks({
    list: 0,
    listCount: 12,
    cache: true,
  } as unknown as FixedGetBlocksParameters));

  if (isFailedCall(blocksCall)) {
    createErrorNotification({
      description: 'Could not fetch blocks',
    });
  }

  const theData = isSuccessfulCall(blocksCall) ? blocksCall.data : [];

  return <BaseTable dataSource={theData} columns={blockListSchema} loading={blocksCall.loading} />;
};

const blockListSchema: ColumnsType<Block> = [
  addColumn<Block>({
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
  addColumn<Block>({
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
  addColumn<Block>({
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
  addNumColumn<Block>({
    title: 'Difficulty',
    dataIndex: 'difficulty',
    configuration: {
      width: 180,
    },
  }),
  addNumColumn<Block>({
    title: 'Gas Used',
    dataIndex: 'gasUsed',
  }),
  addNumColumn<Block>({
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
  }),
  addNumColumn<Block>({
    title: 'nTransactions',
    dataIndex: 'transactionsCnt',
  }),
];

function getTableActions(item: Block) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
