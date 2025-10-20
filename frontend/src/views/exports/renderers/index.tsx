import { exports, types } from '@models';

import { AssetChartsFacet } from './facets';
import {
  renderApprovalDetailPanel,
  renderStatementDetailPanel,
} from './panels';

export * from './panels';
export * from './facets';

export const renderers = {
  panels: {
    [types.DataFacet.OPENAPPROVALS]: renderApprovalDetailPanel,
    [types.DataFacet.STATEMENTS]: renderStatementDetailPanel,
  },
  facets: {
    [types.DataFacet.ASSETCHARTS]: ({
      data,
    }: {
      data: Record<string, unknown>;
    }) => {
      const pageData = data as unknown as exports.ExportsPage;
      return <AssetChartsFacet pageData={pageData} />;
    },
  },
};
