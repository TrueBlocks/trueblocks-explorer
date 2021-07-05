import { Reconciliation, Transaction } from '@modules/types';
import { Card } from 'antd';
import React from 'react';
import { useAcctStyles } from '../AccountStyles';

//-----------------------------------------------------------------
export const AccountRecons = ({ record }: { record: Transaction }) => {
  const styles = useAcctStyles();
  return (
    <div className={styles.container}>
      <div></div>
      <div className={styles.cardHolder}>
        {record.statements?.map((statement: Reconciliation) => oneStatement(statement))}
      </div>
      <div></div>
    </div>
  );
};

//-----------------------------------------------------------------
const oneStatement = (statement: Reconciliation) => {
  const styles = useAcctStyles();
  return (
    <Card
      className={styles.card}
      headStyle={{
        backgroundColor: 'indianred',
      }}
      hoverable={true}
      title={statementHeader(statement)}>
      {statementBody(statement)}
    </Card>
  );
};

//-----------------------------------------------------------------
const statementHeader = (statement: Reconciliation) => {
  return statement.assetSymbol + ' reconciliation';
};

//-----------------------------------------------------------------
const clip = (num: string) => {
  const parts = num.split('.');
  if (parts.length === 0 || parts[0] === '') return <div style={{ color: 'lightgrey' }}>{'-'}</div>;
  if (parts.length === 1) return parts[0] + <div>{'.0000000'}</div>;
  return <div>{parts[0] + '.' + parts[1].substr(0, 7)}</div>;
};

//-----------------------------------------------------------------
const oneRow = (
  name: string,
  valueIn: string,
  valueOut: string = '',
  balance: string = '',
  diffIn: string = '',
  header: boolean = false
) => {
  const styles = useAcctStyles();
  const valI = header ? valueIn : clip(valueIn);
  const valO = header ? valueOut : clip(valueOut);
  const bal = header ? balance : clip(balance);
  const diff = header ? diffIn : clip(diffIn);
  const style = header ? styles.tableHead : styles.tableRow;
  return (
    <tr>
      <td className={style} style={{ width: '100px' }}>
        {name}
      </td>
      <td className={style} style={{ width: '20px' }}>
        {' '}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {valI}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {valO}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {bal}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {diff}
      </td>
    </tr>
  );
};

//-----------------------------------------------------------------
const statementBody = (statement: Reconciliation) => {
  return (
    <table>
      <tbody>
        {/* {oneRow('blockNumber', statement.blockNumber.toString())}
        {oneRow('transactionIndex', statement.transactionIndex.toString())}
        {oneRow('timestamp', statement.timestamp.toString())}
        {oneRow('assetAddr', statement.assetAddr)}
        {oneRow('assetSymbol', statement.assetSymbol)}
        {oneRow('decimals', statement.decimals.toString())} */}
        {oneRow('', 'income', 'outflow', 'balance', 'diff', true)}
        {oneRow('begBal', '', '', statement.begBal === '' ? '0.0000000' : statement.begBal, statement.begBalDiff)}
        {oneRow('amount', statement.amountIn, statement.amountOut)}
        {oneRow('internal', statement.internalIn, statement.internalOut)}
        {oneRow('selfDestruct', statement.selfDestructIn, statement.selfDestructOut)}
        {oneRow('minerBaseReward', statement.minerBaseRewardIn)}
        {oneRow('minerNephewReward', statement.minerNephewRewardIn)}
        {oneRow('minerTxFee', statement.minerTxFeeIn)}
        {oneRow('minerUncleReward', statement.minerUncleRewardIn)}
        {oneRow('prefund', statement.prefundIn)}
        {oneRow('gasCost', '', statement.gasCostOut)}
        {oneRow(
          'amountNet',
          '',
          '',
          statement.amountNet === '' ? '' : statement.amountNet > '0' ? '+' + statement.amountNet : statement.amountNet
        )}
        {oneRow('endBal', '', '', statement.endBal === '' ? '0.0000000' : statement.endBal, statement.endBalDiff)}
        {/* {oneRow('endBalCalc', '', '', statement.endBalCalc)} */}
        {/* {oneRow('reconciliationType', statement.reconciliationType, '')}
        {oneRow('reconciled', statement.reconciled ? 'true' : 'false', '')} */}
      </tbody>
    </table>
  );
};
