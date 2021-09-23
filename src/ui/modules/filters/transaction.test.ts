import { option as Option } from 'fp-ts';

import { TransactionArray } from '@modules/types';

import sampleTransactions from './sample_transactions.json';
import * as TransactionFilters from './transaction';

const typedSampleTransactions: TransactionArray = sampleTransactions;

describe('filterTransactionsByEventName', () => {
  it('returns Option<never> when no match', () => {
    const result = TransactionFilters.filterTransactionsByEventName('nonexistent')([]);

    expect(result._tag).toBe('None'); // eslint-disable-line no-underscore-dangle
  });

  it('finds correct matches', () => {
    const getResults = Option.fold(
      () => [],
      (someTransactions) => someTransactions,
    );
    const filterByApproval = TransactionFilters.filterTransactionsByEventName('Approval');

    const result = getResults(filterByApproval(typedSampleTransactions)) as TransactionArray;

    const expected = typedSampleTransactions
      .filter(({ receipt }) => receipt?.logs?.find?.(({ articulatedLog }) => articulatedLog?.name === 'Approval'));

    expect(result).toEqual(expected);
  });
});
