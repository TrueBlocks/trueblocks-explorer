import React from 'react';

import { getReceipts } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

export const Receipts = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getReceipts({
      chain: `${process.env.CHAIN}`,
      // TODO(tjayrush): hard coded data
      transactions: ['12001001.1'],
      articulate: true,
    })}
  />
);
