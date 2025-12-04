import { RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.GENERATOR]: (params: RendererParams) => {
      return <facets.GeneratorFacet params={params} />;
    },
    [types.DataFacet.SERIES]: (params: RendererParams) => {
      return <facets.SeriesFacet params={params} />;
    },
    [types.DataFacet.DATABASES]: (params: RendererParams) => {
      return <facets.DatabasesFacet params={params} />;
    },
    [types.DataFacet.ITEMS]: (params: RendererParams) => {
      return <facets.ItemsFacet params={params} />;
    },
    [types.DataFacet.GALLERY]: (params: RendererParams) => {
      return <facets.GalleryFacet params={params} />;
    },
  },
};
