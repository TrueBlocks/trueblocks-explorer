import { MetricConfig, TimeGroupBy } from '@components';
import { types } from '@models';

export interface BucketsConfig {
  dataFacet: types.DataFacet;
  collection: string;
  defaultMetric: string;
  metrics: MetricConfig[];
  skipUntil?: string;
  timeGroupBy?: TimeGroupBy;
}
