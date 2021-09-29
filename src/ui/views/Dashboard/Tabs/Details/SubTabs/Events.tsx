import React from 'react';
import { Link } from 'react-router-dom';

import { ColumnsType } from 'antd/lib/table';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { createWrapper } from '@hooks/useSearchParams';
import {
  ItemCounter, ItemCounterArray, Transaction, TransactionArray,
} from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../../Routes';

export const Events = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;

  const counts: Record<string, number> = {};
  // TODO: Comment by @dszlachta
  // TODO: Would you say that it's worth it to move the inner loop (map) outside?
  // TODO: I find it easier to understand the code when loops are outside, but
  // TODO: this is a personal preference.
  // TODO: note that you don't need type annotations here, TS can infer them.
  // TODO: flatMap is like map, but it flattens the resulting array of arrays
  // TODO:  theData.flatMap((item) => item.receipt.logs)
  // TODO:     .forEach((log) => {
  // TODO:       if (!log.articulatedLog) return; // BTW, type definition says it's always present
  // TODO:       const countKey = log.articulatedLog.name;
  // TODO:       counts[countKey] = (counts[countKey] || 0) + 1;
  // TODO:     });
  theData.forEach((item: Transaction) => {
    item.receipt?.logs?.map((log: any) => {
      if (log.articulatedLog) {
        if (!counts[log.articulatedLog?.name]) counts[log.articulatedLog?.name] = 1;
        else counts[log.articulatedLog?.name] = Number(counts[log.articulatedLog?.name]) + 1;
      }
      return null;
    });
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <MyAreaChart title='Top Ten Events' items={top} columns={evtCountSchema} table />
      <MyAreaChart title='Other Events' items={remains} columns={evtCountSchema} table />
    </div>
  );
};

export const evtCountSchema: ColumnsType<ItemCounter> = [
  addColumn({
    title: 'Event',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: ItemCounter) => {
        if (!record) return <></>;

        return (
          <Link to={
            ({ search }) => `${DashboardAccountsHistoryLocation}?${createWrapper(search).set('event', field)}`
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
