import {
  address, getNames, ListStats,
} from '@sdk';

import {
  getChartItems, GetChartItemsOptions, getEventsItems, getFunctionsItems, getGas, getNeighbors, getPage, getSlice,
} from './worker/transactions';

export type DataStoreMessage =
  | LoadTransactions
  | CancelLoadTransactions
  | GetTransactionsTotal
  | GetPage
  | GetSlice
  | GetChartItems
  | GetEventsItems
  | GetFunctionsItems
  | GetGas
  | GetNeighbors
  | LoadNames;

// TODO move it or change file name
export type DataStoreResult<ResultType> = {
  call: DataStoreMessage['call'],
  result: ResultType,
};

export type LoadTransactions = {
  call: 'loadTransactions',
  args: {
    address: address,
  }
};

export type LoadTransactionsStatus = {
  new: number,
  total: number
}

export type CancelLoadTransactions = {
  call: 'cancelLoadTransactions',
  args: {
    address: address,
  },
};

export type GetTransactionsTotal = {
  call: 'getTransactionsTotal',
  args: {
    chain: string,
    addresses: address[],
  }
}

export type GetTransactionsTotalResult = ListStats[];

export type GetPage = {
  call: 'getPage',
  args: {
    address: address,
    page: number,
    pageSize: number,
  },
};

export type GetPageResult = ReturnType<typeof getPage>;

export type GetSlice = {
  call: 'getSlice',
  args: {
    address: address,
    start: number,
    end: number,
  },
};

export type GetSliceResult = ReturnType<typeof getSlice>;

export type GetChartItems = {
  call: 'getChartItems',
  args: {
    address: address,
  } & GetChartItemsOptions,
};

export type GetChartItemsResult = ReturnType<typeof getChartItems>;

export type GetEventsItems = {
  call: 'getEventsItems',
  args: {
    address: address,
  },
};

export type GetEventsItemsResult = ReturnType<typeof getEventsItems>;

export type GetFunctionsItems = {
  call: 'getFunctionsItems',
  args: {
    address: address,
  },
};

export type GetFunctionsItemsResult = ReturnType<typeof getFunctionsItems>;

export type GetGas = {
  call: 'getGas',
  args: {
    address: address,
  },
};

export type GetGasResult = ReturnType<typeof getGas>;

export type GetNeighbors = {
  call: 'getNeighbors',
  args: {
    address: address,
  },
};

export type GetNeighborsResult = ReturnType<typeof getNeighbors>;

export type LoadNames = {
  call: 'loadNames',
  args: Parameters<typeof getNames>[0],
}

export type LoadNamesResult = { total: number };
