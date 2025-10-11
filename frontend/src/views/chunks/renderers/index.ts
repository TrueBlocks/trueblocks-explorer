import { BloomsPanelRenderer } from './BloomsPanelRenderer';
import { IndexPanelRenderer } from './IndexPanelRenderer';
import { StatsPanelRenderer } from './StatsPanelRenderer';

export { BloomsPanelRenderer } from './BloomsPanelRenderer';
export { IndexPanelRenderer } from './IndexPanelRenderer';
export { StatsPanelRenderer } from './StatsPanelRenderer';
export type { Aggregation } from './Aggregation';

export const renderers = {
  'chunks.blooms': BloomsPanelRenderer,
  'chunks.index': IndexPanelRenderer,
  'chunks.stats': StatsPanelRenderer,
};
