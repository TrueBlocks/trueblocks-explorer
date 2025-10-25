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
    [types.DataFacet.ASSETCHARTS]: ({}: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      // AssetCharts ignores the data parameter and fetches its own
      const pageData = {} as unknown as exports.ExportsPage;
      return <AssetChartsFacet pageData={pageData} />;
    },
  },
};
