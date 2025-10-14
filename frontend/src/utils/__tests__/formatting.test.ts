import { describe, expect, it } from 'vitest';

import { formatBytes, formatNumericValue } from '../formatting';

describe('formatBytes', () => {
  it('formats zero bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 b');
    expect(formatBytes('0')).toBe('0 b');
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(100)).toBe('100 b');
    expect(formatBytes(512)).toBe('512 b');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 kb');
    expect(formatBytes(2048)).toBe('2 kb');
    expect(formatBytes(51200)).toBe('50 kb'); // 50 * 1024
  });

  it('formats large kilobytes as megabytes', () => {
    expect(formatBytes(150 * 1024)).toBe('0.15 mb'); // > 100kb becomes mb
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 mb');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 mb');
  });

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 gb');
    expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe('2.5 gb');
  });

  it('handles invalid input gracefully', () => {
    expect(formatBytes('invalid')).toBe('0 b');
    expect(formatBytes(NaN)).toBe('0 b');
  });
});

describe('formatNumericValue', () => {
  it('formats regular numbers with locale', () => {
    expect(formatNumericValue(1000)).toBe('1,000');
    expect(formatNumericValue(1234567)).toBe('1,234,567');
  });

  it('formats bytes when bytes option is true', () => {
    expect(formatNumericValue(1024, { bytes: true })).toBe('1 kb');
    expect(formatNumericValue(1073741824, { bytes: true })).toBe('1 gb');
  });

  it('formats decimals with specified precision', () => {
    expect(formatNumericValue(1234.5678, { decimals: 2 })).toBe('1,234.57');
    expect(formatNumericValue(1000.123, { decimals: 0 })).toBe('1,000');
  });

  it('handles string numbers', () => {
    expect(formatNumericValue('1000')).toBe('1,000');
    expect(formatNumericValue('1024', { bytes: true })).toBe('1 kb');
  });

  it('handles invalid input gracefully', () => {
    expect(formatNumericValue('invalid')).toBe('invalid');
    expect(formatNumericValue('invalid', { bytes: true })).toBe('0 b');
  });
});
