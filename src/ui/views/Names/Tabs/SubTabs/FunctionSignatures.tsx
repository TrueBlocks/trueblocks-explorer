import React from 'react';

import { Function } from '@sdk';

import { GenericSubTab } from './GenericSubTab';

export const FunctionSignatures = () => {
  const filterFunc = (item: Function) => item.type !== 'function';

  return (
    <GenericSubTab
      resourceName='function signature data'
      filterFunc={filterFunc}
    />
  );
};
