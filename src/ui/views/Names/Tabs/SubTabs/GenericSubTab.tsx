import React from 'react';

import { Function, getAbis } from '@sdk';

import { ResourceTable } from '@components/ResourceTable';
import { useSdk } from '@hooks/useSdk';
import { CallStatus } from '@modules/api/call_status';

import { abiSignature } from '../Signatures';

type GenericSubTabProps = {
  filterFunc: (item: Function) => boolean,
  resourceName: string,
};

export function GenericSubTab({ filterFunc, resourceName }: GenericSubTabProps) {
  // FIXME: type casts (wrong function parameters in OpenAPI.yaml, wrong return type
  const dataCall = useSdk(() => getAbis({
    known: true,
    source: true,
    logLevel: 2,
  } as unknown as Parameters<typeof getAbis>[0])) as CallStatus<Function[]>;

  return (
    <ResourceTable
      resourceName={resourceName}
      call={dataCall}
      onData={(items) => items.filter(filterFunc)}
      columns={abiSignature}
    />
  );
}
