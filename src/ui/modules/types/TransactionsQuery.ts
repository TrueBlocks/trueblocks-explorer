export type TransactionsQueryState = {
  result: {},
  loading: boolean,
};

export function createTransactionsQuery(
  { queryData = [], meta = {} }: { queryData: {}, meta: {} },
) {
  return {
    result: {
      data: queryData,
      meta,
    },
    loading: false,
  };
}

export function createEmptyTransactionsQuery() {
  return createTransactionsQuery({
    queryData: [],
    meta: {},
  });
}
