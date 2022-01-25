import React from 'react';

import { getLogs } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

export const Logs = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getLogs({
      chain: `${process.env.CHAIN}`,
      // TODO(tjayrush): hard coded data
      transactions: ['12001001.1'],
      articulate: true,
    })}
  />
);
