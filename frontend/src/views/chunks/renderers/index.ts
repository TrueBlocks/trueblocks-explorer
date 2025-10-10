import { BloomsPanelRenderer } from './BloomsPanelRenderer';
import { IndexPanelRenderer } from './IndexPanelRenderer';

export { BloomsPanelRenderer } from './BloomsPanelRenderer';
export { IndexPanelRenderer } from './IndexPanelRenderer';

export const renderers = {
  'chunks.blooms': BloomsPanelRenderer,
  'chunks.index': IndexPanelRenderer,
};
