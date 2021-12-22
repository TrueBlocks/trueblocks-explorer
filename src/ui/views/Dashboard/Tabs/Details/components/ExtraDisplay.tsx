import React from 'react';

import {
  Transaction,
} from '@sdk';

export const ExtraDisplay = ({ record }: { record: Transaction}) => (
  <a target='_blank' href={`http://etherscan.io/tx/${record.hash}`} rel='noreferrer'>
    ES
  </a>
);
