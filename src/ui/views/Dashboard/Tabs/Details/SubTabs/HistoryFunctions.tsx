import React from 'react';

import { Transaction } from '@sdk';
import { Card } from 'antd';

import { headerStyle, useAcctStyles } from '..';
import { FunctionDisplay } from '../components/FunctionDisplay';

//-----------------------------------------------------------------
export const HistoryFunctions = ({ record }: { record: Transaction }) => {
  const key = `${record.blockNumber}.${record.transactionIndex}`;
  const styles = useAcctStyles();

  let title = record.articulatedTx?.name;
  if (!title) { title = (record.input !== '0x' ? '[unknown]' : '[native send]'); }

  return (
    <div key={key} className={styles.container}>
      <div className={styles.cardHolder}>
        <Card
          className={styles.card}
          headStyle={headerStyle}
          hoverable
          title={title}
        >
          <FunctionDisplay func={record.articulatedTx} bytes={record.input} />
        </Card>
      </div>
    </div>
  );
};
