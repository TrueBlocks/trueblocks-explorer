import { RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.MANAGE]: (params: RendererParams) => {
      return <facets.ManageFacet params={params} />;
    },
    dynamic: (params: RendererParams) => {
      return <facets.ProjectsFacet params={params} />;
    },
  },
};
