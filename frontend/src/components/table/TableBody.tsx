import React, { Fragment } from 'react';

import { FieldRenderer, FormField } from '@components';
import { getNestedProperty, isNestedProperty } from '@utils';

import './TableBody.css';

interface TableBodyProps<T extends Record<string, unknown>> {
  columns: FormField<T>[];
  data: T[];
  selectedRowIndex: number;
  handleRowClick: (index: number) => void;
  noDataMessage?: string;
  onSubmit?: (data: T) => void;
}

export const TableBody = <T extends Record<string, unknown>>({
  columns,
  data,
  selectedRowIndex,
  handleRowClick,
  noDataMessage = 'No data found.',
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSubmit,
}: TableBodyProps<T>) => {
  if (data.length === 0) {
    return (
      <tr className="selected">
        <td colSpan={columns.length} className="no-data-cell">
          {noDataMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((row, rowIndex) => {
        const isSelected = selectedRowIndex === rowIndex;
        return (
          <Fragment key={rowIndex}>
            <tr
              onClick={() => handleRowClick(rowIndex)}
              aria-selected={isSelected}
              style={{
                backgroundColor: isSelected
                  ? 'var(--mantine-color-gray-2)'
                  : 'transparent',
                borderLeft: isSelected
                  ? '3px solid var(--mantine-color-primary-6)'
                  : 'none',
                borderRadius: isSelected ? 'var(--mantine-radius-sm)' : 'none',
                cursor: 'pointer',
              }}
            >
              {columns.map((col, colIndex) => {
                // Determine borders for body cells
                const isLastRow = rowIndex === data.length - 1;
                let cellBorders: React.CSSProperties = {};

                // All rows: add left border to first column, right border to last column
                if (colIndex === 0) {
                  cellBorders.borderLeft = '3px solid blue';
                }
                if (colIndex === columns.length - 1) {
                  cellBorders.borderRight = '3px solid blue';
                }

                // Last row only: add bottom border to all columns
                if (isLastRow) {
                  cellBorders.borderBottom = '3px solid blue';
                }
                return (
                  <td
                    key={col.key}
                    style={{
                      ...col.style,
                      ...cellBorders,
                    }}
                    className={col.className}
                  >
                    <FieldRenderer
                      field={
                        {
                          key: col.key as string,
                          type: col.type || 'text',
                          value: (col.key !== undefined
                            ? isNestedProperty(col.key)
                              ? getNestedProperty(row, col.key)
                              : row[col.key as keyof T]
                            : '') as string,
                          customRender: col.render
                            ? col.render(row, rowIndex)
                            : undefined,
                        } as FormField<Record<string, unknown>>
                      }
                      row={row as Record<string, unknown>}
                      mode="display"
                    />
                  </td>
                );
              })}
            </tr>
          </Fragment>
        );
      })}
    </>
  );
};
