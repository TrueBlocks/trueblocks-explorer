import React from 'react';

import { Loading } from '@components/Loading';
import { useSdk } from '@hooks/useSdk';
import { isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';

type RawDataTabProps = {
  makeRequest: Parameters<typeof useSdk>[0],
  name: string,
}

// RawDataTab can be used to simply output the raw data into the view,
// mostly for work-in-progress views
export function RawDataTab({ makeRequest, name }: RawDataTabProps) {
  const dataCall = useSdk(makeRequest);

  if (isFailedCall(dataCall)) {
    createErrorNotification({
      description: `Could not fetch ${name}`,
    });
  }

  const theData = isSuccessfulCall(dataCall) ? dataCall.data : [];

  return (
    <Loading loading={dataCall.loading}>
      <pre>{JSON.stringify(theData, null, 2)}</pre>
    </Loading>
  );
}
