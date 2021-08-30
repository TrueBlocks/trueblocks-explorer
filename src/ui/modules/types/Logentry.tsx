import { address, blknum, Function, hash, TopicArray } from '@modules/types';

export type Logentry = {
  address: address;
  blockHash: hash;
  blockNumber: blknum;
  logIndex: blknum;
  topics: TopicArray;
  data: string;
  articulatedLog: Function;
  compressedLog: string;
  transactionHash: hash;
  transactionIndex: blknum;
  transactionLogIndex: blknum;
  type: string;
  removed: boolean;
};
export type LogentryArray = Logentry[];
