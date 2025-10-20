import { comparitoor, types } from '@models';

import { ComparitoorFacet } from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.COMPARITOOR]: ({
      data,
    }: {
      data: Record<string, unknown>;
    }) => {
      const pageData = data as unknown as comparitoor.ComparitoorPage;
      return <ComparitoorFacet _pageData={pageData} />;
    },
  },
};
