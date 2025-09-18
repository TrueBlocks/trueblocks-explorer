import React, { Fragment } from 'react';

import { FieldRenderer, FormField } from '@components';

import './Body.css';

interface BodyProps<T extends Record<string, unknown>> {
  columns: FormField<T>[];
  data: T[];
  selectedRowIndex: number;
  handleRowClick: (index: number) => void;
  noDataMessage?: string;
  onSubmit?: (data: T) => void;
}

export const Body = <T extends Record<string, unknown>>({
  columns,
  data,
  selectedRowIndex,
  handleRowClick,
  noDataMessage = 'No data found.',
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSubmit,
}: BodyProps<T>) => {
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
      {data.map((row, rowIndex) => (
        <Fragment key={rowIndex}>
          <tr
            className={selectedRowIndex === rowIndex ? 'selected' : ''}
            onClick={() => handleRowClick(rowIndex)}
            aria-selected={selectedRowIndex === rowIndex}
          >
            {columns.map((col) => {
              return (
                <td key={col.key} style={col.style}>
                  <FieldRenderer
                    field={
                      {
                        type: col.type || 'text',
                        value: (col.key !== undefined
                          ? row[col.key as keyof T]
                          : '') as string,
                        customRender: col.render
                          ? col.render(row, rowIndex)
                          : undefined,
                      } as FormField<Record<string, unknown>>
                    }
                    mode="display"
                    tableCell
                  />
                </td>
              );
            })}
          </tr>
        </Fragment>
      ))}
    </>
  );
};
