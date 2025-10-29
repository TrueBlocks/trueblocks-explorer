import { memo } from 'react';

import { formatTimestamp } from './utils';

export const IdentifierRenderer = memo(
  ({
    value,
    rowDataSource,
  }: {
    value: unknown;
    rowDataSource?: Record<string, unknown>;
  }) => {
    // If we have rowDataSource, use complex blockchain identifier formatting
    if (rowDataSource) {
      const buildDottedNotation = () => {
        const parts: string[] = [];

        // Always start with block number
        if (rowDataSource.blockNumber)
          parts.push(String(rowDataSource.blockNumber));

        // Add transaction index if present
        if (
          rowDataSource.transactionIndex !== undefined &&
          rowDataSource.transactionIndex !== null
        ) {
          parts.push(String(rowDataSource.transactionIndex));
        }

        // Add log index or trace index (not both)
        if (
          rowDataSource.logIndex !== undefined &&
          rowDataSource.logIndex !== null
        ) {
          parts.push(String(rowDataSource.logIndex));
        } else if (
          rowDataSource.traceIndex !== undefined &&
          rowDataSource.traceIndex !== null
        ) {
          parts.push(`[${rowDataSource.traceIndex}]`);
        }

        return parts.join('.');
      };

      // Three-row format implementation
      const hasTimestamp =
        rowDataSource.timestamp !== undefined &&
        rowDataSource.timestamp !== null;

      if (hasTimestamp) {
        // Multi-row format with timestamp
        const dateStr = formatTimestamp(rowDataSource.timestamp as number);
        const dottedNotation = buildDottedNotation();

        let hashStr = '';

        return (
          <div style={{ lineHeight: '1.2' }}>
            <div
              style={{
                fontSize: '0.85em',
                fontWeight: '500',
              }}
            >
              {dateStr}
            </div>
            {hashStr ? (
              <div
                style={{
                  fontSize: '0.8em',
                  fontFamily: 'monospace',
                  color: 'var(--skin-text-dimmed)',
                }}
              >
                {hashStr}
              </div>
            ) : null}
            <div
              style={{
                fontSize: '0.9em',
                color: 'var(--skin-text-secondary)',
              }}
            >
              {dottedNotation}
            </div>
          </div>
        );
      } else {
        // Single row fallback for entries without timestamp
        return buildDottedNotation() || 'N/A';
      }
    }

    // Simple identifier fallback when no rowDataSource
    return (value as React.ReactNode) || 'N/A';
  },
);

IdentifierRenderer.displayName = 'IdentifierRenderer';
