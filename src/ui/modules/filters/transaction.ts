import { Eq } from 'fp-ts/lib/Eq';
import { none, some } from 'fp-ts/lib/Option';

import { Transaction, TransactionArray } from '@modules/types';

export const TransactionEquality: Eq<Transaction> = {
  equals({ hash: firstHash }: Transaction, { hash: secondHash }: Transaction) {
    return firstHash === secondHash;
  },
};

export function createTransactionFilter(filter: (v: string, t: TransactionArray) => TransactionArray) {
  return (valueToFilterBy: string, transactions: TransactionArray) => {
    if (!valueToFilterBy) return none;

    const foundTransactions = filter(valueToFilterBy, transactions);

    return foundTransactions.length ? some(foundTransactions) : none;
  };
}

export const filterTransactionsByAsset = createTransactionFilter(
  (assetAddress, transactions) => transactions
    .filter(({ statements }) => statements
      ?.find?.(({ assetAddr }) => assetAddr === assetAddress)),
);

export function filterTransactionsByEventName(eventName: string, transactions: TransactionArray) {
  if (!eventName) return none;

  const foundTransactions = transactions
    .filter(({ receipt }) => receipt?.logs
      ?.find?.(({ articulatedLog }) => articulatedLog?.name === eventName));

  return foundTransactions.length ? some(foundTransactions) : none;
}

export function filterTransactionsByFunctionName(functionName: string, transactions: TransactionArray) {
  if (!functionName) return none;

  const foundTransactions = transactions
    .filter(({ articulatedTx }) => articulatedTx?.name === functionName);

  return foundTransactions.length ? some(foundTransactions) : none;
}
