import { dresses, project, types } from '@models';

import { GalleryFacet, GeneratorFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.GALLERY]: ({
      data,
    }: {
      data: Record<string, unknown>;
    }) => {
      const pageData = data as unknown as dresses.DressesPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'dresses',
        facetName: types.DataFacet.GALLERY,
      };
      return <GalleryFacet pageData={pageData} viewStateKey={viewStateKey} />;
    },
    [types.DataFacet.GENERATOR]: ({
      data,
    }: {
      data: Record<string, unknown>;
    }) => {
      const pageData = data as unknown as dresses.DressesPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'dresses',
        facetName: types.DataFacet.GENERATOR,
      };
      return <GeneratorFacet pageData={pageData} viewStateKey={viewStateKey} />;
    },
  },
};
