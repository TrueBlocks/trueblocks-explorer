import {
  address, blknum, hash, TopicArray,
} from '@modules/types';

type ArticulatedLog = {
  name: string,
  inputs: {}
}

export type Logentry = {
  address: address;
  blockHash?: hash;
  blockNumber?: blknum;
  logIndex: blknum;
  topics: TopicArray;
  data: string;
  articulatedLog?: ArticulatedLog;
  compressedLog?: string;
  transactionHash?: hash;
  transactionIndex?: blknum;
  transactionLogIndex?: blknum;
  type?: string;
  removed?: boolean;
};
export type LogentryArray = Logentry[];
