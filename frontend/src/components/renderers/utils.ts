import { isValidElement } from 'react';

import { LogError } from '@utils';

export function formatWeiToEther(weiValue: string | number): string {
  if (weiValue === null || weiValue === undefined || weiValue === '') {
    return '[null]';
  }

  if (weiValue === '0' || weiValue === 0) {
    return '-';
  }

  try {
    const wei = BigInt(weiValue.toString());
    const etherWei = BigInt('1000000000000000000'); // 10^18

    const etherInt = wei / etherWei;
    const remainder = wei % etherWei;

    const remainderStr = remainder.toString().padStart(18, '0');
    const first6Decimals = remainderStr.slice(0, 6);
    const seventh7thDecimal = remainderStr[6];

    let decimalValue = parseInt(first6Decimals, 10);

    if (seventh7thDecimal && parseInt(seventh7thDecimal, 10) >= 5) {
      decimalValue += 1;
    } else if (remainder > BigInt(first6Decimals.padEnd(18, '0'))) {
      const beyondSixth = remainderStr.slice(6);
      if (beyondSixth && parseInt(beyondSixth, 10) > 0) {
        decimalValue += 1;
      }
    }

    if (decimalValue >= 1000000) {
      return `${(etherInt + BigInt(1)).toString()}.000000`;
    }
    const formattedDecimal = decimalValue.toString().padStart(6, '0');

    return `${etherInt.toString()}.${formattedDecimal}`;
  } catch (error) {
    LogError(`Formatting Wei to Ether: ${error}`);
    return `${weiValue}`;
  }
}

export function formatWeiToGigawei(weiValue: string | number): string {
  if (!weiValue || weiValue === '0') {
    return '0.000';
  }

  try {
    const wei = BigInt(weiValue.toString());
    const gigaweiWei = BigInt('1000000000'); // 10^9 (1 Gigawei = 1 billion wei)

    const gigaweiInt = wei / gigaweiWei;
    const remainder = wei % gigaweiWei;

    const remainderStr = remainder.toString().padStart(9, '0');
    const first3Decimals = remainderStr.slice(0, 3);
    const fourth4thDecimal = remainderStr[3];

    let decimalValue = parseInt(first3Decimals, 10);

    if (fourth4thDecimal && parseInt(fourth4thDecimal, 10) >= 5) {
      decimalValue += 1;
    } else if (remainder > BigInt(first3Decimals.padEnd(9, '0'))) {
      const beyondFourth = remainderStr.slice(4);
      if (beyondFourth && parseInt(beyondFourth, 10) > 0) {
        decimalValue += 1;
      }
    }

    if (decimalValue >= 1000) {
      return `${(gigaweiInt + BigInt(1)).toString()}.000`;
    }

    const formattedDecimal = decimalValue.toString().padStart(3, '0');

    return `${gigaweiInt.toString()}.${formattedDecimal}`;
  } catch (error) {
    LogError(`Formatting Wei to Gigawei: ${error}`);
    return `${weiValue}`;
  }
}

export function isNullOrEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export function isEmptyValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'undefined' ||
    value === 'null'
  );
}

export function safeToNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }
  return NaN;
}

export function safeToFloat(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    return parseFloat(value);
  }
  return NaN;
}

export function formatTimestamp(timestamp: number | string): string {
  const numTimestamp = safeToNumber(timestamp);
  if (isNaN(numTimestamp) || numTimestamp <= 0) {
    return 'No timestamp';
  }
  return new Date(numTimestamp * 1000).toLocaleString(undefined, {
    hour12: false,
  });
}

export function extractTimestamp(obj: Record<string, unknown>): number | null {
  // Check common timestamp property names
  const timestampKeys = ['timestamp', 'time', 'blockTimestamp', 'date'];

  for (const key of timestampKeys) {
    if (key in obj && typeof obj[key] === 'number') {
      return obj[key] as number;
    }
  }

  // Try to convert the object itself to a number
  try {
    const numValue = Number(obj);
    if (!isNaN(numValue) && numValue > 0) {
      return numValue;
    }
  } catch {
    // Ignore conversion errors
  }

  return null;
}

export function safeToString(value: unknown): string {
  if (isEmptyValue(value)) {
    return '';
  }

  if (isValidElement(value)) {
    return '[React Element]';
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export function withFallback<T>(value: unknown, fallback: T): T | string {
  if (isEmptyValue(value)) {
    return fallback;
  }
  return safeToString(value);
}

export function formatNumberWithFallback(
  value: unknown,
  decimalPlaces: number,
  fallback: string = '0',
): string {
  const num = safeToNumber(value);
  if (isNaN(num)) {
    return fallback;
  }
  return num.toFixed(decimalPlaces);
}

export const MAX_UINT256_PREFIX = '1157920892373161954235709850086879078532';

export function isInfiniteValue(value: string): boolean {
  return !!value && value.startsWith(MAX_UINT256_PREFIX);
}
