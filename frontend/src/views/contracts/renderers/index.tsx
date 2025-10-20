import { types } from '@models';

import { DashboardFacet, ExecuteFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.DASHBOARD]: ({
      data,
    }: {
      data: Record<string, unknown>;
    }) => {
      return <DashboardFacet data={data} />;
    },
    [types.DataFacet.EXECUTE]: ({
      data,
    }: {
      data: Record<string, unknown>;
    }) => {
      return <ExecuteFacet data={data} />;
    },
  },
};
