import React from 'react';

import { FormField, Table, TableProvider } from '@components';
import { project } from '@models';

import './BaseTab.css';

interface BaseTabProps<T extends Record<string, unknown>> {
  data: T[];
  columns: FormField<T>[];
  viewStateKey: project.ViewStateKey;
  loading: boolean;
  error: Error | null;
  onSubmit?: (formData: T) => void;
  onDelete?: (rowData: T) => void;
  onRemove?: (rowData: T) => void;
  onAutoname?: (rowData: T) => void;
  headerActions?: React.ReactNode;
  detailPanel: (rowData: T | null) => React.ReactNode;
}

export function BaseTab<T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  error: _error,
  onSubmit,
  onDelete,
  onRemove,
  onAutoname,
  viewStateKey,
  headerActions,
  detailPanel,
}: BaseTabProps<T>) {
  return (
    <TableProvider>
      <div className="tableContainer">
        <Table
          data={data}
          columns={columns}
          viewStateKey={viewStateKey}
          loading={loading}
          onSubmit={onSubmit || (() => {})}
          onDelete={onDelete}
          onRemove={onRemove}
          onAutoname={onAutoname}
          headerActions={headerActions}
          detailPanel={detailPanel}
        />
      </div>
    </TableProvider>
  );
}
