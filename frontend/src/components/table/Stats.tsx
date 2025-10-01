import React from 'react';

import { StyledText } from '@components';
import { project } from '@models';
import { usePagination } from 'src/components/table/usePagination';

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

  const startRecord = currentPage * pageSize + (nRecords > 0 ? 1 : 0);
  const endRecord = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <tfoot>
      <tr>
        <td colSpan={nCols}>
          <StyledText variant="dimmed" size="sm">
            {`Showing ${startRecord} to ${endRecord} of ${totalItems} entries`}
          </StyledText>
        </td>
      </tr>
    </tfoot>
  );
};
