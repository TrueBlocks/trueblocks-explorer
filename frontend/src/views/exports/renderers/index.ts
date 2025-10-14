import { renderApprovalDetailPanel } from './Approval';
import { renderStatementDetailPanel } from './Statement';

export * from './Approval';
export * from './Statement';

export const renderers = {
  'exports.approvals': renderApprovalDetailPanel,
  'exports.statements': renderStatementDetailPanel,
};
