import { CustomRendererParams } from '@components';
import { types } from '@models';

import { ComparitoorFacet } from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.COMPARITOOR]: (params: CustomRendererParams) => {
      return <ComparitoorFacet params={params} />;
    },
  },
};
