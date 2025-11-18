import { isValidElement } from 'react';

import { FormField, shouldRightAlign } from '@components';
import { usePreferences } from '@hooks';
import { useMantineTheme } from '@mantine/core';

import {
  RenderContext,
  getDefaultRenderer,
  getDisplayContext,
  getTypeRenderer,
} from './TypeRendererRegistry';

// Dedicated wrapper for table cell alignment
const TableAlignmentWrapper = ({
  children,
  shouldRightAlign,
}: {
  children: React.ReactNode;
  shouldRightAlign: boolean;
}) => {
  if (shouldRightAlign) {
    return <div style={{ textAlign: 'right' }}>{children}</div>;
  }
  return <>{children}</>;
};

// Type debugging wrapper
const TypeDebugWrapper = ({
  children,
  fieldType,
  showTypes,
  secondaryColor,
}: {
  children: React.ReactNode;
  fieldType?: string;
  showTypes: boolean;
  secondaryColor: string;
}) => {
  if (!showTypes) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div
        style={{
          fontSize: '9px',
          color: secondaryColor,
          fontFamily: 'monospace',
          lineHeight: '10px',
          marginTop: '1px',
        }}
      >
        {fieldType || 'undefined'}
      </div>
    </div>
  );
};

export interface DisplayRendererProps {
  field: FormField<Record<string, unknown>>;
  rowData?: Record<string, unknown>;
  keyProp?: string | number;
  row?: Record<string, unknown>;
  tableCell?: boolean;
  context?: RenderContext;
}

export const DisplayRenderer = ({
  field,
  row,
  rowData,
  tableCell = true,
  keyProp,
}: DisplayRendererProps) => {
  const { showFieldTypes } = usePreferences();
  const theme = useMantineTheme();

  // Extract value from rowData if available, otherwise use field.value
  const rowDataSource = rowData || row; // Support both prop names

  // Handle dotted field keys like "calcs.begBalEth"
  const getValue = (data: Record<string, unknown>, key: string): unknown => {
    if (!data || !key) return undefined;

    // If key contains dots, traverse nested objects
    if (key.includes('.')) {
      const parts = key.split('.');
      let current: unknown = data;
      for (const part of parts) {
        if (current && typeof current === 'object' && current !== null) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      return current;
    }

    // Simple key access
    return data[key];
  };

  const value =
    rowDataSource && field.key
      ? getValue(rowDataSource, field.key)
      : field.value;

  // Get renderer from registry
  const typeRenderer =
    getTypeRenderer(field.type || '') || getDefaultRenderer();

  // Determine display context
  const context = getDisplayContext('display', tableCell);

  const view = typeRenderer.displayRenderer(value, {
    context,
    rowData: rowDataSource,
    field,
    keyProp,
  });

  // Handle object serialization for non-React elements
  let processedDisplayValue = view;
  if (typeof view === 'object' && !isValidElement(view)) {
    try {
      processedDisplayValue = JSON.stringify(view);
    } catch {
      processedDisplayValue = String(view);
    }
  }

  // Wrap with type debugging if enabled
  const wrappedValue = (
    <TypeDebugWrapper
      fieldType={field.type}
      showTypes={showFieldTypes}
      secondaryColor={theme.colors.gray[6]}
    >
      {processedDisplayValue}
    </TypeDebugWrapper>
  );

  // Special case for datetime - render directly without wrapper
  if (field.type === 'datetime') {
    return wrappedValue;
  }

  // Handle table cell alignment
  if (context === RenderContext.TABLE_CELL) {
    return (
      <TableAlignmentWrapper shouldRightAlign={shouldRightAlign(field.type)}>
        {wrappedValue}
      </TableAlignmentWrapper>
    );
  }

  // Detail view or other display contexts
  return <div key={keyProp}>{wrappedValue}</div>;
};
