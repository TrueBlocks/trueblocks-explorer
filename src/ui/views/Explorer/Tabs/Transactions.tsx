import React from 'react';

import { getTransactions } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

// TODO(tjayrush): hard coded data
export const Transactions = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getTransactions({
      transactions: ['12001001.0'],
      cache: true,
      articulate: true,
    })}
  />
);
