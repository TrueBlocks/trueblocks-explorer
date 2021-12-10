import { blknum, timestamp, address, uint64, int256, double } from "../types";

export type Reconciliation = {
  blockNumber: blknum
  transactionIndex: blknum
  timestamp: timestamp
  assetAddr: address
  assetSymbol: string
  decimals: uint64
  prevBlk: blknum
  prevBlkBal: int256
  begBal: int256
  begBalDiff: int256
  amountIn: int256
  amountOut: int256
  internalIn: int256
  internalOut: int256
  selfDestructIn: int256
  selfDestructOut: int256
  minerBaseRewardIn: int256
  minerNephewRewardIn: int256
  minerTxFeeIn: int256
  minerUncleRewardIn: int256
  prefundIn: int256
  spotPrice: double
  priceSource: string
  gasCostOut: int256
  endBal: int256
  totalIn: int256
  totalOut: int256
  totalOutLessGas: int256
  amountNet: int256
  endBalCalc: int256
  reconciliationType: string
  endBalDiff: int256
  reconciled: boolean
}
