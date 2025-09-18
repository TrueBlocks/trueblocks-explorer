import { ChangeEvent, forwardRef, isValidElement } from 'react';

import { FormField } from '@components';
import { useActiveProject } from '@hooks';
import { Fieldset, Stack, Text, TextInput } from '@mantine/core';
import { formatWeiToEther, formatWeiToGigawei } from '@utils';

export interface FieldRendererProps {
  field: FormField<Record<string, unknown>>;
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
    { field, mode, onChange, onBlur, loading, keyProp, autoFocus, tableCell },
    ref,
  ) => {
    const { activeAddress } = useActiveProject();

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
              />
            ))}
          </Stack>
        </Fieldset>
      );
    }

    if (field.customRender) {
      return <div key={keyProp}>{field.customRender}</div>;
    }

    const isEtherField = field.type === 'ether';
    const isGasField = field.type === 'gas';
    const isAddressField = field.type === 'address';
    const isHighlighted =
      isAddressField &&
      field.value &&
      field.value.toString().toLowerCase() === activeAddress.toLowerCase();

    if (mode === 'display') {
      let displayValue;
      if (field.type === 'ether' && field.value) {
        displayValue = formatWeiToEther(field.value as string);
      } else if (field.type === 'gas' && field.value) {
        displayValue = formatWeiToGigawei(field.value as string);
      } else {
        displayValue = field.value || 'N/A';
      }

      if (typeof displayValue === 'object') {
        if (!isValidElement(displayValue)) {
          try {
            displayValue = JSON.stringify(displayValue);
          } catch {
            displayValue = String(displayValue);
          }
        }
      }

      if (tableCell) {
        return <>{displayValue}</>;
      }

      // For date/datetime fields, split on '|' and render each part on its own line
      if (field.type === 'datetime') {
        const parts = String(displayValue)
          .split('|')
          .map((p) => p.trim());
        return (
          <div key={keyProp}>
            {parts.map((part, idx) => (
              <Text key={idx} size="sm" fw={idx === 0 ? 500 : undefined}>
                {idx === 0 ? `${field.label}: ${part}` : part}
              </Text>
            ))}
          </div>
        );
      }

      return (
        <div key={keyProp}>
          <Text
            size="sm"
            fw={500}
            style={{
              ...(isHighlighted
                ? {
                    backgroundColor: 'var(--mantine-color-blue-1)',
                    color: 'var(--mantine-color-blue-9)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--mantine-color-blue-3)',
                  }
                : {}),
            }}
          >
            {field.label}: {displayValue}
          </Text>
        </div>
      );
    }

    let placeHolder;
    if (isEtherField) {
      placeHolder =
        field.placeholder || 'Wei value (e.g., 1000000000000000000 for 1 ETH)';
    } else if (isGasField) {
      placeHolder =
        field.placeholder || 'Wei value (e.g., 21000000000000 for 21 Gwei)';
    } else {
      placeHolder = field.placeholder;
    }

    let hint;
    if (isEtherField) {
      hint = field.hint || 'Enter value in Wei (smallest unit of Ether)';
    } else if (isGasField) {
      hint = field.hint || 'Enter value in Wei (will display as Gigawei)';
    } else {
      hint = field.hint;
    }

    return (
      <div key={keyProp}>
        <TextInput
          ref={ref}
          label={field.label}
          placeholder={placeHolder}
          withAsterisk={field.required}
          value={field.value as string}
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
          error={
            (!loading && field.error) ||
            (field.required && !field.value && `${field.label} is required`)
          }
          styles={{
            input: {
              ...(field.error
                ? {
                    borderColor: '#fa5252',
                    backgroundColor: 'rgba(250, 82, 82, 0.1)',
                  }
                : {}),
              ...(field.readOnly
                ? {
                    color: 'var(--mantine-color-text)', // Use Mantine's text color variable for theme adaptability
                    opacity: 0.6, // Slightly reduce opacity to differentiate but keep readable
                  }
                : {}),
              ...(isHighlighted
                ? {
                    backgroundColor: 'var(--mantine-color-blue-1)',
                    borderColor: 'var(--mantine-color-blue-4)',
                    color: 'var(--mantine-color-blue-9)',
                  }
                : {}),
            },
            error: {
              fontWeight: 500,
            },
          }}
          rightSection={field.rightSection}
          name={field.name}
          readOnly={field.readOnly}
          disabled={field.readOnly}
          tabIndex={field.readOnly ? -1 : 0}
          autoFocus={autoFocus}
        />
        {hint && (
          <Text size="sm" c="dimmed">
            {hint}
          </Text>
        )}
      </div>
    );
  },
);

FieldRenderer.displayName = 'FieldRenderer';
