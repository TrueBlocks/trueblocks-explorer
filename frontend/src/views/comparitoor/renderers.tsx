import { comparitoor } from '@models';
import { types } from '@models';

import { ComparitoorRenderer } from './renderers/ComparitoorRenderer';

export const renderers = (
  page: comparitoor.ComparitoorPage | null,
  _reload: () => void,
): Partial<Record<types.DataFacet, () => React.ReactElement>> => ({
  [types.DataFacet.COMPARITOOR]: () => {
    return <ComparitoorRenderer _pageData={page} />;
  },
});
