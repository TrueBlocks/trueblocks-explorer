import { ReactNode } from 'react';

import {
  DataDisplayType,
  DisplayRendererProps,
  ErrorRenderer,
  FormField,
  shouldRightAlign as shouldRightAlignType,
} from '@components';
import { displayHash } from '@utils';

import {
  BooleanRenderer,
  CheckmarkRenderer,
  DateTimeRenderer,
  EtherRenderer,
  FileSizeRenderer,
  NamedAddressRenderer,
  PopoverRenderer,
  WeiRenderer,
} from './FieldRenderer.renderers';
import {
  formatNumberWithFallback,
  formatWeiToGigawei,
  isNullOrEmpty,
  safeToNumber,
  withFallback,
} from './utils';

// Consolidated render context enum combining mode and tableCell
export enum RenderContext {
  TABLE_CELL = 'table-cell', // Display mode in table cell (with alignment)
  DETAIL_VIEW = 'detail-view', // Display mode in detail panel (no alignment)
  FORM_EDIT = 'form-edit', // Edit mode in forms
}

export interface TypeRendererConfig {
  displayRenderer: (value: unknown, props: DisplayRendererProps) => ReactNode;
  editPlaceholder?: string;
  editHint?: string;
}

export const TYPE_RENDERER_REGISTRY: Record<string, TypeRendererConfig> = {
  // Blockchain-specific numeric types (preserved from CSV)
  blknum: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    editPlaceholder: 'Block number (e.g., 18000000)',
    editHint: 'Enter blockchain block number',
  },
  txnum: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    editPlaceholder: 'Transaction index (e.g., 42)',
    editHint: 'Enter transaction index within block',
  },
  lognum: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    editPlaceholder: 'Log index (e.g., 15)',
    editHint: 'Enter log index within transaction',
  },
  // Blockchain addresses and hashes
  address: {
    displayRenderer: (value) => {
      const addr = String(value || '');
      if (!addr || addr === '0x0000000000000000000000000000000000000000') {
        return '0x0';
      }
      return addr;
    },
    editPlaceholder: '0x1234567890abcdef1234567890abcdef12345678',
    editHint: 'Enter Ethereum address (42 characters starting with 0x)',
  },
  hash: {
    displayRenderer: (value, { context }) => {
      const hashStr = String(value || '');
      return context === RenderContext.TABLE_CELL
        ? displayHash(hashStr)
        : hashStr;
    },
    editPlaceholder:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    editHint: 'Enter hash value (66 characters starting with 0x)',
  },
  bytes: {
    displayRenderer: (value) => {
      const bytesStr = String(value || '');
      if (!bytesStr || bytesStr === '0x') return '0x';
      return bytesStr;
    },
    editPlaceholder: '0x1234abcd',
    editHint: 'Enter hex bytes (starting with 0x)',
  },
  // Numeric types (preserved semantic meaning)
  int256: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const str = String(value);
      // For very large numbers, display as-is to avoid precision loss
      if (str.length > 15) return str;
      const num = safeToNumber(value);
      return isNaN(num) ? str : num.toLocaleString();
    },
    editPlaceholder: 'Large integer (e.g., 1000000000000000000)',
    editHint: 'Enter 256-bit signed integer',
  },
  int64: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    editPlaceholder: 'Integer (e.g., 1234567890)',
    editHint: 'Enter 64-bit signed integer',
  },
  uint64: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    editPlaceholder: 'Positive integer (e.g., 1234567890)',
    editHint: 'Enter 64-bit unsigned integer',
  },
  value: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    editPlaceholder: 'Numeric value (e.g., 42000)',
    editHint: 'Enter numeric value',
  },
  float: {
    displayRenderer: (value) => formatNumberWithFallback(value, 6, '0.000000'),
    editPlaceholder: 'Decimal number (e.g., 123.456789)',
    editHint: 'Enter floating point number',
  },
  // Special blockchain types
  blkrange: {
    displayRenderer: (value) => String(value || ''),
    editPlaceholder: '18000000-18001000',
    editHint: 'Enter block range (e.g., start-end)',
  },
  ipfsHash: {
    displayRenderer: (value, { context }) => {
      const hashStr = String(value || '');
      return context === RenderContext.TABLE_CELL
        ? displayHash(hashStr)
        : hashStr;
    },
    editPlaceholder: 'QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    editHint: 'Enter IPFS hash',
  },
  path: {
    displayRenderer: (value) => String(value || ''),
    editPlaceholder: '/path/to/file.ext',
    editHint: 'Enter file path',
  },
  actions: {
    displayRenderer: () => '', // Actions are handled specially by ActionRenderer
  },
  // Existing types (preserved)
  wei: {
    displayRenderer: (value) => <WeiRenderer value={value} />,
    editPlaceholder: 'Wei value (e.g., 1000000000000000000 for 1 ETH)',
    editHint: 'Enter value in Wei (smallest unit of Ether)',
  },
  ether: {
    displayRenderer: (value) => <EtherRenderer value={value} />,
    editPlaceholder: 'Ether value (e.g., 1.000000)',
    editHint: 'Enter value in Ether (will be displayed as entered)',
  },
  gas: {
    displayRenderer: (value) =>
      value ? formatWeiToGigawei(value as string) : '0.000',
    editPlaceholder: 'Wei value (e.g., 21000000000000 for 21 Gwei)',
    editHint: 'Enter value in Wei (will display as Gigawei)',
  },
  timestamp: {
    displayRenderer: (value) => <DateTimeRenderer value={value} />,
  },
  fileSize: {
    displayRenderer: (value) => <FileSizeRenderer value={value} />,
  },
  number: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) {
        return '0';
      }
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
  },
  error: {
    displayRenderer: (value, { context }) => (
      <ErrorRenderer
        value={value}
        tableCell={context === RenderContext.TABLE_CELL}
      />
    ),
  },
  boolean: {
    displayRenderer: (value, { context }) => (
      <BooleanRenderer
        value={value}
        tableCell={context === RenderContext.TABLE_CELL}
      />
    ),
  },
  checkmark: {
    displayRenderer: (value, { context }) => (
      <CheckmarkRenderer
        value={value}
        tableCell={context === RenderContext.TABLE_CELL}
      />
    ),
  },
  identifier: {
    displayRenderer: (value, { rowData }) => (
      <PopoverRenderer
        value={value}
        rowData={rowData}
        popFields={[
          { key: 'timestamp', label: 'timestamp', type: 'string' },
          {
            key: 'transactionHash|hash',
            label: 'txHash',
            type: 'hash',
          },
          { key: 'blockHash', label: 'blockHash', type: 'blockHash' },
          { key: 'sender', label: 'sender', type: 'address' },
          { key: 'recipient', label: 'recipient', type: 'address' },
          { key: 'asset', label: 'asset', type: 'address' },
        ]}
      />
    ),
  },
  namedAddress: {
    displayRenderer: (value, { context, rowData, field }) => {
      return (
        <NamedAddressRenderer
          value={value}
          rowData={rowData}
          field={field}
          tableCell={context === RenderContext.TABLE_CELL}
        />
      );
    },
  },
  float64: {
    displayRenderer: (value) => formatNumberWithFallback(value, 2, '0.00'),
  },
  datetime: {
    displayRenderer: (value, { field, keyProp }) => (
      <DateTimeRenderer value={value} field={field} keyProp={keyProp || ''} />
    ),
  },
};

