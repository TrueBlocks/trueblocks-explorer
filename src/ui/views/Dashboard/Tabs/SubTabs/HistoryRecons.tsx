import { AccountViewParams } from '../../Dashboard';
import { useAcctStyles } from '../Details';
import { Reconciliation, Transaction } from '@modules/types';
import { Card } from 'antd';
import React from 'react';

//-----------------------------------------------------------------
export const HistoryRecons = ({ record, params }: { record: Transaction; params: AccountViewParams }) => {
  const { prefs } = params;

  if (!record) return <></>;
  const key = record.blockNumber + '.' + record.transactionIndex;
  const styles = useAcctStyles();
  return (
    <div key={key} className={styles.container}>
      <div key={key} className={styles.cardHolder}>
        {record?.statements?.map((statement: Reconciliation, index: number) =>
          oneStatement(statement, index, prefs.showDetails, prefs.setShowDetails, styles, key)
        )}
      </div>
      <div></div>
    </div>
  );
};

//-----------------------------------------------------------------
const oneStatement = (
  statement: Reconciliation,
  index: number,
  showDetails: boolean,
  setShowDetails: any,
  styles: any,
  key: string
) => {
  return (
    <Card
      key={key + '.' + index}
      className={styles.card}
      headStyle={{
        backgroundColor: 'lightgrey',
      }}
      hoverable={true}
      title={statementHeader(statement, showDetails, setShowDetails)}>
      {statementBody(statement, showDetails, styles)}
    </Card>
  );
};

//-----------------------------------------------------------------
const statementHeader = (statement: Reconciliation, showDetails: boolean, setShowDetails: any) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr', textAlign: 'start' }}>
      <div>
        {statement.assetSymbol + ' reconciliation'} [{statement.reconciliationType}] (spotPrice: {statement.spotPrice}-
        {statement.priceSource})
      </div>
      <div onClick={() => setShowDetails(!showDetails)}>{showDetails ? '-' : '+'}</div>
    </div>
  );
};

//-----------------------------------------------------------------
const clip = (num: string, diff?: boolean) => {
  const parts = num.split('.');
  if (parts.length === 0 || parts[0] === '') return <div style={{ color: 'lightgrey' }}>{'-'}</div>;
  if (parts.length === 1)
    return (
      <div style={diff ? { color: 'red' } : {}}>
        {parts[0]}
        {'.0000000'}
      </div>
    );
  return <div style={diff ? { color: 'red' } : {}}>{parts[0] + '.' + parts[1].substr(0, 7)}</div>;
};

