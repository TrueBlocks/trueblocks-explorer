import { MetricConfig } from '@components';
import { types } from '@models';

export type TimeGroupBy = 'daily' | 'monthly' | 'quarterly' | 'annual';

export interface Aggregation {
  dataFacet: types.DataFacet;
  defaultMetric: string;
  metrics: MetricConfig[];
  skipUntil?: string;
  timeGroupBy?: TimeGroupBy;
}
