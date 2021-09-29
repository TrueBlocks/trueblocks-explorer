import React from 'react';

import { Loading } from '@components/Loading';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';

export const Traces = () => {
  // TODO(tjayrush): hard coded data
  const { theData, loading, status } = useFetchData('traces', { transactions: '12001001.0', articulate: '' });

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch traces',
    });
  }

  return (
    <Loading loading={loading}>
      <pre>{JSON.stringify(theData, null, 2)}</pre>
    </Loading>
  );
};
