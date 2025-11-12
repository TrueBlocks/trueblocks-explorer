import { RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.COMPARITOOR]: (params: RendererParams) => {
      return <facets.ComparitoorFacet params={params} />;
    },
  },
};
