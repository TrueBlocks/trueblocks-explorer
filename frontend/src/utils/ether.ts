/**
 * Utility functions for converting Wei values to Ether display format
 */
import { LogError } from '@utils';

/**
 * Converts a Wei value (as string) to Ether with appropriate formatting
 * @param weiValue - The Wei value as a string
 * @returns Formatted Ether value as string with exactly 5 decimal places, rounded up
 */
export function formatWeiToEther(weiValue: string | number): string {
  if (!weiValue || weiValue === '0') {
    return '0.00000';
  }

  try {
    // Convert to BigInt to handle large numbers safely
    const wei = BigInt(weiValue.toString());
    const etherWei = BigInt('1000000000000000000'); // 10^18

    // Calculate ether as integer part and remainder
    const etherInt = wei / etherWei;
    const remainder = wei % etherWei;

    // Convert remainder to decimal string with full precision
    const remainderStr = remainder.toString().padStart(18, '0');

    // Get the first 5 decimal places for rounding
    const first5Decimals = remainderStr.slice(0, 5);
    const fifth5thDecimal = remainderStr[5];

    // Convert to number for rounding calculation
    let decimalValue = parseInt(first5Decimals, 10);

    // Round up if the 4th decimal is 5 or greater, or if there are any non-zero digits after
    if (fifth5thDecimal && parseInt(fifth5thDecimal, 10) >= 5) {
      decimalValue += 1;
    } else if (remainder > BigInt(first5Decimals.padEnd(18, '0'))) {
      // Check if there are any non-zero digits beyond the 4th decimal
      const beyondFourth = remainderStr.slice(4);
      if (beyondFourth && parseInt(beyondFourth, 10) > 0) {
        decimalValue += 1;
      }
    }

    // Handle carry-over if rounding goes to 1000
    if (decimalValue >= 1000) {
      return `${(etherInt + BigInt(1)).toString()}.000`;
    }

    // Format with exactly 5 decimal places
    const formattedDecimal = decimalValue.toString().padStart(5, '0');

    return `${etherInt.toString()}.${formattedDecimal}`;
  } catch (error) {
    LogError(`Formatting Wei to Ether: ${error}`);
    return `${weiValue}`;
  }
}

/**
 * Validates if a string represents a valid Wei value
 * @param value - The value to validate
 * @returns true if valid Wei value
 */
export function isValidWeiValue(value: string): boolean {
  if (!value || value.trim() === '') {
    return false;
  }

  try {
    BigInt(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a Wei value (as string) to Gigawei with appropriate formatting
 * @param weiValue - The Wei value as a string
 * @returns Formatted Gigawei value as string with exactly 3 decimal places
 */
export function formatWeiToGigawei(weiValue: string | number): string {
  if (!weiValue || weiValue === '0') {
    return '0.000';
  }

  try {
    // Convert to BigInt to handle large numbers safely
    const wei = BigInt(weiValue.toString());
    const gigaweiWei = BigInt('1000000000'); // 10^9 (1 Gigawei = 1 billion wei)

    // Calculate gigawei as integer part and remainder
    const gigaweiInt = wei / gigaweiWei;
    const remainder = wei % gigaweiWei;

    // Convert remainder to decimal string with full precision
    const remainderStr = remainder.toString().padStart(9, '0');

    // Get the first 3 decimal places for rounding
    const first3Decimals = remainderStr.slice(0, 3);
    const fourth4thDecimal = remainderStr[3];

    // Convert to number for rounding calculation
    let decimalValue = parseInt(first3Decimals, 10);

    // Round up if the 4th decimal is 5 or greater, or if there are any non-zero digits after
    if (fourth4thDecimal && parseInt(fourth4thDecimal, 10) >= 5) {
      decimalValue += 1;
    } else if (remainder > BigInt(first3Decimals.padEnd(9, '0'))) {
      // Check if there are any non-zero digits beyond the 4th decimal
      const beyondFourth = remainderStr.slice(4);
      if (beyondFourth && parseInt(beyondFourth, 10) > 0) {
        decimalValue += 1;
      }
    }

    // Handle carry-over if rounding goes to 1000
    if (decimalValue >= 1000) {
      return `${(gigaweiInt + BigInt(1)).toString()}.000`;
    }

    // Format with exactly 3 decimal places
    const formattedDecimal = decimalValue.toString().padStart(3, '0');

    return `${gigaweiInt.toString()}.${formattedDecimal}`;
  } catch (error) {
    LogError(`Formatting Wei to Gigawei: ${error}`);
    return `${weiValue}`;
  }
}
