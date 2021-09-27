import React from 'react';

import dayjs from 'dayjs';

import {
  Transaction,
} from '@modules/types';

export const DateDisplay = ({ record }: { record: Transaction}) => {
  if (!record) return <div />;

  // Convert the date to standard ISO 8601 format that JavaScript understands
  const isoDateString = record.date
    ?.replace(/[\s]UTC/, 'Z')
    ?.replace(/[\s]/, 'T');

  return (
    <pre>
      <div>{dayjs(isoDateString).format('YYYY-MM-DD HH:mm:ss')}</div>
      <div>{dayjs.unix(record.timestamp).fromNow()}</div>
      <div style={{ fontSize: 'small', fontStyle: 'italic' }}>
        {`${record.blockNumber?.toString()}.${record.transactionIndex?.toString()}`}
      </div>
    </pre>
  );
};
