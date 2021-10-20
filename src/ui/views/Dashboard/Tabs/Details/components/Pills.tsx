import React from 'react';
import { createUseStyles } from 'react-jss';

import {
  Transaction,
} from '@modules/types';

export const Pills = ({ record } : {record: Transaction}) => {
  const style = useStyles();
  const isErr = record.isError;
  const isInt = record.to !== record.extraData && record.from !== record.extraData;
  const isCon = record.to === '0x0';
  const is20 = record.toName?.is_erc20 || (record?.statements?.length || 0) > 1;
  const is721 = record.toName?.is_erc721;
  const Pill = (name: string, tag: string, show: boolean) => (
    show
      ? <div className={`${style.tag} ${tag}`}>{name}</div>
      : <></>
  );
  // TODO(data): isErr and erc20 should be booleans from the back end
  return (
    <div style={{ display: 'flex' }}>
      {Pill('int', style.intTag, isInt)}
      {Pill('err', style.errTag, Boolean(isErr))}
      {Pill('con', style.conTag, isCon)}
      {Pill('erc20', style.tok20Tag, is20 && !is721)}
      {Pill('erc721', style.tok721Tag, Boolean(is721))}
    </div>
  );
};

const useStyles = createUseStyles({
  tag: {
    padding: '0px 2px 0px 2px',
    margin: '0px 0px 0px 2px',
    border: '1px solid red',
    borderRadius: '4px',
    fontSize: '9pt',
    textAlign: 'center',
  },
  errTag: {
    backgroundColor: 'lightcoral',
    borderColor: 'lightcoral',
    color: 'yellow',
  },
  intTag: {
    backgroundColor: 'slateblue',
    borderColor: 'slateblue',
    color: 'white',
  },
  conTag: {
    backgroundColor: 'cornsilk',
    borderColor: 'orange',
    color: 'black',
  },
  tok20Tag: {
    backgroundColor: 'darkblue',
    borderColor: 'darkblue',
    color: 'white',
  },
  tok721Tag: {
    backgroundColor: 'darkgreen',
    borderColor: 'darkgreen',
    color: 'white',
  },
});
