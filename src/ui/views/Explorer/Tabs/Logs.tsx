import { Loading } from '@components/Loading';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import React from 'react';

export const Logs = () => {
  // TODO(tjayrush): hard coded data
  const { theData, loading, status } = useFetchData('logs', { transactions: '12001001.1', articulate: true });

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch logs',
    });
  }

  return (
    <Loading loading={loading}>
      <pre>{JSON.stringify(theData, null, 2)}</pre>
    </Loading>
  );
};
