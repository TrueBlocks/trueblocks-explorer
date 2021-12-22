import { Eq } from 'fp-ts/lib/Eq';
import { none, some } from 'fp-ts/lib/Option';

import { FixedTransaction } from '@modules/type_fixes';

export const TransactionEquality: Eq<FixedTransaction> = {
  equals({ hash: firstHash }: FixedTransaction, { hash: secondHash }: FixedTransaction) {
    return firstHash === secondHash;
  },
};

export function createTransactionFilter(
  filter: (valueToFilterBy: string, transactions: FixedTransaction[]) => FixedTransaction[],
) {
  return (valueToFilterBy: string, transactions: FixedTransaction[]) => {
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

export function hasTransactionAsset({ statements }: FixedTransaction, assetAddress: string) {
  if (!assetAddress) return false;

  return Boolean(
    statements
      ?.find?.(({ assetAddr }) => assetAddr === assetAddress),
  );
}

export function hasTransactionEvent({ receipt }: FixedTransaction, eventName: string) {
  if (!eventName) return false;

  return Boolean(
    receipt?.logs
      ?.find?.(({ articulatedLog }) => articulatedLog?.name === eventName),
  );
}

export function hasTransactionFunction({ articulatedTx }: FixedTransaction, functionName: string) {
  if (!functionName) return false;

  return articulatedTx?.name === functionName;
}

export function applyFilters(
  transactions: FixedTransaction[],
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
