import { ChangeEvent, forwardRef, isValidElement } from 'react';

import { FormField, StyledText } from '@components';
import { Fieldset, Stack, TextInput } from '@mantine/core';
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
              <StyledText variant="primary" size="sm" key={idx}>
                {idx === 0 ? `${field.label}: ${part}` : part}
              </StyledText>
            ))}
          </div>
        );
      }

      return (
        <div key={keyProp}>
          <StyledText variant="primary" size="sm" fw={600}>
            {field.label}: {displayValue}
          </StyledText>
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
            label: {
              color: 'var(--skin-text-primary)',
            },
            input: {
              color: 'var(--skin-text-primary)',
              backgroundColor: 'var(--skin-surface-default)',
              borderColor: 'var(--skin-border-default)',
              ...(field.error
                ? {
                    borderColor: 'var(--skin-error)',
                    backgroundColor: 'var(--skin-error-background)',
                  }
                : {}),
              ...(field.readOnly
                ? {
                    color: 'var(--skin-text-primary)',
                    opacity: 0.6, // Slightly reduce opacity to differentiate but keep readable
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
          <StyledText variant="dimmed" size="sm">
            {hint}
          </StyledText>
        )}
      </div>
    );
  },
);

FieldRenderer.displayName = 'FieldRenderer';
