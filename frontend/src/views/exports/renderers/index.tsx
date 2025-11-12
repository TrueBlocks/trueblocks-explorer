import { CustomRendererParams } from '@components';
import { types } from '@models';

import { AssetChartsFacet } from './facets';
import { ApprovalsPanel, AssetsPanel, StatementsPanel } from './panels';

export * from './panels';
export * from './facets';

export const renderers = {
  panels: {
    [types.DataFacet.OPENAPPROVALS]: ApprovalsPanel,
    [types.DataFacet.STATEMENTS]: StatementsPanel,
    [types.DataFacet.ASSETS]: AssetsPanel,
  },
  facets: {
    [types.DataFacet.ASSETCHARTS]: (params: CustomRendererParams) => {
      return <AssetChartsFacet _params={params} />;
    },
  },
};
