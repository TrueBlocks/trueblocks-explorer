import { ReactNode } from 'react';

import { FormField } from '@components';

import {
  BooleanRenderer,
  DateTimeRenderer,
  EtherRenderer,
  FileSizeRenderer,
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
  shouldRightAlign: boolean;
  editPlaceholder?: string;
  editHint?: string;
  // Context-specific rendering options
  supportsTableAlignment?: boolean;
  supportsDetailView?: boolean;
}

export interface DisplayRendererProps {
  context: RenderContext;
  rowData?: Record<string, unknown>;
  field?: FormField<Record<string, unknown>>;
  keyProp?: string | number;
}

export const TYPE_RENDERER_REGISTRY: Record<string, TypeRendererConfig> = {
  // Blockchain-specific numeric types (preserved from CSV)
  blknum: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    editPlaceholder: 'Block number (e.g., 18000000)',
    editHint: 'Enter blockchain block number',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  txnum: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    editPlaceholder: 'Transaction index (e.g., 42)',
    editHint: 'Enter transaction index within block',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  lognum: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    editPlaceholder: 'Log index (e.g., 15)',
    editHint: 'Enter log index within transaction',
    supportsTableAlignment: true,
    supportsDetailView: true,
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
    shouldRightAlign: false,
    editPlaceholder: '0x1234567890abcdef1234567890abcdef12345678',
    editHint: 'Enter Ethereum address (42 characters starting with 0x)',
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  hash: {
    displayRenderer: (value) => String(value || ''),
    shouldRightAlign: false,
    editPlaceholder:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    editHint: 'Enter hash value (66 characters starting with 0x)',
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  bytes: {
    displayRenderer: (value) => {
      const bytesStr = String(value || '');
      if (!bytesStr || bytesStr === '0x') return '0x';
      return bytesStr;
    },
    shouldRightAlign: false,
    editPlaceholder: '0x1234abcd',
    editHint: 'Enter hex bytes (starting with 0x)',
    supportsTableAlignment: false,
    supportsDetailView: true,
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
    shouldRightAlign: true,
    editPlaceholder: 'Large integer (e.g., 1000000000000000000)',
    editHint: 'Enter 256-bit signed integer',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  int64: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    editPlaceholder: 'Integer (e.g., 1234567890)',
    editHint: 'Enter 64-bit signed integer',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  uint64: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    editPlaceholder: 'Positive integer (e.g., 1234567890)',
    editHint: 'Enter 64-bit unsigned integer',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  value: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) return '0';
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    editPlaceholder: 'Numeric value (e.g., 42000)',
    editHint: 'Enter numeric value',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  float: {
    displayRenderer: (value) => formatNumberWithFallback(value, 6, '0.000000'),
    shouldRightAlign: true,
    editPlaceholder: 'Decimal number (e.g., 123.456789)',
    editHint: 'Enter floating point number',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  // Special blockchain types
  blkrange: {
    displayRenderer: (value) => String(value || ''),
    shouldRightAlign: false,
    editPlaceholder: '18000000-18001000',
    editHint: 'Enter block range (e.g., start-end)',
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  ipfshash: {
    displayRenderer: (value) => String(value || ''),
    shouldRightAlign: false,
    editPlaceholder: 'QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    editHint: 'Enter IPFS hash',
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  path: {
    displayRenderer: (value) => String(value || ''),
    shouldRightAlign: false,
    editPlaceholder: '/path/to/file.ext',
    editHint: 'Enter file path',
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  actions: {
    displayRenderer: () => '', // Actions are handled specially by ActionRenderer
    shouldRightAlign: false,
    supportsTableAlignment: false,
    supportsDetailView: false,
  },
  // Existing types (preserved)
  wei: {
    displayRenderer: (value) => <WeiRenderer value={value} />,
    shouldRightAlign: true,
    editPlaceholder: 'Wei value (e.g., 1000000000000000000 for 1 ETH)',
    editHint: 'Enter value in Wei (smallest unit of Ether)',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  ether: {
    displayRenderer: (value) => <EtherRenderer value={value} />,
    shouldRightAlign: true,
    editPlaceholder: 'Ether value (e.g., 1.000000)',
    editHint: 'Enter value in Ether (will be displayed as entered)',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  gas: {
    displayRenderer: (value) =>
      value ? formatWeiToGigawei(value as string) : '0.000',
    shouldRightAlign: true,
    editPlaceholder: 'Wei value (e.g., 21000000000000 for 21 Gwei)',
    editHint: 'Enter value in Wei (will display as Gigawei)',
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  timestamp: {
    displayRenderer: (value) => <DateTimeRenderer value={value} />,
    shouldRightAlign: false,
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  fileSize: {
    displayRenderer: (value) => <FileSizeRenderer value={value} />,
    shouldRightAlign: true,
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  number: {
    displayRenderer: (value) => {
      if (isNullOrEmpty(value)) {
        return '0';
      }
      const num = safeToNumber(value);
      return isNaN(num) ? '0' : num.toLocaleString();
    },
    shouldRightAlign: true,
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  boolean: {
    displayRenderer: (value, { context }) => (
      <BooleanRenderer
        value={value}
        tableCell={context === RenderContext.TABLE_CELL}
      />
    ),
    shouldRightAlign: false,
    supportsTableAlignment: false,
    supportsDetailView: true,
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
    shouldRightAlign: false,
    supportsTableAlignment: false,
    supportsDetailView: true,
  },
  float64: {
    displayRenderer: (value) => formatNumberWithFallback(value, 2, '0.00'),
    shouldRightAlign: true,
    supportsTableAlignment: true,
    supportsDetailView: true,
  },
  datetime: {
    displayRenderer: (value, { field, keyProp }) => (
      <DateTimeRenderer value={value} field={field} keyProp={keyProp || ''} />
    ),
    shouldRightAlign: false,
    supportsTableAlignment: false,
    supportsDetailView: true,
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
    shouldRightAlign: false,
    supportsTableAlignment: false,
    supportsDetailView: true,
  };
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
