import {
  Transaction,
} from '@sdk';
import dayjs from 'dayjs';

import { sendTheExport } from '../../../../../../Utilities';

//-------------------------------------------------------------------------
export const exportToCsv = (theData: Transaction[]) => {
  sendTheExport('csv', convertToText(theData, ','));
};

//-------------------------------------------------------------------------
export const exportToTxt = (theData: Transaction[]) => {
  sendTheExport('txt', convertToText(theData, '\t'));
};

//-------------------------------------------------------------------------
export const headers = [
  'blockNumber',
  'transactionIndex',
  'date',
  'time',
  'assetAddr',
  'assetSymbol',
  'amountIn',
  'amountOut',
  'spotPrice',
  'type',
  'function',
  'from',
  'to',
  'fromName',
  'toName',
  'txHash',
];

//-------------------------------------------------------------------------
export const incomeFields = [
  'amountIn',
  'internalIn',
  'selfDestructIn',
  'minerBaseRewardIn',
  'minerNephewRewardIn',
  'minerTxFeeIn',
  'minerUncleRewardIn',
  'prefundIn',
];

//-------------------------------------------------------------------------
export const outflowFields = ['amountOut', 'internalOut', 'selfDestructOut', 'gasCostOut'];

//-------------------------------------------------------------------------
export const convertToText = (theData: Transaction[], delim: string) => {
  const sorted = theData;
  const txs = sorted.flatMap((trans: any) => trans.statements.flatMap((statement: any) => {
    const {
      blockNumber, transactionIndex, from, to, hash, fromName, toName, timestamp, compressedTx,
    } = trans;
    const {
      assetAddr, assetSymbol, spotPrice,
    } = statement;
    const parts = compressedTx.split('(');
    const func = parts.length > 0 ? parts[0] : '';

    const inflows = incomeFields
      .filter((field: any) => !trans.isError && statement[field].length > 0 && statement.amountNet !== 0)
      .map((field: string) => [
        blockNumber,
        transactionIndex,
        dayjs.unix(timestamp).format('YYYY/MM/DD'),
        dayjs.unix(timestamp).format('HH:mm:ss'),
        assetAddr,
        assetSymbol,
        statement[field],
        '0.0000000',
        spotPrice,
        field,
        func,
        from,
        to,
        fromName.name,
        toName.name,
        hash,
      ]);

    const outflows = outflowFields
      .filter((field: any) => !trans.isError && statement[field].length > 0 && statement.amountNet !== 0)
      .map((field: string) => [
        blockNumber,
        transactionIndex,
        dayjs.unix(timestamp).format('YYYY/MM/DD'),
        dayjs.unix(timestamp).format('HH:mm:ss'),
        assetAddr,
        assetSymbol,
        '0.0000000',
        statement[field],
        spotPrice,
        field,
        func,
        from,
        to,
        fromName.name,
        toName.name,
        hash,
      ]);

    return inflows.concat(outflows);
  }));
  txs.unshift(headers);
  return `${txs.map((row: any[]) => row.join(delim)).join('\n')}\n`;
};
