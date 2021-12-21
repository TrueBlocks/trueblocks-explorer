import React from 'react';

import { getLogs } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

// TODO(tjayrush): hard coded data
export const Logs = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getLogs({ transactions: ['12001001.1'], articulate: true })}
  />
);
