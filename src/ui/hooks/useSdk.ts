import { DependencyList, useEffect, useState } from 'react';

import { AnyResponse } from '@sdk';

import { CallStatus, createPendingCall } from '@modules/api/call_status';

export function useSdk<ResponseData>(
  makeRequest: () => Promise<AnyResponse<ResponseData>>,
  predicate = () => true,
  dependencies: DependencyList = [],
) {
  const [responseData, setData] = useState<CallStatus<ResponseData>>(createPendingCall<ResponseData>());
  const updateCallStatus = (properties: Partial<CallStatus<ResponseData>>) => setData((currentStatus: CallStatus<ResponseData>) => ({
    ...currentStatus,
    ...properties,
  } as CallStatus<ResponseData>));

  useEffect(() => {
    let cancelled = false;

    if (!predicate()) return () => undefined;

    (async () => {
      updateCallStatus({ loading: true, initiated: true });

      const response = await makeRequest();

      if (cancelled) return;

      if ('errors' in response) {
        setData({
          type: 'error',
          loading: false,
          initiated: true,
          ...response,
        });
        return;
      }

      setData({
        type: 'success',
        loading: false,
        initiated: true,
        ...response,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return responseData;
}
