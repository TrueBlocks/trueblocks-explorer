import { MetricConfig, TimeGroupBy } from '@components';
import { types } from '@models';

export interface Aggregation {
  dataFacet: types.DataFacet;
  defaultMetric: string;
  metrics: MetricConfig[];
  skipUntil?: string;
  timeGroupBy?: TimeGroupBy;
}
