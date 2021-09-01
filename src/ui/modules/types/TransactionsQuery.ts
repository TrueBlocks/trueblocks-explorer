import { Result, toSuccessfulData, useCommand } from '@hooks/useCommand';

export type TransactionsQueryState = {
  result: ReturnType<typeof useCommand>[0],
  loading: ReturnType<typeof useCommand>[1]
};

export function createTransactionsQuery(
  { queryData = [], meta = {} }: { queryData: Result['data'], meta: Result['meta'] },
) {
  return {
    result: toSuccessfulData({
      data: queryData,
      meta,
    }),
    loading: false,
  };
}

export function createEmptyTransactionsQuery() {
  return createTransactionsQuery({
    queryData: [],
    meta: {},
  });
}
