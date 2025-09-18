import { project } from '@models';
import { usePagination } from 'src/components/table/usePagination';

import './PerPage.css';

// PerPageProps defines the props for the PerPage component.
interface PerPageProps {
  pageSize: number;
  viewStateKey: project.ViewStateKey;
  focusTable: () => void;
  focusControls: () => void;
}

// PerPage renders a page size selector for the table, allowing the user to change the number of rows displayed per page.
export const PerPage = ({
  pageSize,
  viewStateKey,
  focusTable,
  focusControls,
}: PerPageProps) => {
  const { changePageSize } = usePagination(viewStateKey);
  return (
    <div className="page-size-selector">
      <select
        value={pageSize}
        onChange={(e) => {
          changePageSize(Number(e.target.value));
          setTimeout(focusTable, 100);
        }}
        aria-label="Items per page"
        onFocus={focusControls}
      >
        {[15, 30, 50, 100].map((size, index) => (
          <option key={size} value={size}>
            {size + (index === 0 ? ' per page' : '')}
          </option>
        ))}
      </select>
    </div>
  );
};
