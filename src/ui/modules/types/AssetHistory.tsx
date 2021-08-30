import { address, BalanceArray } from '@modules/types';

export type AssetHistory = {
  assetAddr: address;
  assetSymbol: string;
  balHistory: BalanceArray;
};
export type AssetHistoryArray = AssetHistory[];
