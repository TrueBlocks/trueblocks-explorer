import React from 'react';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownCircleFilled,
  RightCircleFilled,
  UpCircleFilled,
} from '@ant-design/icons';

import {
  Reconciliation,
} from '@modules/types';

export const ReconIcon = ({ statement }: { statement: Reconciliation }) => {
  if (!statement) return <></>;
  let icon = <></>;
  if (statement.reconciled) {
    const okay = { color: 'green' };
    switch (statement.reconciliationType) {
      case 'partial-nextdiff':
        icon = <DownCircleFilled style={okay} />;
        break;
      case 'prevdiff-partial':
        icon = <UpCircleFilled style={okay} />;
        break;
      case 'partial-partial':
        icon = <RightCircleFilled style={okay} />;
        break;
      case 'regular':
      case 'by-trace':
      default:
        icon = <CheckCircleFilled style={okay} />;
        break;
    }
  } else {
    const notOkay = { color: 'red' };
    icon = <CloseCircleFilled style={notOkay} />;
  }
  return <div>{icon}</div>;
};
