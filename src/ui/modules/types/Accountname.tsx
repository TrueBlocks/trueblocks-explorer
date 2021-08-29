import { address, uint64 } from '@modules/types';

export type Accountname = {
  tags: string;
  address: address;
  name: string;
  symbol: string;
  source: string;
  decimals: uint64;
  description: string;
  is_custom: boolean;
  is_prefund: boolean;
  is_contract: boolean;
  is_erc20: boolean;
  is_erc721: boolean;
  deleted: boolean;
};
export type AccountnameArray = Accountname[];

export function createEmptyAccountname(): Accountname {
  return {
    tags: '',
    address: '',
    name: '',
    symbol: '',
    source: '',
    decimals: 0,
    description: '',
    is_custom: false,
    is_prefund: false,
    is_contract: false,
    is_erc20: false,
    is_erc721: false,
    deleted: false,
  };
}
