import React from 'react';

import { Transaction, TransactionArray } from '@modules/types';

export const Gas = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;
  const usesGas = theData.filter((tx: Transaction) => {
    if (!tx.statements) return false;
    const stmts = tx.statements.filter((st) => st.gasCostOut);
    return stmts.length > 0;
  });

  const stmts = usesGas.map((tx: Transaction) => tx.statements.map((st) => ({
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
