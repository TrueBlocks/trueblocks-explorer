import React from 'react';

import { project } from '@models';
import { usePagination } from 'src/components/table/usePagination';

import './Stats.css';

// StatsProps defines the props for the Stats component.
interface StatsProps {
  nRecords: number;
  nCols: number;
  viewStateKey: project.ViewStateKey;
}

// Stats displays a summary of the current entries being shown in the table.
export const Stats = ({ nRecords, nCols, viewStateKey }: StatsProps) => {
  const { pagination } = usePagination(viewStateKey);
  const { currentPage, pageSize, totalItems } = pagination;
  return (
    <tfoot className="showing-entries">
      <tr>
        <td colSpan={nCols}>
          Showing {currentPage * pageSize + (nRecords > 0 ? 1 : 0)} to{' '}
          {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems}{' '}
          entries
        </td>
      </tr>
    </tfoot>
  );
};
