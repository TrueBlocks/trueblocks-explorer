import { ChangeEvent, forwardRef, isValidElement } from 'react';

import { FormField, StyledBadge, StyledText } from '@components';
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

    const isGasField = field.type === 'gas';

    if (mode === 'display') {
      let displayValue;
      if (field.type === 'wei' && field.value) {
        // Try to format as Wei, but if it fails (e.g., already in Ether format), format as ether
        try {
          displayValue = formatWeiToEther(field.value as string);
        } catch {
          // If Wei formatting fails, field might already be in Ether format - format consistently
          const etherValue = String(field.value);
          const numericValue = parseFloat(etherValue);
          if (isNaN(numericValue)) {
            displayValue = '0.000000';
          } else {
            displayValue = numericValue.toFixed(6);
          }
        }
      } else if (field.type === 'ether') {
        // Fields with type 'ether' are already in Ether format - format to exactly 6 decimal places
        if (!field.value) {
          displayValue = '0.000000';
        } else {
          const etherValue = String(field.value);
          const numericValue = parseFloat(etherValue);
          if (isNaN(numericValue)) {
            displayValue = '0.000000';
          } else {
            // Format to exactly 6 decimal places, ensuring at least one digit before decimal
            displayValue = numericValue.toFixed(6);
          }
        }
      } else if (field.type === 'gas' && field.value) {
        displayValue = formatWeiToGigawei(field.value as string);
      } else if (field.type === 'timestamp' && field.value) {
        // Convert numerical Unix timestamp to formatted date
        displayValue = new Date(Number(field.value) * 1000).toLocaleString();
      } else if (
        (field.type as string) === 'fileSize' &&
        field.value !== undefined &&
        field.value !== null
      ) {
        // Format file size in bytes to human readable format
        const bytes = Number(field.value);
        if (bytes === 0 || isNaN(bytes)) {
          displayValue = '0 b';
        } else {
          const k = 1024;
          const sizes = ['b', 'kb', 'mb', 'gb'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          const sizeUnit = sizes[i] || 'gb'; // Fallback to 'gb' for very large values
          const value = bytes / Math.pow(k, i);

          // If kb > 100, show as mb with 3 decimal places
          if (sizeUnit === 'kb' && value > 100) {
            const mbValue = bytes / Math.pow(k, 2);
            displayValue = mbValue.toFixed(2) + ' mb';
          } else {
            displayValue = parseFloat(value.toFixed(2)) + ' ' + sizeUnit;
          }
        }
      } else if ((field.type as string) === 'fileSize') {
        // Handle empty/null fileSize values
        displayValue = '0 b';
      } else if (
        field.type === 'number' &&
        (field.value === undefined ||
          field.value === null ||
          field.value === '')
      ) {
        // Handle empty/null number values
        displayValue = '0';
      } else if (field.type === 'number') {
        // Handle non-empty number values
        displayValue = Number(field.value).toLocaleString();
      } else if ((field.type as string) === 'boolean') {
        // Handle boolean values - show badge only for true, nothing for false
        const isTrue = field.value === true || field.value === 'true';
        displayValue = isTrue ? (
          <StyledBadge variant="boolean">true</StyledBadge>
        ) : (
          ''
        );
      } else if (
        (field.type as string) === 'float64' &&
        field.value !== undefined &&
        field.value !== null
      ) {
        // Handle float64 values - always show two decimal places with at least one zero before decimal
        const floatValue = Number(field.value);
        if (isNaN(floatValue)) {
          displayValue = '0.00';
        } else {
          displayValue = floatValue.toFixed(2);
        }
      } else if ((field.type as string) === 'float64') {
        // Handle empty/null float64 values
        displayValue = '0.00';
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
        // Right align fileSize and number types like numeric data
        const shouldRightAlign =
          (field.type as string) === 'fileSize' ||
          (field.type as string) === 'float64' ||
          field.type === 'number' ||
          field.type === 'gas' ||
          field.type === 'ether' ||
          field.type === 'wei';

        if (shouldRightAlign) {
          return <div style={{ textAlign: 'right' }}>{displayValue}</div>;
        }
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
    if (field.type === 'wei') {
      placeHolder =
        field.placeholder || 'Wei value (e.g., 1000000000000000000 for 1 ETH)';
    } else if (field.type === 'ether') {
      placeHolder = field.placeholder || 'Ether value (e.g., 1.000000)';
    } else if (isGasField) {
      placeHolder =
        field.placeholder || 'Wei value (e.g., 21000000000000 for 21 Gwei)';
    } else {
      placeHolder = field.placeholder;
    }

    let hint;
    if (field.type === 'wei') {
      hint = field.hint || 'Enter value in Wei (smallest unit of Ether)';
    } else if (field.type === 'ether') {
      hint =
        field.hint || 'Enter value in Ether (will be displayed as entered)';
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
