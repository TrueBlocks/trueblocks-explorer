import React from 'react';

import { FixedTransaction } from '@modules/type_fixes';

export const Neighbors = ({
  theData,
}: {
  theData: FixedTransaction[],
}) => {
  const neighbors = theData.flatMap((item) => [
    {
      key: `${item.from}-from`,
      count: 1,
    },
    {
      key: `${item.to}-to`,
      count: 1,
    },
  ]);

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <div>Neighbors</div>
      <pre>{JSON.stringify(neighbors, null, 2)}</pre>
    </div>
  );
};
