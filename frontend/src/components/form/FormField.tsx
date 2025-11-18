import { ChangeEvent, ReactNode } from 'react';

// HTML form input types (for form controls only)
export type FormInputType =
  | 'text'
  | 'number'
  | 'password'
  | 'checkbox'
  | 'radio'
  | 'button'
  | 'textarea'
  | 'select';

export type DataDisplayType =
  // Core blockchain types (from CSV)
  | 'address'
  | 'hash'
  | 'wei'
  | 'gas'
  | 'timestamp'
  | 'datetime'
  | 'blknum'
  | 'txnum'
  | 'lognum'
  | 'blkrange'
  // Data types (from CSV)
  | 'string'
  | 'boolean'
  | 'bytes'
  | 'int256'
  | 'uint64'
  | 'int64'
  | 'value'
  | 'float64'
  | 'float'
  // Special types (from CSV)
  | 'path'
  | 'url'
  | 'ipfsHash'
  | 'topic'
  | 'Function'
  | 'fileSize'
  // Synthetic types (FieldRenderer)
  | 'identifier'
  | 'ether'
  | 'actions'
  | 'namedAddress'
  | 'checkmark'
  // Legacy/compatibility
  | 'custom';

// Centralized type categorization system
export const NUMERIC_TYPES: Set<DataDisplayType> = new Set([
  'blknum',
  'txnum',
  'lognum',
  'wei',
  'gas',
  'ether',
  'int256',
  'uint64',
  'int64',
  'value',
  'float64',
  'float',
  'fileSize',
  'timestamp',
  'datetime',
]);

export const SORTABLE_TYPES: Set<DataDisplayType> = new Set([
  'address',
  'blkrange',
  'boolean',
  'ether',
  'float',
  'float64',
  'hash',
  'int256',
  'int64',
  'string',
  'uint64',
  'value',
  'blknum',
  'txnum',
  'lognum',
  'wei',
  'gas',
  'timestamp',
  'datetime',
  'fileSize',
  'ipfsHash',
]);

// Type utility functions
export const isNumericType = (type?: DataDisplayType): boolean => {
  return type ? NUMERIC_TYPES.has(type) : false;
};

export const shouldRightAlign = (type?: DataDisplayType): boolean => {
  return isNumericType(type);
};

export const isSortableType = (type?: DataDisplayType): boolean => {
  return type ? SORTABLE_TYPES.has(type) : false;
};

// Form value conversion functions by type
export const convertFormValue = (
  value: unknown,
  type?: DataDisplayType | FormInputType,
): unknown => {
  if (value === null || value === undefined) return value;

  const safeStringToNumber = (val: unknown): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') return 0;
      const parsed = Number(trimmed);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const safeToBoolean = (val: unknown): boolean => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      return (
        lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on'
      );
    }
    if (typeof val === 'number') return val !== 0;
    return false;
  };

  switch (type) {
    // Numeric data types
    case 'blknum':
    case 'txnum':
    case 'lognum':
    case 'gas':
    case 'timestamp':
    case 'value':
    case 'uint64':
    case 'int64':
    case 'int256':
    case 'float64':
    case 'float':
    case 'fileSize':
    // Form input types that should be numeric
    case 'number':
      return safeStringToNumber(value);

    // Boolean types
    case 'boolean':
    case 'checkbox':
      return safeToBoolean(value);

    // String-based types (both data and form input types)
    case 'string':
    case 'address':
    case 'hash':
    case 'wei':
    case 'ether':
    case 'bytes':
    case 'path':
    case 'url':
    case 'ipfsHash':
    case 'topic':
    case 'Function':
    case 'blkrange':
    case 'datetime':
    case 'identifier':
    case 'actions':
    case 'custom':
    case 'text':
    case 'password':
    case 'textarea':
    case 'select':
    case 'radio':
    case 'button':
    default:
      return value !== null && value !== undefined ? String(value) : value;
  }
};

export interface FormField<T = Record<string, unknown>> {
  name?: string;
  key?: string;
  header?: string;
  value?: string | number | boolean;
  label?: string;
  section?: string;
  showInDetail?: boolean;
  detailLabel?: string;
  detailOrder?: number;
  detailOnly?: boolean;
  detailFormat?:
    | 'hash'
    | 'address'
    | 'bytes'
    | 'json'
    | 'ether'
    | 'gas'
    | 'value';
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  rightSection?: ReactNode;
  hint?: string;
  visible?: boolean | ((formData: T) => boolean);
  objType?: string;
  type?: DataDisplayType;
  inputType?: FormInputType;
  fields?: FormField<T>[];
  isButtonGroup?: boolean;
  buttonAlignment?: 'left' | 'center' | 'right';
  customRender?: ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  sameLine?: boolean;
  flex?: number;
  editable?: boolean;
  width?: string | number;
  className?: string;
  sortable?: boolean;
  style?: React.CSSProperties;
  render?: (row: T, rowIndex: number) => ReactNode;
}
