/**
 * Utility function to get nested property values using dot notation
 * @param obj The object to access
 * @param path The dot-separated path (e.g., "calcs.reconciled")
 * @returns The value at the specified path, or undefined if not found
 */
export function getNestedProperty(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined;

  return path.split('.').reduce((current: unknown, key: string): unknown => {
    return current &&
      typeof current === 'object' &&
      current !== null &&
      key in current
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj);
}

/**
 * Check if a string represents a nested property path (contains dots)
 * @param key The property key to check
 * @returns True if the key contains dots
 */
export function isNestedProperty(key: string): boolean {
  return key.includes('.');
}
