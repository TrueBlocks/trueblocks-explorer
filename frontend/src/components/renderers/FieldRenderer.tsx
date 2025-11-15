import { ChangeEvent, forwardRef } from 'react';

import { FormField } from '@components';
import { Fieldset, Stack } from '@mantine/core';

import { DisplayRenderer } from './DisplayRenderer';
import { EditRenderer } from './EditRenderer';

export interface FieldRendererProps {
  field: FormField<Record<string, unknown>>;
  row?: Record<string, unknown>;
  rowData?: Record<string, unknown>; // Alias for row - backwards compatibility
  mode?: 'display' | 'edit';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  loading?: boolean;
  keyProp?: string | number;
  autoFocus?: boolean;
  tableCell?: boolean;
}

export const FieldRenderer = forwardRef<HTMLInputElement, FieldRendererProps>(
  (
    {
      field,
      row,
      rowData,
      mode,
      onChange,
      onBlur,
      loading,
      keyProp,
      autoFocus,
      tableCell = true,
    },
    ref,
  ) => {
    if (field.fields && field.fields.length > 0) {
      return (
        <Fieldset key={keyProp}>
          {field.label && <legend>{field.label}</legend>}
          <Stack>
            {field.fields.map((nestedField, nestedIndex) => (
              <FieldRenderer
                key={nestedField.name || nestedIndex}
                field={nestedField}
                mode={mode}
                onChange={onChange}
                onBlur={onBlur}
                loading={loading}
                autoFocus={autoFocus && nestedIndex === 0} // Only first nested field gets autoFocus
                tableCell={tableCell}
              />
            ))}
          </Stack>
        </Fieldset>
      );
    }

    if (field.customRender) {
      return <div key={keyProp}>{field.customRender}</div>;
    }

    if (mode === 'display') {
      return (
        <DisplayRenderer
          field={field}
          row={row}
          rowData={rowData}
          tableCell={tableCell}
          keyProp={keyProp}
        />
      );
    }

    // Edit mode - delegate to EditRenderer
    return (
      <EditRenderer
        ref={ref}
        field={field}
        row={row}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={autoFocus}
        keyProp={keyProp}
      />
    );
  },
);

FieldRenderer.displayName = 'FieldRenderer';
