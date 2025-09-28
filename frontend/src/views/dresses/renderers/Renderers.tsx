import { ReactElement } from 'react';

import type { DataFacet } from '@hooks';
import { dresses, project, types } from '@models';

import { Gallery } from './gallery';
import { Generator } from './generator';

export function renderers(
  pageData: dresses.DressesPage | null,
  viewStateKey: project.ViewStateKey, // Required for persistence
  setActiveFacet?: (f: DataFacet) => void,
) {
  return {
    [types.DataFacet.GENERATOR]: () => (
      <Generator pageData={pageData} viewStateKey={viewStateKey} />
    ),
    [types.DataFacet.GALLERY]: () => (
      <Gallery
        pageData={pageData}
        viewStateKey={viewStateKey}
        setActiveFacet={setActiveFacet}
      />
    ),
  } as Record<types.DataFacet, () => ReactElement>;
}
