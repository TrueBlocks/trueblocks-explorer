import React from 'react';

import { TransactionArray } from '@modules/types';

export const Neighbors = ({
  theData,
  theMeta,
  loading,
}: {
  theData: TransactionArray;
  theMeta: any;
  loading: boolean;
}) => {
  const neighbors: any = [];
  theData.map((item) => {
    neighbors.push({
      key: `${item.from}-from`,
      count: 1,
    });
    neighbors.push({
      key: `${item.to}-to`,
      count: 1,
    });
  });

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <div>Neighbors</div>
      <pre>{JSON.stringify(neighbors, null, 2)}</pre>
    </div>
  );
};
