import { memo } from 'react';

export const EtherRenderer = memo(({ value }: { value: unknown }) => {
  let displayValue: React.ReactNode;
  if (!value) {
    displayValue = '-';
  } else {
    const etherValue = String(value);
    const numericValue = parseFloat(etherValue);
    if (isNaN(numericValue) || numericValue === 0) {
      displayValue = '-';
    } else {
      // Format to exactly 6 decimal places, ensuring at least one digit before decimal
      displayValue = numericValue.toFixed(4);
    }
  }
  return displayValue;
});

EtherRenderer.displayName = 'EtherRenderer';
