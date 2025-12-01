import { RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';
import * as panels from './panels';

export const renderers = {
  panels: {
    [types.DataFacet.STATEMENTS]: panels.StatementsPanel,
    [types.DataFacet.TRANSACTIONS]: panels.TransactionsPanel,
    [types.DataFacet.OPENAPPROVALS]: panels.OpenApprovalsPanel,
    // [types.DataFacet.APPROVALLOGS]: panels.ApprovalLogsPanel,
    [types.DataFacet.APPROVALTXS]: panels.ApprovalTxsPanel,
    [types.DataFacet.LOGS]: panels.LogsPanel,
    [types.DataFacet.TRACES]: panels.TracesPanel,
  },
  facets: {
    [types.DataFacet.OPENAPPROVALS]: (params: RendererParams) => {
      return <facets.OpenApprovalsFacet params={params} />;
    },
    [types.DataFacet.ASSETCHARTS]: (params: RendererParams) => {
      return <facets.AssetChartsFacet params={params} />;
    },
  },
};
