import { FormField } from 'src/components/form';

export function processColumns<T>(columns: FormField<T>[]): FormField<T>[] {
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

  return columns.map((col) => ({
    ...col,
    sortable: isSortable(col),
    style: getCellStyle(col),
  }));
}
