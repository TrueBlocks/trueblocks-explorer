import { comparitoor, types } from '@models';

import { ComparitoorFacet } from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.COMPARITOOR]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      // Create a minimal ComparitoorPage from the available data
      const pageData = {
        transaction: data,
        chifra: data,
        etherscan: data,
        covalent: data,
        alchemy: data,
        unionCount: data.length,
        overlapCount: 0,
        intersectionCount: 0,
      } as unknown as comparitoor.ComparitoorPage;

      return <ComparitoorFacet _pageData={pageData} />;
    },
  },
};
