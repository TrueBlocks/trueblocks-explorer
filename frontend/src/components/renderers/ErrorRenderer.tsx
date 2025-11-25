import { memo } from 'react';

import { StyledBadge } from '@components';

export const ErrorRenderer = memo(
  ({ value, tableCell }: { value: unknown; tableCell?: boolean }) => {
    const isTrue = value === true || value === 'true' || value === 1;
    if (tableCell) {
      return isTrue ? '' : <StyledBadge variant="error">error</StyledBadge>;
    } else {
      return isTrue ? '' : 'Error';
    }
  },
);

ErrorRenderer.displayName = 'ErrorRenderer';
