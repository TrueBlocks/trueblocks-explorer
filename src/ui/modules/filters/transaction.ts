import { none, some } from 'fp-ts/lib/Option';

import { TransactionArray } from '@modules/types';

export function filterTransactionsByEventName(eventName: string) {
  return (transactions: TransactionArray) => {
    if (!eventName) return none;

    const foundTransactions = transactions
      .filter(({ receipt }) => receipt?.logs
        ?.find?.(({ articulatedLog }) => articulatedLog?.name === eventName));

    return foundTransactions.length ? some(foundTransactions) : none;
  };
}
