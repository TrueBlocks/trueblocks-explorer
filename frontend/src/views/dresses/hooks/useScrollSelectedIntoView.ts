import { RefObject, useEffect } from 'react';

export type ScrollIntoViewOptions = {
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  behavior?: ScrollBehavior;
};

export const useScrollSelectedIntoView = (
  containerRef: RefObject<HTMLElement | null>,
  selectedKey: string | null,
  options?: ScrollIntoViewOptions,
) => {
  const block = options?.block ?? 'nearest';
  const inline = options?.inline ?? 'nearest';
  const behavior = options?.behavior ?? 'auto';
  useEffect(() => {
    if (!containerRef.current || !selectedKey) return;
    const el = containerRef.current.querySelector(
      `[data-key="${selectedKey}"]`,
    );
    if (el && 'scrollIntoView' in el) {
      (el as HTMLElement).scrollIntoView({ block, inline, behavior });
    }
  }, [containerRef, selectedKey, block, inline, behavior]);
};
