import { address, blknum, uint64 } from '@modules/types';

export declare type Monitor = {
  nApps: blknum;
  firstApp: blknum;
  latestApp: blknum;
  path: string;
  sizeInBytes: uint64;
  address: address;
  decimals: uint64;
  deleted: boolean;
  description: string;
  is_contract: boolean;
  is_custom: boolean;
  is_erc20: boolean;
  is_erc721: boolean;
  is_prefund: boolean;
  name: string;
  source: string;
  symbol: string;
  tags: string;
};
export declare type MonitorArray = Monitor[];
