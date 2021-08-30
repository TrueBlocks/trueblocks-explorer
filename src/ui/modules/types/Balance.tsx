import { int256 } from '@modules/types';

export type Balance = {
  date: Date;
  balance: int256;
  reconciled: boolean;
};
export type BalanceArray = Balance[];
