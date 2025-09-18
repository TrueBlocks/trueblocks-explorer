declare global {
  interface Window {
    DEBUG_LAYOUT?: boolean;
  }
}

function isDebugLayoutEnabled(): boolean {
  return (
    import.meta.env.VITE_DEBUG_LAYOUT === 'true' ||
    (typeof window !== 'undefined' && window.DEBUG_LAYOUT === true)
  );
}

export function getDebugClass(level: number): string {
  if (!isDebugLayoutEnabled()) {
    return '';
  }

  return `debug-level-${level}`;
}

export function enableDebugLayout(): void {
  if (typeof window !== 'undefined') {
    window.DEBUG_LAYOUT = true;
  }
}

export function disableDebugLayout(): void {
  if (typeof window !== 'undefined') {
    window.DEBUG_LAYOUT = false;
  }
}

export function toggleDebugLayout(): void {
  if (typeof window !== 'undefined') {
    window.DEBUG_LAYOUT = !window.DEBUG_LAYOUT;
  }
}
