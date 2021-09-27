import { option as Option } from 'fp-ts';

import { Transaction, TransactionArray } from '@modules/types';

import sampleTransactions from './sample_transactions.json';
import * as TransactionFilters from './transaction';

const typedSampleTransactions: TransactionArray = sampleTransactions;
const getResults = Option.fold(
  () => [],
  (someTransactions) => someTransactions,
);

describe('createTransactionFilter', () => {
  it('returns Option.none when no match', () => {
    const result = TransactionFilters.createTransactionFilter(() => [])('', []);
    expect(Option.isNone(result)).toBe(true);
  });

  it('returns Option.some when match', () => {
    const result = TransactionFilters.createTransactionFilter(
      (value, transactions) => transactions.filter((item) => item.blockHash === value),
    )('deadbeaf', [{ blockHash: 'deadbeaf' } as Transaction]);
    expect(Option.isSome(result)).toBe(true);
  });
});

describe('filterTransactionsByAsset', () => {
  it('finds correct matches', () => {
    const assetAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

    const result = getResults(
      TransactionFilters.filterTransactionsByAsset(assetAddress, typedSampleTransactions),
    ) as TransactionArray;

    const expected = typedSampleTransactions
      .filter(
        ({ receipt }) => receipt?.logs
          ?.find?.(({ articulatedLog }) => articulatedLog?.inputs.token === assetAddress),
      );

    expect(result).toEqual(expected);
  });
});

describe('filterTransactionsByEventName', () => {
  it('finds correct matches', () => {
    const eventName = 'Approval';

    const result = getResults(
      TransactionFilters.filterTransactionsByEventName(eventName, typedSampleTransactions),
    ) as TransactionArray;

    const expected = typedSampleTransactions
      .filter(({ receipt }) => receipt?.logs?.find?.(({ articulatedLog }) => articulatedLog?.name === eventName));

    expect(result).toEqual(expected);
  });
});

describe('filterTransactionsByFunctionName', () => {
  it('finds correct matches', () => {
    const eventName = 'setAddr';

    const result = getResults(
      TransactionFilters.filterTransactionsByFunctionName(eventName, typedSampleTransactions),
    ) as TransactionArray;

    const expected = typedSampleTransactions
      .filter(({ articulatedTx }) => articulatedTx?.name === eventName);

    expect(result).toEqual(expected);
  });
});
