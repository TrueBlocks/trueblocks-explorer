import { address, blknum, uint64 } from '@modules/types';

export type Chunk = {
  nApps: blknum;
  firstApp: blknum;
  latestApp: blknum;
  sizeInBytes: uint64;
  path: string;
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
export type ChunkArray = Chunk[];
