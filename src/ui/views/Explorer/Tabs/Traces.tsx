import React from 'react';

import { getTraces } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

// TODO(tjayrush): hard coded data
export const Traces = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getTraces({ transactions: ['12001001.0'], articulate: true })}
  />
);
