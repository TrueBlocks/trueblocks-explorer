import React from 'react';

import {
  Transaction,
} from '@sdk';

import { useGlobalState2 } from '../../../../../State';

export const ExtraDisplay = ({ record }: { record: Transaction}) => {
  const { chain } = useGlobalState2();
  // TODO: BOGUS - per chain data
  if (chain === 'gnosis') {
    return (
      <a target='_blank' href={`https://blockscout.com/xdai/mainnet/tx/${record.hash}`} rel='noreferrer'>
        ES
      </a>
    );
  }
  return (
    <a target='_blank' href={`http://etherscan.io/tx/${record.hash}`} rel='noreferrer'>
      ES
    </a>
  );
};
