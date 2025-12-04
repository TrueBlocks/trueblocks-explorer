import { PanelRenderer } from '@components';
import { types } from '@models';

import * as panels from './panels';

export const renderers = {
  panels: {
    [types.DataFacet.STATS]: panels.StatsPanel,
    [types.DataFacet.INDEX]: panels.IndexPanel,
    [types.DataFacet.BLOOMS]: panels.BloomsPanel,
  } as Record<string, PanelRenderer>,
  facets: {},
};
