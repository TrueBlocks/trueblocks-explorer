import { BarchartPanel, HeatmapPanel } from '@components';
import { types } from '@models';
import { formatNumericValue } from '@utils';

import { useChunksPanelRenderer } from '../hooks/useChunksPanelRenderer';

interface ChunksPanelRendererProps {
  panelConfig: types.PanelConfig;
  dataFacet: types.DataFacet;
  collection: string;
  row: Record<string, unknown> | null;
}

export const ChunksPanelRenderer = ({
  panelConfig,
  dataFacet,
  collection,
  row,
}: ChunksPanelRendererProps) => {
  const { fetchBuckets, getMetric, setMetric } =
    useChunksPanelRenderer(dataFacet);

  // Convert backend MetricConfig to frontend BucketsConfig
  const bucketsConfig = {
    dataFacet,
    collection,
    defaultMetric: panelConfig.defaultMetric,
    skipUntil: panelConfig.skipUntil,
    timeGroupBy: panelConfig.timeGroupBy as
      | 'daily'
      | 'monthly'
      | 'quarterly'
      | 'annual'
      | undefined,
    metrics: panelConfig.metrics.map((metric) => ({
      key: metric.key,
      label: metric.label,
      bucketsField: metric.bucketsField as keyof types.Buckets,
      statsField: metric.statsField as keyof types.Buckets,
      formatValue: (value: number) =>
        formatNumericValue(value, { bytes: metric.bytes }),
      bytes: metric.bytes,
    })),
  };

  const enhancedGetMetric = (facetName: string) =>
    getMetric(facetName, panelConfig.metrics, panelConfig.defaultMetric);

  const PanelComponent =
    panelConfig.type === 'heatmap' ? HeatmapPanel : BarchartPanel;

  return (
    <PanelComponent
      config={bucketsConfig}
      row={row}
      fetchBuckets={fetchBuckets}
      getMetric={enhancedGetMetric}
      setMetric={setMetric}
    />
  );
};
