import { types } from '@models';

import { DataFacetConfig } from './useActiveFacet';

export function buildFacetConfigs(
  viewConfig: types.ViewConfig,
  labelTransform?: (id: string) => string,
): DataFacetConfig[] {
  return (viewConfig.facetOrder || [])
    .filter((facetId: string) => {
      const fc = viewConfig.facets[facetId];
      if (!fc) return false;
      if (fc.disabled) return false;
      return true;
    })
    .map((facetId: string) => {
      const facetCfg = viewConfig.facets[facetId];
      return {
        id: facetId as types.DataFacet,
        label:
          facetCfg?.name ||
          (labelTransform ? labelTransform(facetId) : facetId),
        dividerBefore: facetCfg?.dividerBefore,
        canClose: facetCfg?.canClose,
      };
    });
}
