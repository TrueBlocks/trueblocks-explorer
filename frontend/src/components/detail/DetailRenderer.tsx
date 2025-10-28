import { useMemo } from 'react';

import { FieldRenderer, FormField } from '@components';
import { Grid } from '@mantine/core';

export interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  type?: FormField['type'] | 'fileSize' | 'boolean' | 'custom'; // Use FormField types + our custom additions
  className?: string;
  labelProps?: React.HTMLProps<HTMLDivElement>;
  valueProps?: React.HTMLProps<HTMLDivElement>;
  labelSpan?: number; // Custom span for label column (default: 3)
  valueSpan?: number; // Custom span for value column (default: 9)
}

/**
 * DetailField is the atomic component for rendering label+value pairs in detail panels.
 * It wraps FieldRenderer in display mode and renders using the existing CSS classes
 * (detail-row-prompt, detail-row-value) for visual consistency.
 *
 * This component provides:
 * - Consistent formatting via FieldRenderer's type system
 * - Extended type support for DetailPanel-specific formatters
 * - CSS class compatibility with existing DetailTable styling
 * - Support for both simple values and complex React elements
 */
export const DetailField = ({
  label,
  value,
  type = 'custom',
  className,
  labelProps = {},
  valueProps = {},
  labelSpan = 3,
  valueSpan = 9,
}: DetailFieldProps) => {
  // Create a FormField-compatible object for FieldRenderer
  const field: FormField<Record<string, unknown>> = useMemo(
    () => ({
      name: label,
      label,
      value: value as string, // Cast for FormField compatibility
      type:
        type === 'custom' || type === 'fileSize' || type === 'boolean'
          ? undefined
          : type, // Let FieldRenderer handle known types
      onChange: () => {}, // Not used in display mode
      onBlur: () => {}, // Not used in display mode
    }),
    [label, value, type],
  );

  // For custom type, fileSize, boolean, or when value is already a React element, render directly
  if (
    type === 'custom' ||
    type === 'fileSize' ||
    type === 'boolean' ||
    typeof value === 'object'
  ) {
    // Handle special formatting for our custom types
    let displayValue = value;
    if (type === 'fileSize' && typeof value === 'number') {
      const bytes = Number(value);
      if (bytes === 0) {
        displayValue = '0 B';
      } else {
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        displayValue =
          parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    } else if (type === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    }

    return (
      <>
        <Grid.Col span={labelSpan}>
          <div
            className={`detail-row-prompt${className ? ` ${className}` : ''}`}
            {...labelProps}
          >
            {label}
          </div>
        </Grid.Col>
        <Grid.Col span={valueSpan}>
          <div className="detail-row-value" {...valueProps}>
            {displayValue}
          </div>
        </Grid.Col>
      </>
    );
  }

  // For known types, use FieldRenderer with tableCell mode to get just the formatted value
  return (
    <>
      <Grid.Col span={labelSpan}>
        <div
          className={`detail-row-prompt${className ? ` ${className}` : ''}`}
          {...labelProps}
        >
          {label}
        </div>
      </Grid.Col>
      <Grid.Col span={valueSpan}>
        <div className="detail-row-value" {...valueProps}>
          <FieldRenderer
            field={field}
            mode="display"
            tableCell={true} // This returns just the formatted value without wrapper divs
          />
        </div>
      </Grid.Col>
    </>
  );
};

DetailField.displayName = 'DetailField';
