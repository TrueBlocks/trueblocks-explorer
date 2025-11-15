import { isValidElement } from 'react';

import { FormField } from '@components';

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

export interface DisplayRendererProps {
  field: FormField<Record<string, unknown>>;
  row?: Record<string, unknown>;
  rowData?: Record<string, unknown>; // Alias for row - backwards compatibility
  tableCell?: boolean;
  keyProp?: string | number;
}

export const DisplayRenderer = ({
  field,
  row,
  rowData,
  tableCell = true,
  keyProp,
}: DisplayRendererProps) => {
  // Extract value from rowData if available, otherwise use field.value
  const rowDataSource = rowData || row; // Support both prop names
  const value =
    rowDataSource && field.key ? rowDataSource[field.key] : field.value;

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

  // Special case for datetime - render directly without wrapper
  if (field.type === 'datetime') {
    return processedDisplayValue as React.ReactElement;
  }

  // Handle table cell alignment
  if (context === RenderContext.TABLE_CELL) {
    return (
      <TableAlignmentWrapper shouldRightAlign={typeRenderer.shouldRightAlign}>
        {processedDisplayValue}
      </TableAlignmentWrapper>
    );
  }

  // Detail view or other display contexts
  return <div key={keyProp}>{processedDisplayValue}</div>;
};
