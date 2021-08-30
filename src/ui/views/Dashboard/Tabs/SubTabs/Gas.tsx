import React from 'react';

import { Transaction, TransactionArray } from '@modules/types';

export const Gas = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;
  const usesGas = theData.filter((tx: Transaction, index: number) => {
    if (!tx.statements) return false;
    const stmts = tx.statements.filter((st) =>
      // console.log('---------', index, '---------', index < 3, '---------');
      st.gasCostOut !== '');
    return stmts.length > 0;
  });

  let stmts = usesGas.map((tx: Transaction) => tx.statements.map((st) => ({
    blockNumber: tx.blockNumber,
    transactionIndex: tx.transactionIndex,
    hash: tx.hash,
    from: tx.from,
    fromName: tx.fromName.name,
    to: tx.to,
    toName: tx.toName.name,
    isError: tx.isError,
    asset: st.assetSymbol,
    gasCostOut: st.gasCostOut,
  })));

  stmts = stmts.filter((st: any) => st.gasCostOut !== '');

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <pre>
        len:
        {usesGas.length}
      </pre>
      <pre>{JSON.stringify(stmts, null, 2)}</pre>
    </div>
  );
};
