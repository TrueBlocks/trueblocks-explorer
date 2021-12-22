import React from 'react';
import { Link } from 'react-router-dom';

import { ColumnsType } from 'antd/lib/table';

import { Loading } from '@components/Loading';
import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { createWrapper } from '@hooks/useSearchParams';
import { FixedTransaction } from '@modules/type_fixes';
// FIXME: UI-related types
import {
  ItemCounter, ItemCounterArray,
} from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../../Routes';

export const Functions = ({ theData, loading }: { theData: FixedTransaction[]; loading: boolean }) => {
  if (!theData) return <></>;

  const counts: Record<string, number> = {};
  theData.forEach((item: FixedTransaction) => {
    if (item.articulatedTx) {
      const k = item.articulatedTx.name + (item.isError ? ' (errored)' : '');
      if (!counts[k]) counts[k] = 1;
      else counts[k] = Number(counts[k]) + 1;
    }
  });

  const uniqItems: ItemCounterArray = [];
  Object.keys(counts).map((key: any) => {
    uniqItems.push({
      evt: key,
      count: counts[key],
    });
    return null;
  });

  uniqItems.sort((a: ItemCounter, b: ItemCounter) => {
    if (b.count === a.count) return a.evt.localeCompare(b.evt);
    return b.count - a.count;
  });

  const top = uniqItems.filter((item: ItemCounter, i: number) => i < 10);
  const remains = uniqItems.filter((item: ItemCounter, i: number) => i >= 10);

  return (
    <Loading loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <MyAreaChart title='Top Ten Functions' items={top} columns={funcCountSchema} table />
        <MyAreaChart title='Other Functions' items={remains} columns={funcCountSchema} table />
      </div>
    </Loading>
  );
};

export const funcCountSchema: ColumnsType<ItemCounter> = [
  addColumn({
    title: 'Function',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: ItemCounter) => {
        if (!record) return <></>;
        return (
          <Link to={
            ({ search }) => `${DashboardAccountsHistoryLocation}?${createWrapper(search).set('function', field)}`
          }
          >
            {field}
          </Link>
        );
      },
    },
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