//-----------------------------------------------------------------
const statementBody = (statement: Reconciliation, showDetails: boolean, styles: any) => {
  return (
    <table>
      <tbody>
        {oneRow(styles, showDetails, '', 'income', 'outflow', 'balance', 'diff', true)}
        {oneRow(
          styles,
          showDetails,
          'begBal',
          '',
          '',
          statement.begBal === '' ? '0.0000000' : statement.begBal,
          statement.begBalDiff
        )}
        {oneRow(styles, showDetails, 'amount', statement.amountIn, statement.amountOut)}
        {oneRow(styles, showDetails, 'internal', statement.internalIn, statement.internalOut)}
        {oneRow(styles, showDetails, 'selfDestruct', statement.selfDestructIn, statement.selfDestructOut)}
        {oneRow(styles, showDetails, 'minerBaseReward', statement.minerBaseRewardIn)}
        {oneRow(styles, showDetails, 'minerNephewReward', statement.minerNephewRewardIn)}
        {oneRow(styles, showDetails, 'minerTxFee', statement.minerTxFeeIn)}
        {oneRow(styles, showDetails, 'minerUncleReward', statement.minerUncleRewardIn)}
        {oneRow(styles, showDetails, 'prefund', statement.prefundIn)}
        {oneRow(styles, showDetails, 'gasCost', '', statement.gasCostOut)}
        {oneRow(
          styles,
          showDetails,
          'amountNet',
          '',
          '',
          statement.amountNet === '' ? '' : statement.amountNet > '0' ? '+' + statement.amountNet : statement.amountNet
        )}
        {oneRow(
          styles,
          showDetails,
          'endBal',
          '',
          '',
          statement.endBal === '' ? '0.0000000' : statement.endBal,
          statement.endBalDiff
        )}
        {oneDivider(styles, showDetails)}
        {/* {oneDebug(styles, showDetails, 'assetAddr', statement.assetAddr)} */}
        {oneDebug(styles, showDetails, 'assetSymbol', statement.assetSymbol)}
        {oneDebug(styles, showDetails, 'decimals', statement.decimals.toString())}
        {oneDebug(styles, showDetails, 'blockNumber', statement.blockNumber.toString())}
        {oneDebug(styles, showDetails, 'transactionIndex', statement.transactionIndex.toString())}
        {oneDebug(styles, showDetails, 'timestamp', statement.timestamp.toString())}
        {oneDebug(styles, showDetails, 'prevBlk', statement.prevBlk.toString())}
        {oneDivider(styles, showDetails)}
        {oneDebug(styles, showDetails, 'type', statement.reconciliationType)}
        {oneDebug(styles, showDetails, 'prevBlkBal', statement.prevBlkBal)}
        {oneDebug(styles, showDetails, 'begBal', statement.begBal)}
        {oneDebug(styles, showDetails, 'begBalDiff', statement.begBalDiff)}
        {oneDebug(styles, showDetails, 'endBal', statement.endBal)}
        {oneDebug(styles, showDetails, 'endBalCalc', statement.endBalCalc)}
        {oneDebug(styles, showDetails, 'endBalDiff', statement.endBalDiff)}
        {oneDebug(styles, showDetails, 'spotPrice', statement.spotPrice)}
        {oneDebug(
          styles,
          showDetails,
          'priceSource',
          statement.priceSource === '' ? 'not-priced' : statement.priceSource
        )}
        {/* {oneRow(styles, showDetails, 'reconciled', statement.reconciled ? 'true' : 'false')} */}
      </tbody>
    </table>
  );
};

//-----------------------------------------------------------------
const oneDivider = (styles: any, showDetails: boolean) => {
  if (!showDetails) return <></>;
  return (
    <tr>
      <td className={styles.tableRow} colSpan={6}>
        <hr />
      </td>
    </tr>
  );
};

//-----------------------------------------------------------------
const oneDebug = (styles: any, showDetails: boolean, name: string, value: string) => {
  if (!showDetails) return <></>;
  if (value === '') value = '0.0000000';
  let isErr: boolean = name?.includes('Diff') && value != '0.0000000';
  let disp = (
    <tr>
      <td className={styles.tableRow} style={{ width: '100px' }}>
        {name}
      </td>
      <td className={styles.tableRow} style={{ width: '20px' }}>
        {' '}
      </td>
      <td
        className={styles.tableRow}
        style={isErr ? { color: 'red', textAlign: 'right' } : { textAlign: 'right' }}
        colSpan={2}>
        {value}
      </td>
      <td className={styles.tableRow} colSpan={2}>
        {' '}
      </td>
    </tr>
  );
  return disp;
};

//-----------------------------------------------------------------
const oneRow = (
  styles: any,
  showDetails: boolean,
  name: string,
  valueIn: string,
  valueOut: string = '',
  balance: string = '',
  diffIn: string = '',
  header: boolean = false
) => {
  const v1: number = +valueIn;
  const v2: number = +valueOut;
  if (!showDetails && name !== 'begBal' && name !== 'endBal' && v1 + v2 === 0) return <></>;

  const valI = header ? valueIn : clip(valueIn);
  const valO = header ? valueOut : clip(valueOut);
  const bal = header ? balance : clip(balance);
  const diff = header ? diffIn : clip(diffIn, true);
  const style = header ? styles.tableHead : styles.tableRow;
  const dStyle = diffIn !== '' ? {} : { color: 'red' };

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
      <td className={style} style={{ ...dStyle, width: '100px' }}>
        {diff}
      </td>
    </tr>
  );
};
