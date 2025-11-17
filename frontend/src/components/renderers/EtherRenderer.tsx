import { memo } from 'react';

export const EtherRenderer = memo(({ value }: { value: unknown }) => {
  let displayValue: React.ReactNode;
  if (value === null || value === undefined || value === '') {
    displayValue = '[null]';
  } else {
    const etherValue = String(value);
    const numericValue = parseFloat(etherValue);
    if (isNaN(numericValue)) {
      displayValue = '[null]';
    } else if (numericValue === 0) {
      displayValue = '-';
    } else {
      // Format to exactly 4 decimal places for non-zero values
      displayValue = numericValue.toFixed(4);
    }
  }
  return displayValue;
});

EtherRenderer.displayName = 'EtherRenderer';
