import {
  address, blknum, hash, TopicArray,
} from '@modules/types';

// TODO(data): Should we abstract out a new type - needs to be documented
type ArticulatedLog = {
  name: string,
  inputs: {
    name?: string,
    [param: string]: string | undefined
  }
}

// TODO(data): check to see if these data include all fields when generated from API_MODE=true command line. If yes, remove these 'optional' marks
export type Logentry = {
  address?: address;
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
