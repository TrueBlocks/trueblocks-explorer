import { types } from '@models';

import { BloomsPanel, IndexPanel, StatsPanel } from './panels';

export * from './panels';

export const renderers = {
  panels: {
    [types.DataFacet.BLOOMS]: BloomsPanel,
    [types.DataFacet.INDEX]: IndexPanel,
    [types.DataFacet.STATS]: StatsPanel,
  },
  facets: {},
};
