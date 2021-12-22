import React from 'react';

import { TransactionModel } from '@modules/type_fixes';

export const Gas = ({ theData }: { theData: TransactionModel[] }) => {
  if (!theData) return <></>;
  const usesGas = theData.filter((tx: TransactionModel) => {
    if (!tx.statements) return false;
    const stmts = tx.statements.filter((st) => st.gasCostOut);
    return stmts.length > 0;
  });

  // TODO(data): fix this if you can
  const stmts = usesGas.map((tx: TransactionModel) => (tx.statements || []).map((st) => ({
    blockNumber: tx.blockNumber,
    transactionIndex: tx.transactionIndex,
    hash: tx.hash,
    from: tx.from,
    fromName: tx.fromName?.name,
    to: tx.to,
    toName: tx.toName?.name,
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
