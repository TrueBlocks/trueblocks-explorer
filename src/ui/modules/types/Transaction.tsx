import {
  Accountname,
  address,
  blknum,
  date,
  gas,
  hash,
  Receipt,
  ReconciliationArray,
  timestamp,
  TraceArray,
  uint64,
  wei,
} from '@modules/types';

// TODO(data): Should we abstract out a new type - needs to be documented
type ArticulatedTx = {
  name: string,
  inputs: {}
};

// TODO(data): check to see if these data include all fields when generated from API_MODE=true command line. If yes, remove these 'optional' marks
export type Transaction = {
  id?: string;
  hash: hash;
  blockHash: hash;
  blockNumber: blknum;
  transactionIndex: blknum;
  nonce?: uint64;
  timestamp: timestamp;
  from: address;
  to: address;
  value: wei;
  extraValue1?: wei;
  extraValue2?: wei;
  gas: gas;
  gasPrice: gas;
  input?: string;
  isError: number;
  hasToken: number;
  cachebits?: boolean;
  reserved2?: boolean;
  receipt: Receipt;
  traces?: TraceArray;
  articulatedTx?: ArticulatedTx;
  compressedTx: string;
  statements?: ReconciliationArray;
  finalized?: boolean;
  date: date;
  // Added on front end
  // TODO: move it to a separate type
  fromName?: Accountname;
  toName?: Accountname;
  extraData?: string;
};
export type TransactionArray = Transaction[];
