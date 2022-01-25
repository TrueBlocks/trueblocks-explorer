import React from 'react';

import { getTraces } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

export const Traces = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getTraces({
      chain: `${process.env.CHAIN}`,
      // TODO(tjayrush): hard coded data
      transactions: ['12001001.0'],
      articulate: true,
    })}
  />
);
