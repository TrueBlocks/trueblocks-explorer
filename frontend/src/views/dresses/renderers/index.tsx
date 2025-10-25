import { dresses, project, types } from '@models';

import { GalleryFacet, GeneratorFacet, SeriesFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.GALLERY]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      // Now data is the full array of items
      const pageData = {
        dalledress: data || [],
      } as unknown as dresses.DressesPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'dresses',
        facetName: types.DataFacet.GALLERY,
      };
      return <GalleryFacet pageData={pageData} viewStateKey={viewStateKey} />;
    },
    [types.DataFacet.GENERATOR]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      const pageData = {
        dalledress: data || [],
      } as unknown as dresses.DressesPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'dresses',
        facetName: types.DataFacet.GENERATOR,
      };
      return <GeneratorFacet pageData={pageData} viewStateKey={viewStateKey} />;
    },
    [types.DataFacet.SERIES]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      const pageData = {
        series: data || [],
      } as unknown as dresses.DressesPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'dresses',
        facetName: types.DataFacet.SERIES,
      };
      return <SeriesFacet pageData={pageData} viewStateKey={viewStateKey} />;
    },
  },
};
