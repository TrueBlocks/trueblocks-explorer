import { PanelRenderer, RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';
import * as panels from './panels';

export const renderers = {
  panels: {
    [types.DataFacet.STATEMENTS]: panels.StatementsPanel,
    [types.DataFacet.OPENAPPROVALS]: panels.OpenApprovalsPanel,
    [types.DataFacet.APPROVALTXS]: panels.ApprovalTxsPanel,
    [types.DataFacet.APPROVALLOGS]: panels.ApprovalLogsPanel,
    [types.DataFacet.TRANSACTIONS]: panels.TransactionsPanel,
    [types.DataFacet.LOGS]: panels.LogsPanel,
    [types.DataFacet.TRACES]: panels.TracesPanel,
  } as Record<string, PanelRenderer>,
  facets: {
    [types.DataFacet.ASSETCHARTS]: (params: RendererParams) => {
      return <facets.AssetChartsFacet params={params} />;
    },
    [types.DataFacet.OPENAPPROVALS]: (params: RendererParams) => {
      return <facets.OpenApprovalsFacet params={params} />;
    },
  },
};
