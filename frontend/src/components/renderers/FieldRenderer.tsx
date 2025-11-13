import { ChangeEvent, forwardRef, isValidElement } from 'react';

import { FormField } from '@components';
import { Fieldset, Stack, Text, TextInput } from '@mantine/core';

import {
  BooleanRenderer,
  DateTimeRenderer,
  EtherRenderer,
  FileSizeRenderer,
  IdentifierRenderer,
  WeiRenderer,
} from './FieldRenderer.renderers';
import {
  formatNumberWithFallback,
  formatWeiToGigawei,
  isNullOrEmpty,
  safeToNumber,
  withFallback,
} from './utils';

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
      // Extract value from rowData if available, otherwise use field.value
      const rowDataSource = rowData || row; // Support both prop names
      const value =
        rowDataSource && field.key ? rowDataSource[field.key] : field.value;

      let displayValue: React.ReactNode;
      if (field.type === 'wei') {
        displayValue = <WeiRenderer value={value} />;
      } else if (field.type === 'ether') {
        displayValue = <EtherRenderer value={value} />;
      } else if (field.type === 'gas') {
        displayValue = value ? formatWeiToGigawei(value as string) : '0.000';
      } else if (
        field.type === 'timestamp' ||
        (field.type && (field.type as string).toLowerCase() === 'timestamp')
      ) {
        displayValue = <DateTimeRenderer value={value} />;
      } else if ((field.type as string) === 'fileSize') {
        displayValue = <FileSizeRenderer value={value} />;
      } else if (field.type === 'number') {
        if (isNullOrEmpty(value)) {
          displayValue = '0';
        } else {
          const num = safeToNumber(value);
          displayValue = isNaN(num) ? '0' : num.toLocaleString();
        }
      } else if ((field.type as string) === 'boolean') {
        displayValue = <BooleanRenderer value={value} tableCell={tableCell} />;
      } else if ((field.type as string) === 'identifier') {
        displayValue = (
          <IdentifierRenderer value={value} rowData={rowDataSource} />
        );
      } else if ((field.type as string) === 'float64') {
        displayValue = formatNumberWithFallback(value, 2, '0.00');
      } else {
        displayValue = withFallback(value, 'N/A');
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

      if (field.type === 'datetime') {
        return (
          <DateTimeRenderer
            value={displayValue}
            field={field}
            keyProp={keyProp || ''}
          />
        );
      }

      return <div key={keyProp}>{displayValue}</div>;
    }

    const isGasField = field.type === 'gas';
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
          error={
            (!loading && field.error) ||
            (field.required &&
              !(row && field.key ? row[field.key] : field.value) &&
              `${field.label} is required`)
          }
          rightSection={field.rightSection}
          name={field.name}
          readOnly={field.readOnly}
          disabled={field.readOnly}
          tabIndex={field.readOnly ? -1 : 0}
          autoFocus={autoFocus}
        />
        {hint && (
          <Text variant="dimmed" size="sm">
            {hint}
          </Text>
        )}
      </div>
    );
  },
);

FieldRenderer.displayName = 'FieldRenderer';
