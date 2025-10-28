import { ChangeEvent, forwardRef, isValidElement } from 'react';

import { FormField, StyledBadge, StyledText } from '@components';
import { Fieldset, Stack, TextInput } from '@mantine/core';
import { formatWeiToEther, formatWeiToGigawei } from '@utils';

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
      if (field.type === 'weish') {
        displayValue = value as string;
        if (
          typeof displayValue === 'string' &&
          displayValue.startsWith('1157920892373161954235709850086879078532')
        ) {
          displayValue = <div style={{ fontStyle: 'italic' }}>infinite</div>;
        }
      } else if (field.type === 'wei' && value) {
        // Try to format as Wei, but if it fails (e.g., already in Ether format), format as ether
        try {
          displayValue = formatWeiToEther(value as string);
        } catch {
          // If Wei formatting fails, field might already be in Ether format - format consistently
          const etherValue = String(value);
          const numericValue = parseFloat(etherValue);
          if (isNaN(numericValue)) {
            displayValue = '0.000000';
          } else {
            displayValue = numericValue.toFixed(6);
          }
        }
        if (
          typeof displayValue === 'string' &&
          displayValue.startsWith('1157920892373161954235709850086879078532')
        ) {
          displayValue = <div style={{ fontStyle: 'italic' }}>infinite</div>;
        }
      } else if (field.type === 'ether') {
        // Fields with type 'ether' are already in Ether format - format to exactly 6 decimal places
        if (!value) {
          displayValue = '-';
        } else {
          const etherValue = String(value);
          const numericValue = parseFloat(etherValue);
          if (isNaN(numericValue) || numericValue === 0) {
            displayValue = '-';
          } else {
            // Format to exactly 6 decimal places, ensuring at least one digit before decimal
            displayValue = numericValue.toFixed(4);
          }
        }
      } else if (field.type === 'gas' && value) {
        displayValue = formatWeiToGigawei(value as string);
      } else if (field.type === 'timestamp' && value) {
        // Convert numerical Unix timestamp to formatted date
        displayValue = new Date(Number(value) * 1000).toLocaleString();
      } else if (
        (field.type as string) === 'fileSize' &&
        value !== undefined &&
        value !== null
      ) {
        // Format file size in bytes to human readable format
        const bytes = Number(value);
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
        (value === undefined || value === null || value === '')
      ) {
        // Handle empty/null number values
        displayValue = '0';
      } else if (field.type === 'number') {
        // Handle non-empty number values
        displayValue = Number(value).toLocaleString();
      } else if ((field.type as string) === 'fileSize') {
        // Format file size in bytes to human readable format
        const bytes = Number(value);
        if (bytes === 0 || isNaN(bytes)) {
          displayValue = '0 b';
        } else {
          const k = 1024;
          const sizes = ['b', 'kb', 'mb', 'gb'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          const sizeUnit = sizes[i] || 'gb'; // Fallback to 'gb' for very large values
          const valueCalc = bytes / Math.pow(k, i);

          // If kb > 100, show as mb with 3 decimal places
          if (sizeUnit === 'kb' && valueCalc > 100) {
            const mbValue = bytes / Math.pow(k, 2);
            displayValue = mbValue.toFixed(2) + ' mb';
          } else {
            displayValue = parseFloat(valueCalc.toFixed(2)) + ' ' + sizeUnit;
          }
        }
      } else if ((field.type as string) === 'boolean') {
        const isTrue = value === true || value === 'true';
        if (tableCell) {
          displayValue = isTrue ? (
            <StyledBadge variant="boolean">true</StyledBadge>
          ) : (
            ''
          );
        } else {
          displayValue = isTrue ? 'Yes' : 'No';
        }
      } else if ((field.type as string) === 'identifier' && rowDataSource) {
        // Format blockchain identifier in three-row format

        const buildDottedNotation = () => {
          const parts: string[] = [];

          // Always start with block number
          if (rowDataSource.blockNumber)
            parts.push(String(rowDataSource.blockNumber));

          // Add transaction index if present
          if (
            rowDataSource.transactionIndex !== undefined &&
            rowDataSource.transactionIndex !== null
          ) {
            parts.push(String(rowDataSource.transactionIndex));
          }

          // Add log index or trace index (not both)
          if (
            rowDataSource.logIndex !== undefined &&
            rowDataSource.logIndex !== null
          ) {
            parts.push(String(rowDataSource.logIndex));
          } else if (
            rowDataSource.traceIndex !== undefined &&
            rowDataSource.traceIndex !== null
          ) {
            parts.push(`[${rowDataSource.traceIndex}]`);
          }

          return parts.join('.');
        };

        // Three-row format implementation
        const hasTimestamp =
          rowDataSource.timestamp !== undefined &&
          rowDataSource.timestamp !== null;
        // const hasTransactionIndex =
        //   row.transactionIndex !== undefined && row.transactionIndex !== null;

        if (hasTimestamp) {
          // Multi-row format with timestamp
          const dateStr = new Date(
            Number(rowDataSource.timestamp) * 1000,
          ).toLocaleString();
          const dottedNotation = buildDottedNotation();

          let hashStr = '';
          // if (hasTransactionIndex && row.transactionHash) {
          //   hashStr = formatHash(row.transactionHash as string);
          // } else if (!hasTransactionIndex && row.blockHash) {
          //   hashStr = formatHash(row.blockHash as string);
          // }

          displayValue = (
            <div style={{ lineHeight: '1.2' }}>
              <div
                style={{
                  fontSize: '0.85em',
                  fontWeight: '500',
                }}
              >
                {dateStr}
              </div>
              {hashStr ? (
                <div
                  style={{
                    fontSize: '0.8em',
                    fontFamily: 'monospace',
                    color: 'var(--skin-text-dimmed)',
                  }}
                >
                  {hashStr}
                </div>
              ) : null}
              <div
                style={{
                  fontSize: '0.9em',
                  color: 'var(--skin-text-secondary)',
                }}
              >
                {dottedNotation}
              </div>
            </div>
          );
        } else {
          // Single row fallback for entries without timestamp
          displayValue = buildDottedNotation() || 'N/A';
        }
      } else if (
        (field.type as string) === 'float64' &&
        value !== undefined &&
        value !== null
      ) {
        // Handle float64 values - always show two decimal places with at least one zero before decimal
        const floatValue = Number(value);
        if (isNaN(floatValue)) {
          displayValue = '0.00';
        } else {
          displayValue = floatValue.toFixed(2);
        }
      } else if ((field.type as string) === 'float64') {
        // Handle empty/null float64 values
        displayValue = '0.00';
      } else {
        displayValue = (value as React.ReactNode) || 'N/A';
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
