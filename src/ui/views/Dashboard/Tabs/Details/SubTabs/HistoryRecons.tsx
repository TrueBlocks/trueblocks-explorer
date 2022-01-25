import React from 'react';

import { Reconciliation, Transaction } from '@sdk';
import { Card } from 'antd';

import {
  double, priceReconciliation,
} from '@modules/types';

import { AccountViewParams } from '../../../Dashboard';
import { useAcctStyles } from '..';

//-----------------------------------------------------------------
export const HistoryRecons = ({ record, params }: { record: Transaction; params: AccountViewParams }) => {
  const { prefs } = params;
  const { denom } = params.prefs;
  const styles = useAcctStyles();

  if (!record) return <></>;
  const key = `${record.blockNumber}.${record.transactionIndex}`;
  return (
    <div key={key} className={styles.container}>
      <div key={key} className={styles.cardHolder}>
        {(record?.statements as unknown as Reconciliation[])?.map((statement: Reconciliation, index: number) => {
          const statementIn = priceReconciliation(statement, denom);
          return oneStatement(statementIn, index, prefs.showDetails, prefs.setShowDetails, styles, key);
        })}
      </div>
      <div />
    </div>
  );
};

const oneStatement = (
  statement: Reconciliation,
  index: number,
  details: boolean,
  setShowDetails: any,
  styles: any,
  key: string,
) => (
  <Card
    key={`${key}.${index}`}
    className={styles.card}
    headStyle={{
      backgroundColor: 'lightgrey',
      fontSize: '16pt',
      color: 'darkBlue',
    }}
    hoverable
    title={statementHeader(statement, details, setShowDetails)}
  >
    {statementBody(statement, details, styles)}
  </Card>
);

//-----------------------------------------------------------------
const statementHeader = (statement: Reconciliation, details: boolean, setShowDetails: any) => (
  <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr', textAlign: 'start' }}>
    <div>
      {`${statement.assetSymbol} reconciliation`}
      {' '}
      [
      {statement.reconciliationType}
      ] (spotPrice:
      {statement.spotPrice}
      -
      {statement.priceSource}
      )
    </div>
    <button style={{ outline: 'none' }} type='button' onClick={() => setShowDetails(!details)}>
      {details ? '-' : '+'}
    </button>
  </div>
);

//-----------------------------------------------------------------
const statementBody = (statement: Reconciliation, details: boolean, styles: any) => {
  const rowStyle = styles.tableRow;
  const detailView = !details ? <></> : (
    <>
      {DividerRow(rowStyle)}
      {DetailRow(rowStyle, 'assetSymbol', statement.assetSymbol)}
      {DetailRow(rowStyle, 'decimals', statement.decimals)}
      {DetailRow(rowStyle, 'prevBlk', statement.prevBlk.toString())}
      {DetailRow(rowStyle, 'blockNumber', statement.blockNumber.toString())}
      {DetailRow(rowStyle, 'transactionIndex', statement.transactionIndex.toString())}
      {DetailRow(rowStyle, 'timestamp', statement.timestamp.toString())}

      {DividerRow(rowStyle)}
      {DetailRow(rowStyle, 'type', statement.reconciliationType)}
      {DetailRow(rowStyle, 'prevBlkBal', statement.prevBlkBal)}
      {DetailRow(rowStyle, 'begBal', statement.begBal)}
      {DetailRow(rowStyle, 'begBalDiff', statement.begBalDiff)}
      {DetailRow(rowStyle, 'endBal', statement.endBal)}
      {DetailRow(rowStyle, 'endBalCalc', statement.endBalCalc)}
      {DetailRow(rowStyle, 'endBalDiff', statement.endBalDiff)}
      {DetailRow(rowStyle, 'spotPrice', statement.spotPrice)}
      {DetailRow(rowStyle, 'priceSource', statement.priceSource === '' ? 'not-priced' : statement.priceSource)}
    </>
  );

  const toNumberArguments = (...strings: string[]): number[] => strings.map((someString) => (
    someString === '' ? 0.0 : parseFloat(someString)));

  return (
    <table>
      <tbody>
        <HeaderRow />
        {BodyRow(rowStyle, 'begBal', details, 0, 0, ...toNumberArguments(statement.begBal, statement.begBalDiff))}
        {BodyRow(rowStyle, 'amount', details, ...toNumberArguments(statement.amountIn, statement.amountOut))}
        {BodyRow(rowStyle, 'internal', details, ...toNumberArguments(statement.internalIn, statement.internalOut))}
        {BodyRow(rowStyle, 'selfDestruct', details, ...toNumberArguments(statement.selfDestructIn, statement.selfDestructOut))}
        {BodyRow(rowStyle, 'baseReward', details, ...toNumberArguments(statement.minerBaseRewardIn), 0)}
        {BodyRow(rowStyle, 'txFee', details, ...toNumberArguments(statement.minerTxFeeIn), 0)}
        {BodyRow(rowStyle, 'nephewReward', details, ...toNumberArguments(statement.minerNephewRewardIn), 0)}
        {BodyRow(rowStyle, 'uncleReward', details, ...toNumberArguments(statement.minerUncleRewardIn), 0)}
        {BodyRow(rowStyle, 'prefund', details, ...toNumberArguments(statement.prefundIn), 0)}
        {BodyRow(rowStyle, 'gasCost', details, 0, ...toNumberArguments(statement.gasCostOut))}
        {BodyRow(rowStyle, 'totalNet', details, 0, 0, ...toNumberArguments(statement.amountNet))}
        {BodyRow(rowStyle, 'endBal', details, 0, 0, ...toNumberArguments(statement.endBal, statement.endBalDiff))}
        {detailView}
      </tbody>
    </table>
  );
};

