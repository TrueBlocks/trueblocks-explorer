import React from 'react';

import dayjs from 'dayjs';

import {
  Transaction,
} from '@modules/types';

export const DateDisplay = ({ record }: { record: Transaction}) => {
  if (!record) return <div />;
  return (
    <pre>
      <div>{dayjs(record.date).format('YYYY-MM-DD HH:mm:ss')}</div>
      <div>{dayjs.unix(record.timestamp).fromNow()}</div>
      <div style={{ fontSize: 'small', fontStyle: 'italic' }}>
        {`${record.blockNumber?.toString()}.${record.transactionIndex?.toString()}`}
      </div>
    </pre>
  );
};
