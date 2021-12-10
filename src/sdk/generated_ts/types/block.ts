import { gas, hash, blknum, address, uint64, timestamp, Transaction, wei } from "../types";

export type Block = {
  gasLimit: gas
  hash: hash
  blockNumber: blknum
  parentHash: hash
  miner: address
  difficulty: uint64
  timestamp: timestamp
  transactions: Transaction[]
  baseFeePerGas: wei
  finalized: boolean
}
