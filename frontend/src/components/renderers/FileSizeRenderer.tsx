import { memo } from 'react';

export const FileSizeRenderer = memo(({ value }: { value: unknown }) => {
  const bytes = Number(value);
  if (bytes === 0 || isNaN(bytes) || value === undefined || value === null) {
    return '0 b';
  } else {
    const k = 1024;
    const sizes = ['b', 'kb', 'mb', 'gb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizeUnit = sizes[i] || 'gb'; // Fallback to 'gb' for very large values
    const calcValue = bytes / Math.pow(k, i);
    if (sizeUnit === 'kb' && calcValue > 100) {
      const mbValue = bytes / Math.pow(k, 2);
      return mbValue.toFixed(2) + ' mb';
    } else {
      return parseFloat(calcValue.toFixed(2)) + ' ' + sizeUnit;
    }
  }
});

FileSizeRenderer.displayName = 'FileSizeRenderer';
