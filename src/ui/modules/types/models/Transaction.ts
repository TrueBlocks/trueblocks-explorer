import { Name, Transaction } from '@sdk';

export type TransactionModel =
  Transaction
  & {
    id: string,
    fromName: Name,
    toName: Name,
  }