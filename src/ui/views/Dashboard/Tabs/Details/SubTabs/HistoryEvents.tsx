import React from 'react';

import { Log, Transaction } from '@sdk';
import { Card } from 'antd';

import { useGlobalNames } from '../../../../../State';
import { headerStyle, useAcctStyles } from '..';
import { FunctionDisplay } from '../components/FunctionDisplay';

//-----------------------------------------------------------------
export const HistoryEvents = ({ record }: { record: Transaction }) => {
  const key = `${record.blockNumber}.${record.transactionIndex}`;
  const styles = useAcctStyles();
  const { namesMap } = useGlobalNames();

  let title = '[no logs]';
  if (record.receipt && record.receipt.logs && record.receipt.logs.length > 0) {
    let titles = record.receipt.logs.map((log) => {
      const hasAddress = log.address !== null && log.address !== undefined;
      if (hasAddress) {
        const n = namesMap.get(log.address);
        const name = n ? ` from ${n.name}` : ` from ${log.address.slice(0, 6)}`;
        if (log.articulatedLog) {
          return `${log.articulatedLog.name}${name}`;
        }
        return `[unknown]${name}`;
      }
      return '';
    });
    titles = titles?.filter((log) => log !== '');
    if (titles.length !== 0) {
      title = titles.join(', ');
    } else {
      title = '[no relevant logs]';
    }
  }

  const relevants = record.receipt?.logs?.map((log, index) => {
    const hasAddress = log.address !== null && log.address !== undefined;
    if (!hasAddress) return <></>;
    return <RelevantLog log={log} index={log.logIndex} />;
  });

  const irrelevants = record.receipt?.logs?.map((log, index) => {
    const hasAddress = log.address !== null && log.address !== undefined;
    if (hasAddress) return <></>;
    return <IrrelevantLog index={index} />;
  });

  return (
    <div key={key} className={styles.container}>
      <div className={styles.cardHolder}>
        <Card
          className={styles.card}
          headStyle={headerStyle}
          hoverable
          title={title}
        >
          {relevants}
          {irrelevants}
        </Card>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------
const RelevantLog = ({ log, index } : {log: Log, index: number}) => ((
  <pre key={log.logIndex}>
    <b>
      <u>
        log
        {' '}
        {index}
        :
      </u>
    </b>
    <br />
    {JSON.stringify(log, null, 2)}
  </pre>
));

//-----------------------------------------------------------------
const IrrelevantLog = ({ index } : {index: number}) => {
  let s = `${index}`;
  while (s.length < 4) s = ` ${s}`;
  return (
    <div key={s} style={{ fontStyle: 'italic', color: 'darkgrey' }}>
      {`[log ${s}] is irrelevant`}
    </div>
  );
};
