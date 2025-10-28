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
 * Formats a numeric value with consistent, locale-aware formatting
 * @param value - The value to format
 * @param options - Formatting options
 * @param options.bytes - Whether to format as file sizes (kb, mb, gb)
 * @param options.decimals - Number of decimal places (0 = integer)
 * @returns Formatted string
 */
export function formatNumericValue(
  value: number | string,
  options: { bytes?: boolean; decimals?: number } = {},
): string {
  const { bytes = false, decimals = 0 } = options;

  if (bytes) {
    return formatBytes(value);
  }

  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }

  // Round to specified decimals, then use locale formatting
  const rounded = decimals === 0 ? Math.round(num) : num;
  return rounded.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
