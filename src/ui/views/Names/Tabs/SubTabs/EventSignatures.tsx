import React from 'react';

import { Function } from '@sdk';

import { GenericSubTab } from './GenericSubTab';

export const EventSignatures = () => {
  const filterFunc = (item: Function) => item.type !== 'event';

  return (
    <GenericSubTab
      resourceName='event signature data'
      filterFunc={filterFunc}
    />
  );
};
