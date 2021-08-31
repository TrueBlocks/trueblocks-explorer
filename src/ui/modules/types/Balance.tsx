import { double } from '@modules/types';

export type Balance = {
  date: Date;
  balance: double;
  reconciled: boolean;
};
export type BalanceArray = Balance[];
