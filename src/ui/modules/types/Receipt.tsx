import {
  address, blknum, bytes32, gas, hash, LogentryArray, wei,
} from '@modules/types';

// TODO(data): check to see if these data include all fields when generated from API_MODE=true command line. If yes, remove these 'optional' marks
export type Receipt = {
  blockHash?: hash;
  blockNumber?: blknum;
  contractAddress: address;
  cumulativeGasUsed?: wei;
  from?: address;
  gasUsed: gas;
  effectiveGasPrice: gas;
  logs?: LogentryArray;
  root?: bytes32;
  status: string | number;
  to?: address;
  transactionHash?: hash;
  transactionIndex?: blknum;
};
export type ReceiptArray = Receipt[];
