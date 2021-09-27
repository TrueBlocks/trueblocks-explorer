import {
  address, blknum, hash, TopicArray,
} from '@modules/types';

type ArticulatedLog = {
  name: string,
  inputs: {
    name?: string,
    [param: string]: string | undefined
  }
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
