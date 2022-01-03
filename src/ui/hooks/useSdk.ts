import { DependencyList, useEffect, useState } from 'react';

import { AnyResponse, ErrorResponse } from '@sdk';

import { CallStatus, createPendingCall } from '@modules/api/call_status';

// useSdk makes an API request by calling `makeRequest` function.
// `predicate` can be used to make the request only for certain conditions.
export function useSdk<ResponseData>(
  makeRequest: () => Promise<AnyResponse<ResponseData>>,
  predicate = () => true,
  dependencies: DependencyList = [],
) {
  // we will store the response here
  const [responseData, setData] = useState<CallStatus<ResponseData>>(createPendingCall<ResponseData>());
  // because we use CallStatus to carry not only the returned data or error, but also UI-specific
  // state information(e.g.if the request is pending), we will need a helper to make updating the
  // state information easier

  useEffect(() => {
    let cancelled = false;

    // Don't do the request if we shouldn't
    if (!predicate()) return () => undefined;

    (async () => {
      // The request has been fired and is pending
      setData({
        type: 'pending',
        loading: true,
        initiated: true,
      });

      const response = await (async () => {
        try {
          return await makeRequest();
        } catch (e) {
          // If we are here, a NetworkError has occured. Usually it means that
          // the server or user's connection is down
          return {
            status: 0,
            errors: ['Network error'],
          } as ErrorResponse;
        }
      })();

      if (cancelled) return;

      if ('errors' in response) {
        // We got error, so we need to store this information
        setData({
          type: 'error',
          loading: false,
          initiated: true,
          ...response,
        });
        return;
      }

      // Otherwise it is a success
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
