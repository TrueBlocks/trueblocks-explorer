import { Eq } from 'fp-ts/lib/Eq';
import { none, some } from 'fp-ts/lib/Option';

import { Transaction, TransactionArray } from '@modules/types';

export const TransactionEquality: Eq<Transaction> = {
  equals({ hash: firstHash }: Transaction, { hash: secondHash }: Transaction) {
    return firstHash === secondHash;
  },
};

export function createTransactionFilter(
  filter: (valueToFilterBy: string, transactions: TransactionArray) => TransactionArray,
) {
  return (valueToFilterBy: string, transactions: TransactionArray) => {
    if (!valueToFilterBy) return none;

    const foundTransactions = filter(valueToFilterBy, transactions);

    return foundTransactions.length ? some(foundTransactions) : none;
  };
}

export const filterTransactionsByAsset = createTransactionFilter(
  (assetAddress, transactions) => transactions
    .filter((transaction) => hasTransactionAsset(transaction, assetAddress)),
);

export const filterTransactionsByEventName = createTransactionFilter(
  (eventName, transactions) => transactions
    .filter((transaction) => hasTransactionEvent(transaction, eventName)),
);

export const filterTransactionsByFunctionName = createTransactionFilter(
  (functionName, transactions) => transactions
    .filter((transaction) => hasTransactionFunction(transaction, functionName)),
);

export function hasTransactionAsset({ statements }: Transaction, assetAddress: string) {
  if (!assetAddress) return false;

  return Boolean(
    statements
      ?.find?.(({ assetAddr }) => assetAddr === assetAddress),
  );
}

export function hasTransactionEvent({ receipt }: Transaction, eventName: string) {
  if (!eventName) return false;

  return Boolean(
    receipt?.logs
      ?.find?.(({ articulatedLog }) => articulatedLog?.name === eventName),
  );
}

export function hasTransactionFunction({ articulatedTx }: Transaction, functionName: string) {
  if (!functionName) return false;

  return articulatedTx?.name === functionName;
}

export function applyFilters(
  transactions: TransactionArray,
  { assetAddress, eventName, functionName }: { assetAddress?: string, eventName?: string, functionName?: string },
) {
  return transactions.filter((transaction) => {
    const results = [];

    if (assetAddress) {
      results.push(hasTransactionAsset(transaction, assetAddress));
    }

    if (eventName) {
      results.push(hasTransactionEvent(transaction, eventName));
    }

    if (functionName) {
      results.push(hasTransactionFunction(transaction, functionName));
    }

    return results.every(Boolean);
  });
}
