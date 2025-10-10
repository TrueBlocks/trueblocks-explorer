/**
 * Utility functions for formatting file sizes and other numeric values
 */

/**
 * Formats a byte value to human-readable format
 * @param bytes - The byte value as number or string
 * @returns Formatted string with appropriate unit (b, kb, mb, gb)
 */
export function formatBytes(bytes: number | string): string {
  const numBytes = Number(bytes);

  if (numBytes === 0 || isNaN(numBytes)) {
    return '0 b';
  }

  const k = 1024;
  const sizes = ['b', 'kb', 'mb', 'gb'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  const sizeUnit = sizes[i] || 'gb'; // Fallback to 'gb' for very large values
  const value = numBytes / Math.pow(k, i);

  // If kb > 100, show as mb with 2 decimal places
  if (sizeUnit === 'kb' && value > 100) {
    const mbValue = numBytes / Math.pow(k, 2);
    return mbValue.toFixed(2) + ' mb';
  } else {
    return parseFloat(value.toFixed(2)) + ' ' + sizeUnit;
  }
}

/**
 * Formats a numeric value based on its type and formatting requirements
 * @param value - The value to format
 * @param isBytes - Whether to format as bytes
 * @returns Formatted string
 */
export function formatNumericValue(
  value: number | string,
  isBytes: boolean = false,
): string {
  if (isBytes) {
    return formatBytes(value);
  }

  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }

  return num.toLocaleString();
}
