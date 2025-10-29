import { memo } from 'react';

import { formatWeiToEther, isInfiniteValue } from './utils';

export const WeiRenderer = memo(({ value }: { value: unknown }) => {
  if (!value) {
    return '0.000000';
  }

  let displayValue: React.ReactNode;
  try {
    displayValue = formatWeiToEther(value as string);
  } catch {
    // If Wei formatting fails, field might already be in Ether format - format consistently
    const etherValue = String(value);
    const numericValue = parseFloat(etherValue);
    if (isNaN(numericValue)) {
      displayValue = '0.000000';
    } else {
      displayValue = numericValue.toFixed(6);
    }
  }
  if (typeof displayValue === 'string' && isInfiniteValue(displayValue)) {
    displayValue = <div style={{ fontStyle: 'italic' }}>infinite</div>;
  }
  return displayValue;
});

WeiRenderer.displayName = 'WeiRenderer';
