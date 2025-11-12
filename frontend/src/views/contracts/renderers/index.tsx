import { CustomRendererParams } from '@components';
import { types } from '@models';

import { DashboardFacet, ExecuteFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.DASHBOARD]: (params: CustomRendererParams) => {
      return <DashboardFacet params={params} />;
    },
    [types.DataFacet.EXECUTE]: (params: CustomRendererParams) => {
      return <ExecuteFacet params={params} />;
    },
  },
};
