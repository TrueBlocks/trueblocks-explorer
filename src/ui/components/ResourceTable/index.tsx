import React, { useMemo } from 'react';

import { Empty } from 'antd';

import { NetworkError } from '@components/NetworkError';
import { BaseTable } from '@components/Table';
import {
  CallStatus, isFailedCall, isPendingCall, isSuccessfulCall,
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

    return null;
  }, [onDataFnToUse, props]);

  const whenNetworkError = useMemo(() => <NetworkError resourceName={props.resourceName} />, [props.resourceName]);
  const whenNoData = useMemo(() => <Empty />, []);
  const whenData = useMemo(() => (
    <BaseTable
      dataSource={dataSource as Resource}
      columns={props.columns}
      loading={props.call.loading}
    />
  ), [dataSource, props.call.loading, props.columns]);

  if (isFailedCall(props.call)) return whenNetworkError;
  if (isPendingCall(props.call) || dataSource) return whenData;

  return whenNoData;
}
