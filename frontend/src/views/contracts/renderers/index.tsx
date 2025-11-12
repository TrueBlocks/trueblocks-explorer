import { RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.DASHBOARD]: (params: RendererParams) => {
      return <facets.DashboardFacet params={params} />;
    },
    [types.DataFacet.EXECUTE]: (params: RendererParams) => {
      return <facets.ExecuteFacet params={params} />;
    },
  },
};
