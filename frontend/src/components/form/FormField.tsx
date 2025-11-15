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
  // Legacy/compatibility
  | 'custom';

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
