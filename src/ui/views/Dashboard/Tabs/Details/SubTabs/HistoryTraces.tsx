import React from 'react';

import { Log } from '@sdk';
import { Card } from 'antd';

import { FixedTransaction } from '@modules/type_fixes';

import { useAcctStyles } from '..';

//-----------------------------------------------------------------
export const AccountHistoryTraces = ({ record }: { record: FixedTransaction }) => {
  const styles = useAcctStyles();
  if (!record) return <></>;
  const key = `${record.blockNumber}.${record.transactionIndex}`;
  // TODO(data): fix line 27 -- should not require '?'
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
          title='Events'
        >
          {showLogs(record?.receipt?.logs || [])}
        </Card>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------
const showLogs = (logs: Log[]) => {
  if (!logs) return <></>;
  return logs.map((log, index) => (
    <pre key={log.address}>
      [
      {index}
      ]:
      {' '}
      {JSON.stringify(log, null, 2)}
    </pre>
  ));
};
