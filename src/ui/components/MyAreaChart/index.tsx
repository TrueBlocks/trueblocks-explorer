import React from 'react';

import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

import { BaseTable } from '@components/Table';

export const MyAreaChart = ({
  items,
  columns = [],
  index = '',
  title = null,
  table = false,
  color = '#63b598',
}: {
  items: any[];
  columns?: any[];
  index?: string;
  title?: any;
  table?: boolean;
  color?: string;
}) => {
  if (columns.length < 2) {
    return <>Schema must have at least two fields in MyAreaChart</>;
  }
  return (
    <div key={index} style={table ? { display: 'grid', gridTemplateRows: '1fr 8fr' } : {}}>
      {title === null ? <></> : <h2>{title}</h2>}
      <div
        key={`${index}-d2`}
        style={
          table
            ? { display: 'grid', gridTemplateColumns: '15fr 25fr' }
            : { width: '100%', height: '200px', minWidth: '1' }
        }
      >
        {table ? <BaseTable dataSource={items} columns={columns} loading={false} defPageSize={10} /> : <></>}
        <ResponsiveContainer width='100%' height='100%' minWidth='500' minHeight='400'>
          <AreaChart width={500} height={400} data={items} margin={margins}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={columns[0].dataIndex} />
            <YAxis dataKey={columns[1].dataIndex} />
            <Area type='monotone' dataKey={columns[1].dataIndex} stackId='1' stroke={color} fill={color} />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const margins = {
  top: 5,
  right: 30,
  left: 0,
  bottom: 5,
};
