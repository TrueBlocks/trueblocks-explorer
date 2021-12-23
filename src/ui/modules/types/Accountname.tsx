import { Name } from '@sdk';

export function createEmptyAccountname(): Name {
  return {
    tags: '',
    address: '',
    name: '',
    symbol: '',
    source: '',
    decimals: 0,
    description: '',
    isCustom: false,
    isPrefund: false,
    isContract: false,
    isErc20: false,
    isErc721: false,
    deleted: false,
  };
}
