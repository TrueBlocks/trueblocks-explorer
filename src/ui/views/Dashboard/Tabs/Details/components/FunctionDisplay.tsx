import React from 'react';

import { Function } from '@sdk';

//-----------------------------------------------------------------
export const FunctionDisplay = ({ func, bytes }: { func: Function, bytes: string }) => {
  if (!bytes) return <></>;

  const head = bytes.slice(0, 10);
  const input = bytes.replace(head, '');

  const json = <pre style={{ overflowX: 'hidden' }}>{JSON.stringify(func, null, 2)}</pre>;
  const b = (
    <pre>
      <div>{head}</div>
      {input?.match(/.{1,64}/g)?.map((s, index) => (
        <div key={`${s + index}`}>
          0x
          {s}
        </div>
      ))}
    </pre>
  );

  return (
    <ArticulatedBytes display={json} bytes={b} />
  );
};

//-----------------------------------------------------------------
const ArticulatedBytes = ({ display, bytes }: { display: any, bytes: any }) => {
  const art = (
    <>
      <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
        Articulated:
      </div>
      {display}
      <br />
    </>
  );

  return (
    <div>
      {art}
      <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
        Bytes:
      </div>
      {bytes}
      <br />
    </div>
  );
};
