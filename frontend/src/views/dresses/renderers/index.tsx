import { CustomRendererParams } from '@components';
import { types } from '@models';

import { GalleryFacet, GeneratorFacet, SeriesFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.GALLERY]: (params: CustomRendererParams) => {
      return <GalleryFacet params={params} />;
    },
    [types.DataFacet.GENERATOR]: (params: CustomRendererParams) => {
      return <GeneratorFacet params={params} />;
    },
    [types.DataFacet.SERIES]: (params: CustomRendererParams) => {
      return <SeriesFacet params={params} />;
    },
  },
};
