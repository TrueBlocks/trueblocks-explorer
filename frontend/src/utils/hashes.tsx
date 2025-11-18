import React from 'react';

import { OpenLink } from '@app';
import { Anchor } from '@mantine/core';

const _displayHashCache = new Map<string, string>();

export const displayHash = (v: unknown): string => {
  try {
    if (!v) return '';
    if (typeof v === 'string') {
      const s = v.startsWith('0x') ? v : `0x${v}`;
      const cached = _displayHashCache.get(s);
      if (cached) return cached;
      const out = s.length <= 18 ? s : `${s.slice(0, 10)}…${s.slice(-8)}`;
      _displayHashCache.set(s, out);
      if (_displayHashCache.size > 1000) {
        const firstKey = _displayHashCache.keys().next().value;
        if (firstKey) _displayHashCache.delete(firstKey);
      }
      return out;
    }
    const obj = v as { hash?: number[] };
    const arr = obj && Array.isArray(obj.hash) ? obj.hash : undefined;
    if (arr && arr.length > 0) {
      const hex = `0x${arr.map((b) => b.toString(16).padStart(2, '0')).join('')}`;
      if (hex.length <= 18) return hex;
      return `${hex.slice(0, 10)}…${hex.slice(-8)}`;
    }
    const s = String(v);
    if (s.length <= 18) return s;
    return `${s.slice(0, 10)}…${s.slice(-8)}`;
  } catch {
    return String(v || '');
  }
};

/**
 * Convert bytes array to hex string
 */
export const bytesToHex = (bytes: number[]): string => {
  try {
    return '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
};

/**
 * Get full hex string from hash or address object
 */
export const getFullHex = (
  hash: { hash?: number[] } | { address?: number[] } | null | undefined,
): string => {
  if (!hash || typeof hash !== 'object') {
    return '';
  }

  const bytes =
    'hash' in hash ? hash.hash : 'address' in hash ? hash.address : undefined;
  return bytes ? bytesToHex(bytes) : '';
};

/**
 * Create a clickable hash link component
 */
export const createHashLink = (
  hash: { hash?: number[] } | { address?: number[] } | null | undefined,
  type: string = 'hash',
): React.JSX.Element => {
  if (!hash || typeof hash !== 'object') {
    return <span>-</span>;
  }

  const fullHex = getFullHex(hash);
  const displayText = displayHash(hash);

  if (!fullHex || !displayText) {
    return <span>-</span>;
  }

  return (
    <Anchor
      component="button"
      size="sm"
      onClick={() => {
        try {
          OpenLink(type, fullHex);
        } catch (error) {
          console.error('Error opening link:', error);
        }
      }}
    >
      {displayText}
    </Anchor>
  );
};

/**
 * Create a clickable address link component
 */
export const createAddressLink = (address: unknown): React.JSX.Element => {
  if (!address) {
    return <span>-</span>;
  }

  const addressHex =
    typeof address === 'string' ? address : getFullHex(address);
  const displayText = displayHash(address);

  if (!addressHex || !displayText) {
    return <span>-</span>;
  }

  return (
    <Anchor
      component="button"
      size="sm"
      onClick={() => {
        try {
          OpenLink('address', addressHex);
        } catch (error) {
          console.error('Error opening address link:', error);
        }
      }}
    >
      {displayText}
    </Anchor>
  );
};
