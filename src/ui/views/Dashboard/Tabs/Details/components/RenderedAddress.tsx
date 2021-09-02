import React from 'react';

import {
  Transaction,
} from '@modules/types';

import { useGlobalNames } from '../../../../../State';

export const RenderedAddress = ({ record, which }: {record: Transaction, which: string}) => {
  const { namesMap } = useGlobalNames();

  let address = which === 'from' ? record.from : record.to;
  const isCreation = address === '0x0';
  if (isCreation) address = record.receipt.contractAddress; // may be empty
  const isSpecial = address === '0xPrefund' || address === '0xBlockReward' || address === '0xUncleReward';

  const acctFor = record.extraData;
  const isCurrent = address === acctFor;

  // TODO: Comment by @dszlachta
  // TODO: We don't need these tests because we have this data (but do we?)
  let name = namesMap && namesMap.get(address) && namesMap.get(address)?.name;
  if (!isSpecial && !isCurrent && !name) {
    return <div style={{ color: 'grey' }}>{address}</div>;
  }

  let style = isCurrent ? { color: 'blue' } : { color: 'green' };
  if (isSpecial) {
    name = '';
    style = { color: 'green' };
  }

  const decorated = name === '' || name === undefined
    ? address
    : `[${address?.substr(0, 6)}...${address?.substr(address.length - 4, address.length)}] `;
  const addr = (isCreation ? '0x0 --> ' : '') + decorated;

  return (
    <div style={style}>
      {addr}
      {name}
    </div>
  );
};
