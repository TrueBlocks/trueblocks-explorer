import React from 'react';

import { TableProvider, useTableContext } from '@components';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const Consumer = () => {
  const ctx = useTableContext();
  return (
    <div>
      <span>focusState:{ctx.focusState}</span>
      <span>selectedRowIndex:{ctx.selectedRowIndex}</span>
      <span>tableRef:{ctx.tableRef ? 'ok' : 'missing'}</span>
    </div>
  );
};

describe('TableContext', () => {
  it('provides default context values', () => {
    render(
      <TableProvider>
        <Consumer />
      </TableProvider>,
    );
    expect(screen.getByText('focusState:table')).toBeInTheDocument();
    expect(screen.getByText('selectedRowIndex:-1')).toBeInTheDocument();
    expect(screen.getByText(/tableRef:ok/)).toBeInTheDocument();
  });
});
