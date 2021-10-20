import React from 'react';

import { BaseTable } from '@components/Table';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import { Function } from '@modules/types';

import { abiSignature } from '../Signatures';

export const EventSignatures = () => {
  const filterFunc = (item: Function) => item.type !== 'event';
  const { theData, loading, status } = useFetchData('abis', { known: true, source: true, verbose: true }, filterFunc);
  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch function signature data',
    });
  }
  return <BaseTable dataSource={theData} columns={abiSignature} loading={loading} />;
};
