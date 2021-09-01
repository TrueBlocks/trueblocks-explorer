import {
  address, blknum, double, timestamp, uint64,
} from '@modules/types';

export type Reconciliation = {
  blockNumber: blknum;
  transactionIndex: blknum;
  timestamp: timestamp;
  assetAddr: address;
  assetSymbol: string;
  decimals: uint64;
  prevBlk: blknum;
  prevBlkBal: double;
  begBal: double;
  begBalDiff: double;
  amountIn: double;
  amountOut: double;
  internalIn: double;
  internalOut: double;
  selfDestructIn: double;
  selfDestructOut: double;
  minerBaseRewardIn: double;
  minerNephewRewardIn: double;
  minerTxFeeIn: double;
  minerUncleRewardIn: double;
  prefundIn: double;
  gasCostOut: double;
  endBal: double;
  endBalCalc: double;
  endBalDiff: double;
  amountNet: double;
  spotPrice: double;
  priceSource: string;
  reconciliationType: string;
  reconciled: boolean;
  totalIn: double;
  totalOut: double;
  totalOutLessGas: double;
};
export type ReconciliationArray = Reconciliation[];

//-----------------------------------------------------------------
export const priceReconciliation = (statementIn: Reconciliation, denom: string) => {
  if (denom === 'ether') { return statementIn; }

  const statement: Reconciliation = JSON.parse(JSON.stringify(statementIn));
  statement.prevBlkBal = (statementIn.prevBlkBal * statementIn.spotPrice);
  statement.begBal = (statementIn.begBal * statementIn.spotPrice);
  statement.begBalDiff = (statementIn.begBalDiff * statementIn.spotPrice);
  statement.amountIn = (statementIn.amountIn * statementIn.spotPrice);
  statement.amountOut = (statementIn.amountOut * statementIn.spotPrice);
  statement.internalIn = (statementIn.internalIn * statementIn.spotPrice);
  statement.internalOut = (statementIn.internalOut * statementIn.spotPrice);
  statement.selfDestructIn = (statementIn.selfDestructIn * statementIn.spotPrice);
  statement.selfDestructOut = (statementIn.selfDestructOut * statementIn.spotPrice);
  statement.minerBaseRewardIn = (statementIn.minerBaseRewardIn * statementIn.spotPrice);
  statement.minerNephewRewardIn = (statementIn.minerNephewRewardIn * statementIn.spotPrice);
  statement.minerTxFeeIn = (statementIn.minerTxFeeIn * statementIn.spotPrice);
  statement.minerUncleRewardIn = (statementIn.minerUncleRewardIn * statementIn.spotPrice);
  statement.prefundIn = (statementIn.prefundIn * statementIn.spotPrice);
  statement.gasCostOut = (statementIn.gasCostOut * statementIn.spotPrice);
  statement.gasCostOut = (statementIn.gasCostOut * statementIn.spotPrice);
  statement.endBal = (statementIn.endBal * statementIn.spotPrice);
  statement.endBalCalc = (statementIn.endBalCalc * statementIn.spotPrice);
  statement.endBalDiff = (statementIn.endBalDiff * statementIn.spotPrice);
  statement.amountNet = (statementIn.amountNet * statementIn.spotPrice);
  statement.totalIn = (statementIn.totalIn * statementIn.spotPrice);
  statement.totalOut = (statementIn.totalOut * statementIn.spotPrice);
  statement.totalOutLessGas = (statementIn.totalOutLessGas * statementIn.spotPrice);
  return statement;
};
