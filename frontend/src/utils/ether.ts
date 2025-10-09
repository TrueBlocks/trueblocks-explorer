/**
 * Utility functions for converting Wei values to Ether display format
 */
import { LogError } from '@utils';

/**
 * Converts a Wei value (as string) to Ether with appropriate formatting
 * @param weiValue - The Wei value as a string
 * @returns Formatted Ether value as string with exactly 6 decimal places, rounded up
 */
export function formatWeiToEther(weiValue: string | number): string {
  if (!weiValue || weiValue === '0') {
    return '-';
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

    // Get the first 6 decimal places for rounding
    const first6Decimals = remainderStr.slice(0, 6);
    const seventh7thDecimal = remainderStr[6];

    // Convert to number for rounding calculation
    let decimalValue = parseInt(first6Decimals, 10);

    // Round up if the 7th decimal is 5 or greater, or if there are any non-zero digits after
    if (seventh7thDecimal && parseInt(seventh7thDecimal, 10) >= 5) {
      decimalValue += 1;
    } else if (remainder > BigInt(first6Decimals.padEnd(18, '0'))) {
      // Check if there are any non-zero digits beyond the 6th decimal
      const beyondSixth = remainderStr.slice(6);
      if (beyondSixth && parseInt(beyondSixth, 10) > 0) {
        decimalValue += 1;
      }
    }

    // Handle carry-over if rounding goes to 1000000
    if (decimalValue >= 1000000) {
      return `${(etherInt + BigInt(1)).toString()}.000000`;
    }

    // Format with exactly 6 decimal places
    const formattedDecimal = decimalValue.toString().padStart(6, '0');

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
