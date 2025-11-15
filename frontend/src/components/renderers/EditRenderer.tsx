import { ChangeEvent, forwardRef } from 'react';

import { FormField } from '@components';
import { Text, TextInput } from '@mantine/core';

import { getDefaultRenderer, getTypeRenderer } from './TypeRendererRegistry';

export interface EditRendererProps {
  field: FormField<Record<string, unknown>>;
  row?: Record<string, unknown>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  keyProp?: string | number;
}

export const EditRenderer = forwardRef<HTMLInputElement, EditRendererProps>(
  ({ field, row, onChange, onBlur, autoFocus, keyProp }, ref) => {
    // Get renderer configuration for edit mode
    const typeRenderer =
      getTypeRenderer(field.type || '') || getDefaultRenderer();

    // Use registry renderer for edit mode
    const placeHolder = field.placeholder || typeRenderer.editPlaceholder;
    const hint = field.hint || typeRenderer.editHint;

    return (
      <div key={keyProp}>
        <TextInput
          ref={ref}
          label={field.label}
          placeholder={placeHolder}
          withAsterisk={field.required}
          value={(row && field.key ? row[field.key] : field.value) as string}
          onChange={(e) => {
            if (!field.readOnly) {
              field.onChange?.(e);
            }
            if (onChange) {
              onChange(e);
            }
          }}
          onBlur={(e) => {
            field.onBlur?.(e);
            if (onBlur) {
              onBlur(e);
            }
          }}
          readOnly={field.readOnly}
          error={field.error}
          disabled={field.disabled}
          autoFocus={autoFocus}
          tabIndex={field.readOnly ? -1 : 0}
          rightSection={field.rightSection}
          name={field.name}
        />
        {hint && (
          <Text size="xs" c="gray.6" mt={4}>
            {hint}
          </Text>
        )}
      </div>
    );
  },
);

EditRenderer.displayName = 'EditRenderer';
