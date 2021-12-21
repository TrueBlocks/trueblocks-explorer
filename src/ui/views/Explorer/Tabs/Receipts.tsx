import React from 'react';

import { getReceipts } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

// TODO(tjayrush): hard coded data
export const Receipts = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getReceipts({ transactions: ['12001001.1'], articulate: true })}
  />
);
