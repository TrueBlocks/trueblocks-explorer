import { memo } from 'react';

import { StyledBadge } from '@components';

export const BooleanRenderer = memo(
  ({ value, tableCell }: { value: unknown; tableCell?: boolean }) => {
    const isTrue = value === true || value === 'true';
    if (tableCell) {
      return isTrue ? <StyledBadge variant="boolean">true</StyledBadge> : '';
    } else {
      return isTrue ? 'Yes' : 'No';
    }
  },
);

BooleanRenderer.displayName = 'BooleanRenderer';
