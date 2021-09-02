import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import {
  priceReconciliation, Reconciliation,
} from '@modules/types';

import { useGlobalState } from '../../../../../State';
import { ReconIcon } from './ReconIcon';

export const Statement = ({ statement }: { statement: Reconciliation }) => {
  const style = useStyles();
  const k = statement.assetAddr;
  const { denom } = useGlobalState();
  const [sym, setSym] = useState(statement.assetSymbol);
  useEffect(() => {
    if (denom === 'dollars') {
      setSym(`${statement.assetSymbol?.slice(0, 5)} ${(statement.priceSource === 'not-priced' ? ' -' : ' $')}`);
    } else {
      setSym(statement.assetSymbol?.slice(0, 5));
    }
  }, [denom, statement.assetSymbol, statement.priceSource]);

  const pricedRecon = priceReconciliation(statement, denom);
  return (
    <tr className={style.row} key={`${k}-row`}>
      <td key={`${k}-1`} className={style.col} style={{ width: '12%' }}>
        {sym}
      </td>
      <td key={`${k}-2`} className={style.col} style={{ width: '17%' }}>
        {showValue(pricedRecon.begBal.toString(), true)}
      </td>
      <td key={`${k}-3`} className={style.col} style={{ width: '17%' }}>
        {showValue(pricedRecon.totalIn.toString())}
      </td>
      <td key={`${k}-4`} className={style.col} style={{ width: '17%' }}>
        {showValue(pricedRecon.totalOutLessGas.toString())}
      </td>
      <td key={`${k}-5`} className={style.col} style={{ width: '17%' }}>
        {showValue(pricedRecon.gasCostOut.toString(), false, true)}
      </td>
      <td key={`${k}-6`} className={style.col} style={{ width: '17%' }}>
        {showValue(pricedRecon.endBal.toString(), true)}
      </td>
      <td key={`${k}-7`} className={style.col} style={{ width: '4%' }}>
        <ReconIcon statement={pricedRecon} />
      </td>
    </tr>
  );
};

const showValue = (val: string, showZeros: boolean = false, isGas: boolean = false) => {
  if (showZeros && !val) { return clip((Number('0.000000')).toFixed(2).toString(), isGas); }
  return clip((Number(val)).toFixed(2).toString(), isGas);
};

const clip = (num: string, isGas?: boolean) => {
  if (!num) return <></>;
  const parts = num.split('.');
  if (parts.length === 0 || parts[0] === '') {
    return (
      <div style={{ color: 'lightgrey' }}>
        0.000000
        {isGas ? 'g' : ''}
      </div>
    );
  }
  if (parts.length === 1) {
    return (
      parts[0]
      + (
        <div>
          .000000
          {isGas ? 'g' : ''}
        </div>
      )
    );
  }
  return (
    <div>
      {`${parts[0]}.${parts[1].substr(0, 6)}`}
      {isGas ? 'g' : ''}
    </div>
  );
};

const useStyles = createUseStyles({
  table: {},
  row: {},
  col: {
    textAlign: 'right',
    backgroundColor: '#fff7e6',
  },
});
