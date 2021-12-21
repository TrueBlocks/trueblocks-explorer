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

  const whenNetworkError = useMemo(() => <NetworkError resourceName={props.resourceName} />, [props.resourceName]);
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
