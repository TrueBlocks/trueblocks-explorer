import React from 'react';

import { getLogs } from '@sdk';

import { Loading } from '@components/Loading';
import { useSdk } from '@hooks/useSdk';
import { isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';

export const Logs = () => {
  // TODO(tjayrush): hard coded data
  const logsCall = useSdk(() => getLogs({ transactions: ['12001001.1'], articulate: true }));

  if (isFailedCall(logsCall)) {
    createErrorNotification({
      description: 'Could not fetch logs',
    });
  }

  const theData = isSuccessfulCall(logsCall) ? logsCall.data : [];

  return (
    <Loading loading={logsCall.loading}>
      <pre>{JSON.stringify(theData, null, 2)}</pre>
    </Loading>
  );
};
