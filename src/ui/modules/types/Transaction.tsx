import {
  Accountname,
  address,
  blknum,
  date,
  Function,
  gas,
  hash,
  Receipt,
  ReconciliationArray,
  timestamp,
  TraceArray,
  uint64,
  wei,
} from '@modules/types';

export type Transaction = {
  id: string;
  hash: hash;
  blockHash: hash;
  blockNumber: blknum;
  transactionIndex: blknum;
  nonce: uint64;
  timestamp: timestamp;
  from: address;
  to: address;
  value: wei;
  extraValue1: wei;
  extraValue2: wei;
  gas: gas;
  gasPrice: gas;
  input: string;
  isError: boolean;
  hasToken: boolean;
  cachebits: boolean;
  reserved2: boolean;
  receipt: Receipt;
  traces: TraceArray;
  articulatedTx: Function;
  compressedTx: string;
  statements: ReconciliationArray;
  finalized: boolean;
  date: date;
  // Added on front end
  fromName: Accountname;
  toName: Accountname;
  extraData: string;
};
export type TransactionArray = Transaction[];
