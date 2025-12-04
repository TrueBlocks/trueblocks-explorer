import { PanelRenderer, RendererParams } from '@components';
import { types } from '@models';

import * as facets from './facets';
import * as panels from './panels';

export const renderers = {
  panels: {
    [types.DataFacet.EVENTS]: panels.EventsPanel,
  } as Record<string, PanelRenderer>,
  facets: {
    [types.DataFacet.DASHBOARD]: (params: RendererParams) => {
      return <facets.DashboardFacet params={params} />;
    },
    [types.DataFacet.EXECUTE]: (params: RendererParams) => {
      return <facets.ExecuteFacet params={params} />;
    },
  },
};
