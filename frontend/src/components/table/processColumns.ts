import {
  FormField,
  isSortableType,
  shouldRightAlign,
} from 'src/components/form';

import './TypeBasedWidths.css';

export function processColumns<T>(
  columns: FormField<T>[],
  detailCollapsed: boolean,
  actionCount: number,
): FormField<T>[] {
  const getCellStyle = <T>(col: FormField<T>): React.CSSProperties => {
    const textAlign = shouldRightAlign(col.type) ? 'right' : 'left';
    return {
      textAlign,
    };
  };

  const getColumnClass = <T>(col: FormField<T>): string => {
    const baseClass = 'column-type-';
    const type = col.type || 'string';
    return baseClass + type;
  };

  const isSortable = (col: FormField<T>): boolean => {
    return isSortableType(col.type);
  };

  const processedColumns = columns.map((col) => ({
    ...col,
    sortable: isSortable(col),
    style: getCellStyle(col),
    className: getColumnClass(col),
  }));

  const actionsColumn = processedColumns.find((col) => col.key === 'actions');
  const nonActionColumns = processedColumns.filter(
    (col) => col.key !== 'actions',
  );

  const configuredActionsColumn = actionsColumn
    ? {
        ...actionsColumn,
        header: '',
        label: '',
        width: `${actionCount * 30}px`,
        style: {
          ...actionsColumn.style,
          width: `${actionCount * 30}px`,
          maxWidth: `${actionCount * 30}px`,
          minWidth: `${actionCount * 30}px`,
          flex: 'none',
        },
      }
    : null;

  if (detailCollapsed) {
    return configuredActionsColumn
      ? [...nonActionColumns, configuredActionsColumn]
      : nonActionColumns;
  } else {
    const slicedColumns = nonActionColumns.slice(0, 7);
    return configuredActionsColumn
      ? [...slicedColumns, configuredActionsColumn]
      : slicedColumns;
  }
}
