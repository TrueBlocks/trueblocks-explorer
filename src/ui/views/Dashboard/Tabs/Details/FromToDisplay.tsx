import React from 'react';

import {
  Transaction,
} from '@modules/types';

import { Pills } from './Pills';
import { RenderedAddress } from './RenderedAddress';

export const FromToDisplay = ({ record }: { record: Transaction}) => {
  if (!record) return <div />;
  return (
    <>
      <pre>
        <RenderedAddress record={record} which='from' />
        <RenderedAddress record={record} which='to' />
        <div style={{
          margin: '0px', padding: '0px', display: 'grid', gridTemplateColumns: '1fr 10fr',
        }}
        >
          <Pills record={record} />
          <div />
        </div>
      </pre>
    </>
  );
};
