import React from 'react';

import {
  Transaction,
} from '@modules/types';

export const ExtraDisplay = ({ record }: { record: Transaction}) => (
  <a target='_blank' href={`http://etherscan.io/tx/${record.hash}`} rel='noreferrer'>
    ES
  </a>
);
