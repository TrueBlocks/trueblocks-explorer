import React from 'react';

import { Card } from 'antd';

import { Transaction } from '@modules/types';

import { useAcctStyles } from '..';

//-----------------------------------------------------------------
export const HistoryFunctions = ({ record }: { record: Transaction }) => {
  if (!record) return <></>;
  const key = `${record.blockNumber}.${record.transactionIndex}`;
  const styles = useAcctStyles();
  return (
    <div key={key} className={styles.container}>
      <div key={key} className={styles.cardHolder}>
        <Card
          key={key}
          className={styles.card}
          headStyle={{
            backgroundColor: 'lightgrey',
          }}
          hoverable
          title='Input'
        >
          {showInput(record, key)}
        </Card>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------
const showInput = (record: Transaction, key: string) => {
  if (!record || !record.input) return <></>;
  let str = record.input;
  if (str?.length < 10) <pre>{str}</pre>;
  const head = str.slice(0, 10);
  str = str.replace(head, '');

  const json = <pre>{JSON.stringify(record.articulatedTx, null, 2)}</pre>;
  const comp = <div>{JSON.stringify(record.compressedTx).replace(/"/g, '')}</div>;
  const bytes = (
    <pre>
      <div>{head}</div>
      {str?.match(/.{1,64}/g)?.map((s, index) => (
        <div key={`${key}.${index}`}>{s}</div>
      ))}
    </pre>
  );
  return (
    <div>
      {oneItem('Articulated', json)}
      {/* {oneItem('Compressed Tx', comp)} */}
      {oneItem('Input bytes', bytes)}
    </div>
  );
};

//-----------------------------------------------------------------
const oneItem = (title: string, component: React.ReactElement) => (
  <div>
    <b>
      <u>
        {title}
        :
      </u>
    </b>
    {component}
    <br />
  </div>
);
