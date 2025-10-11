import { chunks, types } from '@models';

export interface Aggregation {
  facetName: string;
  dataFacet: types.DataFacet;
  defaultMetric: string;
  metrics: {
    key: string;
    label: string;
    bucketsField: keyof chunks.ChunksBuckets;
    statsField: keyof chunks.ChunksBuckets;
    formatValue: (value: number) => string;
    bytes: boolean;
  }[];
}
