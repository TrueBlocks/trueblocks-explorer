import { option as Option } from 'fp-ts';

import { FixedTransaction } from '@modules/type_fixes';

import sampleTransactions from './sample_transactions.json';
import * as TransactionFilters from './transaction';

// FIXME: typecast
const typedSampleTransactions: FixedTransaction[] = sampleTransactions as unknown as FixedTransaction[];
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
    )('deadbeaf', [{ blockHash: 'deadbeaf' } as FixedTransaction]);
    expect(Option.isSome(result)).toBe(true);
  });
});

describe('filterTransactionsByAsset', () => {
  it('finds correct matches', () => {
    const assetAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

    const result = getResults(
      TransactionFilters.filterTransactionsByAsset(assetAddress, typedSampleTransactions),
    ) as FixedTransaction[];

    const expected = typedSampleTransactions
      .filter(
        ({ statements }) => statements
          ?.find?.(({ assetAddr }) => assetAddr === assetAddress),
      );

    expect(result).toEqual(expected);
  });
});

describe('filterTransactionsByEventName', () => {
  it('finds correct matches', () => {
    const eventName = 'Approval';

    const result = getResults(
      TransactionFilters.filterTransactionsByEventName(eventName, typedSampleTransactions),
    ) as FixedTransaction[];

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
    ) as FixedTransaction[];

    const expected = typedSampleTransactions
      .filter(({ articulatedTx }) => articulatedTx?.name === eventName);

    expect(result).toEqual(expected);
  });
});

describe('applyFilters', () => {
  const USDC = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  it('applies single filter', () => {
    const result = TransactionFilters.applyFilters(typedSampleTransactions, {
      assetAddress: USDC,
    });

    expect(result[0].hash).toBe('0x18b427cc805527fb9a16900d722a950a21ea53ed38b4250ed054105158992ceb');
  });

  it('applies multiple filters', () => {
    const result = TransactionFilters.applyFilters(typedSampleTransactions, {
      assetAddress: USDC,
      functionName: 'donate',
    });

    expect(result[0].hash).toBe('0x18b427cc805527fb9a16900d722a950a21ea53ed38b4250ed054105158992ceb');
  });
});
