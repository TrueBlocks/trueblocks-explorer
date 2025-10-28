import { useMemo } from 'react';

import { FieldRenderer, FormField } from '@components';
import { Grid } from '@mantine/core';

export interface DetailRendererProps {
  label: string;
  value: React.ReactNode;
  type?: FormField['type'] | 'fileSize' | 'boolean' | 'custom'; // Use FormField types + our custom additions
  className?: string;
  labelProps?: React.HTMLProps<HTMLDivElement>;
  valueProps?: React.HTMLProps<HTMLDivElement>;
  labelSpan?: number;
  valueSpan?: number;
}

// DetailRenderer is the atomic component for rendering label+value pairs in detail panels.
export const DetailRenderer = ({
  label,
  value,
  type = 'custom',
  className,
  labelProps = {},
  valueProps = {},
  labelSpan = 3,
  valueSpan = 9,
}: DetailRendererProps) => {
  const field: FormField<Record<string, unknown>> = useMemo(
    () => ({
      name: label,
      label,
      value: value as string,
      type,
      onChange: () => {}, // Not used in display mode
      onBlur: () => {}, // Not used in display mode
    }),
    [label, value, type],
  );

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
          <FieldRenderer field={field} mode="display" tableCell={false} />
        </div>
      </Grid.Col>
    </>
  );
};

DetailRenderer.displayName = 'DetailRenderer';
