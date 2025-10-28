import { FormField } from 'src/components/form';

export function processColumns<T>(
  columns: FormField<T>[],
  detailCollapsed: boolean,
  actionCount: number,
): FormField<T>[] {
  const getCellStyle = <T>(col: FormField<T>): React.CSSProperties => {
    const rightAlignTypes = new Set<string>([
      'blknum',
      'bool',
      'bytes',
      'datetime',
      'ether',
      'float',
      'float64',
      'gas',
      'hash',
      'int256',
      'int64',
      'lognum',
      'number',
      'timestamp',
      'txnum',
      'uint32',
      'uint64',
      'wei',
      'value',
    ]);
    const textAlign = rightAlignTypes.has(col.type || '') ? 'right' : 'left';
    return {
      ...(col.width ? { width: col.width } : undefined),
      textAlign,
    };
  };

  const isSortable = (col: FormField<T>): boolean => {
    const sortableTypes = [
      'RangeDates',
      'address',
      'blkrange',
      'bool',
      'ether',
      'float',
      'float64',
      'hash',
      'int',
      'int256',
      'int64',
      'ipfshash',
      'number',
      'string',
      'text',
      'uint32',
      'uint64',
      'value',
    ];
    return sortableTypes.includes(col.type as unknown as string);
  };

  const processedColumns = columns.map((col) => ({
    ...col,
    sortable: isSortable(col),
    style: getCellStyle(col),
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
    const slicedColumns = nonActionColumns.slice(0, 6);
    return configuredActionsColumn
      ? [...slicedColumns, configuredActionsColumn]
      : slicedColumns;
  }
}
