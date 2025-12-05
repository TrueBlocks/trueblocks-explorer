// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useViewConfig } from '@hooks';
import { types } from '@models';

import { ChunksPanel } from '../shared/ChunksPanel';

// EXISTING_CODE

export const StatsPanel = (
  rowData: Record<string, unknown>,
  _onFinal: (rowKey: string, newValue: string, txHash: string) => void,
) => {
  // EXISTING_CODE
  const { config: viewConfig } = useViewConfig({ viewName: 'chunks' });
  const facetConfig = viewConfig?.facets?.[types.DataFacet.STATS];

  if (!facetConfig?.panelChartConfig) return null;

  return (
    <ChunksPanel
      panelConfig={facetConfig.panelChartConfig}
      dataFacet={types.DataFacet.STATS}
      collection="chunks"
      row={rowData}
    />
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
