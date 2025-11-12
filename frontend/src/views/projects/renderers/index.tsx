import { CustomRendererParams } from '@components';
import { types } from '@models';

import { ManageFacet, ProjectsFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.MANAGE]: (params: CustomRendererParams) => {
      return <ManageFacet params={params} />;
    },
    default: (params: CustomRendererParams) => {
      return <ProjectsFacet params={params} />;
    },
  },
};
