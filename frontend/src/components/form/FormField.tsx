import { ChangeEvent, ReactNode } from 'react';

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
  type?:
    | 'text'
    | 'number'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'button'
    | 'textarea'
    | 'select'
    | 'ether'
    | 'address'
    | 'timestamp'
    | 'gas'
    | 'button'
    | 'wei'
    | 'int256'
    | 'lognum'
    | 'txnum'
    | 'hash'
    | 'value'
    | 'bytes'
    | 'blknum'
    | 'blkrange'
    | 'ipfshash'
    | 'float64'
    | 'float'
    | 'topic'
    | 'ipfsHash'
    | 'datetime'
    | 'Function'
    | 'fileSize'
    | 'boolean'
    | 'custom';
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
