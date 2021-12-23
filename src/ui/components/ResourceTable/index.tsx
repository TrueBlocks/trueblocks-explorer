import React, { useMemo } from 'react';

import { NetworkError } from '@components/NetworkError';
import { BaseTable } from '@components/Table';
import {
  CallStatus, isFailedCall, isSuccessfulCall,
} from '@modules/api/call_status';

type ResourceTableProps<Resource> =
  & {
    call: CallStatus<Resource>,
    onData?: (items: Resource) => Resource,
  }
  & Parameters<typeof NetworkError>[0]
  & Omit<Parameters<typeof BaseTable>[0], 'loading' | 'dataSource'>

// ResourceTable encapsulates common logic to deal with requests: failed state
// and successful state, where we show the data (or inform about the lack of data
// to show).
// `onData` callback can be used to transform the data after it has been fetched
// (for example, to filter it)
export function ResourceTable<Resource>(props: ResourceTableProps<Resource>) {
  const identity = (anything: Resource) => anything;
  const onDataFnToUse = props.onData || identity;
  const dataSource = useMemo(() => {
    const { call } = props;

    if (isSuccessfulCall(call)) {
      return onDataFnToUse(call.data);
    }

    return [];
  }, [onDataFnToUse, props]);

  // we will display this if there is an error...
  const whenNetworkError = useMemo(() => <NetworkError resourceName={props.resourceName} />, [props.resourceName]);
  // ... and this if we fetch the data successfully
  const whenData = useMemo(() => (
    <BaseTable
      dataSource={dataSource as Resource}
      columns={props.columns}
      loading={props.call.loading}
    />
  ), [dataSource, props.call.loading, props.columns]);

  if (isFailedCall(props.call)) return whenNetworkError;

  return whenData;
}