export function getTypeRenderer(type: string): TypeRendererConfig | null {
  // Handle case variations
  const normalizedType = type?.toLowerCase();
  if (normalizedType === 'timestamp') {
    return TYPE_RENDERER_REGISTRY.timestamp || null;
  }

  return TYPE_RENDERER_REGISTRY[type] || null;
}

export function getDefaultRenderer(): TypeRendererConfig {
  return {
    displayRenderer: (value) => withFallback(value, 'N/A'),
  };
}

// Helper functions using centralized type system

export function supportsTableAlignment(type?: string): boolean {
  // Table alignment is supported for numeric types that right-align
  return shouldRightAlignType(type as DataDisplayType);
}

export function supportsDetailView(
  field?: FormField<Record<string, unknown>>,
): boolean {
  // Use CSV-derived properties instead of hardcoded config
  // If field has detailOnly=true, it supports detail view
  // If field has showInDetail=false, it doesn't support detail view
  if (field?.detailOnly) return true;
  if (field?.showInDetail === false) return false;

  // Most types support detail view by default (only actions typically don't)
  return field?.type !== 'actions';
}

// Helper function to determine RenderContext from legacy parameters
export function getDisplayContext(
  mode: 'display' | 'edit',
  tableCell?: boolean,
): RenderContext {
  if (mode === 'edit') {
    return RenderContext.FORM_EDIT;
  }

  if (mode === 'display') {
    return tableCell === false
      ? RenderContext.DETAIL_VIEW
      : RenderContext.TABLE_CELL;
  }

  return RenderContext.TABLE_CELL; // Default fallback
}
