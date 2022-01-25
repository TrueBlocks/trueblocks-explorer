import React from 'react';

import { getTransactions } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

export const Transactions = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getTransactions({
      chain: `${process.env.CHAIN}`,
      // TODO(tjayrush): hard coded data
      transactions: ['12001001.0'],
      cache: true,
      articulate: true,
    })}
  />
);
