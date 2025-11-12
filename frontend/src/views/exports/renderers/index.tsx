import { RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';
import * as panels from './panels';

export const renderers = {
  panels: {
    [types.DataFacet.STATEMENTS]: panels.StatementsPanel,
    [types.DataFacet.OPENAPPROVALS]: panels.OpenApprovalsPanel,
    [types.DataFacet.ASSETS]: panels.AssetsPanel,
  },
  facets: {
    [types.DataFacet.ASSETCHARTS]: (params: RendererParams) => {
      return <facets.AssetChartsFacet params={params} />;
    },
  },
};
