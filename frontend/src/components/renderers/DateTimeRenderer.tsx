import { memo } from 'react';

import { FormField } from '@components';

import { extractTimestamp, formatTimestamp, isEmptyValue } from './utils';

export const DateTimeRenderer = memo(
  ({
    value,
    field: _field,
    keyProp: _keyProp,
  }: {
    value: unknown;
    field?: FormField<Record<string, unknown>>;
    keyProp?: string | number;
  }) => {
    // Handle timestamp objects that might have a timestamp property
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      const timestamp = extractTimestamp(obj);
      if (timestamp) {
        return formatTimestamp(timestamp);
      }
    }

    // Handle timestamp numbers (convert to date string)
    if (
      typeof value === 'number' ||
      (typeof value === 'string' && /^\d+$/.test(value))
    ) {
      return formatTimestamp(value as number | string);
    }

    // Handle datetime strings that might contain '|' separators
    if (typeof value === 'string' && value.includes('|')) {
      const parts = value.split('|').map((p) => p.trim());
      return parts.join(' / ');
    }

    // Handle other string values (might already be formatted dates)
    const stringValue = String(value || '');
    if (isEmptyValue(stringValue)) {
      return 'No timestamp';
    }

    // Try to parse as date if it looks like a date string
    const parsedDate = new Date(stringValue);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString();
    }

    // Fallback: return the string as-is
    return stringValue;
  },
);

DateTimeRenderer.displayName = 'DateTimeRenderer';
