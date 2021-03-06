import { Loading } from '@components/Loading';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import React, { useCallback } from 'react';

export const Traces = () => {
  const [data, loading] = useCommand('traces', { transactions: 'latest', articulate: true });
  const getData = useCallback((response) => (response.status === 'fail' ? [] : response.data), []);

  const theItem = getData(data);
  if (data.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch traces',
    });
  }

  return (
    <Loading loading={loading}>
      <pre>{JSON.stringify(theItem, null, 2)}</pre>
    </Loading>
  );
};
