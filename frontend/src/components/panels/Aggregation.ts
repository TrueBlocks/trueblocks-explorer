import { MetricConfig } from '@components';
import { types } from '@models';

export interface Aggregation {
  dataFacet: types.DataFacet;
  defaultMetric: string;
  metrics: MetricConfig[];
}
