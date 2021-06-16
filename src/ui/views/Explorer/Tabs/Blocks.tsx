import { addColumn, addNumColumn, BaseTableRows, TableActions } from '@components/Table';
import { BlockType } from '@modules/data/block';
import { createErrorNotification } from '@modules/error_notification';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback } from 'react';
import { useCommand } from '../../../hooks/useCommand';

export const Blocks = () => {
  const [blocks, loading] = useCommand('blocks', { list: 0, cache: true });
  if (blocks.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch blocks',
    });
  }

  const getData = useCallback((response) => (response.status === 'fail' ? [] : response.data), []);
  return (
    <BaseTableRows data={getData(blocks)} columns={blockListSchema} loading={loading} />
  );
};

const blockListSchema: ColumnsType<BlockType> = [
  addColumn<BlockType>({
    title: 'Hash',
    dataIndex: 'hash',
  }),
  addNumColumn<BlockType>({
    title: 'Block Number',
    dataIndex: 'blockNumber',
  }),
  addColumn<BlockType>({
    title: 'Timestamp',
    dataIndex: 'timestamp',
  }),
  addColumn<BlockType>({
    title: 'Date',
    dataIndex: 'date',
  }),
  addNumColumn<BlockType>({
    title: 'nTransactions',
    dataIndex: 'transactionsCnt',
  }),
  addNumColumn<BlockType>({
    title: 'Uncles',
    dataIndex: 'unclesCnt',
  }),
  addNumColumn<BlockType>({
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
  }),
  addNumColumn<BlockType>({
    title: 'Gas Used',
    dataIndex: 'gasUsed',
  }),
];

function getTableActions(item: BlockType) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
