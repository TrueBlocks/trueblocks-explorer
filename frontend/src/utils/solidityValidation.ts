import { types } from '@models';

export const isValidSolidityType = (type: string): boolean => {
  const validTypes = [
    // Basic types
    'address',
    'bool',
    'string',
    'bytes',
    // Signed integers
    'int',
    'int8',
    'int16',
    'int32',
    'int64',
    'int128',
    'int256',
    // Unsigned integers
    'uint',
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uint128',
    'uint256',
    // Fixed bytes
    'bytes1',
    'bytes2',
    'bytes4',
    'bytes8',
    'bytes16',
    'bytes32',
  ];

  // Check exact match
  if (validTypes.includes(type)) {
    return true;
  }

  // Check array types
  if (type.endsWith('[]')) {
    const baseType = type.slice(0, -2);
    return isValidSolidityType(baseType);
  }

  // Check fixed-size arrays
  const fixedArrayMatch = type.match(/^(.+)\[(\d+)\]$/);
  if (fixedArrayMatch) {
    const [, baseType, size] = fixedArrayMatch;
    if (baseType && size) {
      return isValidSolidityType(baseType) && parseInt(size) > 0;
    }
  }

  return false;
};

export const isArrayType = (type: string): boolean => {
  return type.includes('[') && type.includes(']');
};

export const getArrayBaseType = (type: string): string => {
  if (type.endsWith('[]')) {
    return type.slice(0, -2);
  }

  const fixedArrayMatch = type.match(/^(.+)\[\d+\]$/);
  if (fixedArrayMatch && fixedArrayMatch[1]) {
    return fixedArrayMatch[1];
  }

  return type;
};

export const isStructType = (parameter: types.Parameter): boolean => {
  return (
    parameter.components !== undefined &&
    parameter.components !== null &&
    parameter.components.length > 0
  );
};

export const validateFunctionInputs = (
  func: types.Function,
  values: Record<string, string>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  func.inputs.forEach((input) => {
    const value = values[input.name];

    if (!value && !input.name.startsWith('_')) {
      errors[input.name] = 'This field is required';
      return;
    }

    if (value) {
      const error = validateSolidityValue(input.type, value);
      if (error) {
        errors[input.name] = error;
      }
    }
  });

  return errors;
};

export const validateSolidityValue = (
  type: string,
  value: string,
): string | null => {
  if (!value.trim()) {
    return 'Value is required';
  }

  // Address validation
  if (type === 'address') {
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return 'Invalid Ethereum address format (must be 0x followed by 40 hex characters)';
    }
    return null;
  }

  // Boolean validation
  if (type === 'bool') {
    const lowerValue = value.toLowerCase().trim();
    if (!['true', 'false', '1', '0'].includes(lowerValue)) {
      return 'Boolean value must be true, false, 1, or 0';
    }
    return null;
  }

  // Integer validation
  if (type.startsWith('uint') || type.startsWith('int')) {
    if (!/^-?\d+$/.test(value)) {
      return 'Must be a valid integer';
    }

    const num = BigInt(value);
    const isUnsigned = type.startsWith('uint');

    if (isUnsigned && num < 0) {
      return 'Unsigned integers cannot be negative';
    }

    // Check bit size limits
    const bitSize = parseInt(type.replace(/^u?int/, '')) || 256;
    const maxValue = isUnsigned
      ? 2n ** BigInt(bitSize) - 1n
      : 2n ** BigInt(bitSize - 1) - 1n;
    const minValue = isUnsigned ? 0n : -(2n ** BigInt(bitSize - 1));

    if (num > maxValue || num < minValue) {
      return `Value out of range for ${type} (${minValue} to ${maxValue})`;
    }

    return null;
  }

  // Bytes validation
  if (type.startsWith('bytes')) {
    if (!value.startsWith('0x')) {
      return 'Bytes value must start with 0x';
    }

    const hexValue = value.slice(2);
    if (!/^[a-fA-F0-9]*$/.test(hexValue)) {
      return 'Invalid hex characters in bytes value';
    }

    // Fixed size bytes validation
    if (type !== 'bytes') {
      const size = parseInt(type.replace('bytes', ''));
      if (hexValue.length !== size * 2) {
        return `${type} must be exactly ${size} bytes (${size * 2} hex characters)`;
      }
    }

    return null;
  }

  // Array validation
  if (isArrayType(type)) {
    const lines = value.split('\n').filter((line) => line.trim());
    const baseType = getArrayBaseType(type);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line) {
        const error = validateSolidityValue(baseType, line.trim());
        if (error) {
          return `Line ${i + 1}: ${error}`;
        }
      }
    }

    return null;
  }

  // String validation (always valid)
  if (type === 'string') {
    return null;
  }

  return null;
};

export const formatValueForContract = (
  type: string,
  value: string,
): unknown => {
  if (type === 'address') {
    return value.toLowerCase();
  }

  if (type === 'bool') {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === '1';
  }

  if (type.startsWith('uint') || type.startsWith('int')) {
    return value;
  }

  if (type.startsWith('bytes')) {
    return value;
  }

  if (isArrayType(type)) {
    const lines = value.split('\n').filter((line) => line.trim());
    const baseType = getArrayBaseType(type);
    return lines.map((line) => formatValueForContract(baseType, line.trim()));
  }

  return value;
};
