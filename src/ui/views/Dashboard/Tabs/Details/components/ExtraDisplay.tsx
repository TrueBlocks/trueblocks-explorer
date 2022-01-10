import React from 'react';

import {
  Transaction,
} from '@sdk';

export const ExtraDisplay = ({ record }: { record: Transaction}) => (
  <a target='_blank' href={`https://blockscout.com/xdai/mainnet/tx/${record.hash}`} rel='noreferrer'>
    ES
  </a>
);