//-----------------------------------------------------------------
const clip2 = (num: double) => {
  if (!num) return <div style={{ color: 'lightgrey' }}>-</div>;
  return <div>{Number(num).toFixed(5)}</div>;
};

//-----------------------------------------------------------------
const clip3 = (num: double) => <div>{Number(num).toFixed(5)}</div>;

//-----------------------------------------------------------------
const BodyRow = (
  style: string,
  name: string,
  details: boolean,
  valueIn: double = 0,
  valueOut: double = 0,
  balance: double = 0,
  diffIn: double = 0,
) => {
  const isShowZero = name === 'begBal' || name === 'endBal' || name === 'totalNet';
  const isBal = name === 'begBal' || name === 'endBal';
  // TODO: Comment by @dszlachta
  // TODO: If I remove Number here, the test fails and empty rows show up on Reconciliation component
  if (Number(valueIn) === 0
    && Number(valueOut) === 0
    && Number(balance) === 0
    && Number(diffIn) === 0
    && !isShowZero && !details) { return <></>; }

  const plain = { color: 'black', width: '100px' };
  const green = { color: 'green', width: '100px' };
  const red = { color: 'red', width: '100px' };
  const balStyle = balance < 0 ? red : green;

  return (
    <tr>
      <td className={style} style={plain}>
        {name}
      </td>
      <td className={style} style={{ width: '20px' }} />
      <td className={style} style={green}>
        {clip2(valueIn)}
      </td>
      <td className={style} style={red}>
        {clip2(valueOut)}
      </td>
      <td className={style} style={isBal ? plain : balStyle}>
        {isBal ? clip3(balance) : clip2(balance)}
      </td>
      <td className={style} style={red}>
        {clip2(diffIn)}
      </td>
    </tr>
  );
};

//-----------------------------------------------------------------
const DetailRow = (style: string, name: string, value: double | string) => {
  const isErr: boolean = name?.includes('Diff') && value !== 0;
  const disp = (
    <tr>
      <td className={style} style={{ width: '100px' }} colSpan={2}>
        {name}
      </td>
      <td
        className={style}
        style={isErr ? { color: 'red', textAlign: 'right' } : { textAlign: 'right' }}
        colSpan={3}
      >
        {typeof value === 'string' ? value : clip2(value)}
      </td>
      <td className={style} />
    </tr>
  );
  return disp;
};

//-----------------------------------------------------------------
const DividerRow = (style: string) => (
  <tr>
    <td className={style} colSpan={6}>
      <hr />
    </td>
  </tr>
);

//-----------------------------------------------------------------
const HeaderRow = () => {
  const styles = useAcctStyles();
  return (
    <tr>
      <td className={styles.tableHead} style={{ width: '100px' }} />
      <td className={styles.tableHead} style={{ width: '20px' }} />
      <td className={styles.tableHead} style={{ width: '100px' }}>income</td>
      <td className={styles.tableHead} style={{ width: '100px' }}>outflow</td>
      <td className={styles.tableHead} style={{ width: '100px' }}>balance</td>
      <td className={styles.tableHead} style={{ width: '100px' }}>diff</td>
    </tr>
  );
};
