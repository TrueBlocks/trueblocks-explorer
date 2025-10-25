import { types } from '@models';

import { DashboardFacet, ExecuteFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.DASHBOARD]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      return <DashboardFacet data={data[0] || {}} />;
    },
    [types.DataFacet.EXECUTE]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      return <ExecuteFacet data={data[0] || {}} />;
    },
  },
};
