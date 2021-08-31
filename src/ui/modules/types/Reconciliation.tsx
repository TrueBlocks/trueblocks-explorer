import {
  address, blknum, double, int256, timestamp, uint64,
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
