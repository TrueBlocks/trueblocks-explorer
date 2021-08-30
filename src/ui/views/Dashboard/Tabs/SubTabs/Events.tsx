import React from 'react';
import { Link } from 'react-router-dom';

import { ColumnsType } from 'antd/lib/table';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import {
  ItemCounter, ItemCounterArray, Transaction, TransactionArray,
} from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../Routes';

export const Events = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;

  const counts = Object.create(null);
  theData.forEach((item: Transaction, i: number) => {
    item.receipt?.logs?.map((item: any) => {
      if (item.articulatedLog) {
        if (!counts[item.articulatedLog?.name]) counts[item.articulatedLog?.name] = 1;
        else counts[item.articulatedLog?.name] = Number(counts[item.articulatedLog?.name]) + 1;
      }
    });
  });

  const uniqItems: ItemCounterArray = [];
  Object.keys(counts).map((key: any) => {
    uniqItems.push({
      evt: key,
      count: counts[key],
    });
  });

  uniqItems.sort((a: ItemCounter, b: ItemCounter) => {
    if (b.count === a.count) return a.evt.localeCompare(b.evt);
    return b.count - a.count;
  });

  const top = uniqItems.filter((item: ItemCounter, i: number) => i < 10);
  const remains = uniqItems.filter((item: ItemCounter, i: number) => i >= 10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <MyAreaChart title='Top Ten Events' items={top} columns={countSchema} table />
      <MyAreaChart title='Other Events' items={remains} columns={countSchema} table />
    </div>
  );
};

export const countSchema: ColumnsType<ItemCounter> = [
  addColumn({
    title: 'Event',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: ItemCounter) => {
        if (!record) return <></>;
        return <Link to={`${DashboardAccountsHistoryLocation}?event=${field}`}>{field}</Link>;
      },
    },
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
