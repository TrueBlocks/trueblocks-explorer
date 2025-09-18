import { Encode } from '@app';
import { types } from '@models';

// TODO: BOGUS - IT MIGHT BE BETTER TO CREATE A @contracts or @contract_utils folder than put these in @utils

export interface TransactionData {
  to: string;
  function: types.Function;
  inputs: TransactionInput[];
  value?: string; // ETH value for payable functions
}

export interface TransactionInput {
  name: string;
  type: string;
  value: string;
}

export interface PreparedTransaction {
  to: string;
  data: string;
  value: string;
  gas?: string;
  gasPrice?: string;
}

/**
 * Encodes function parameters for contract calls using the core's backend
 * This leverages the robust Go implementation that uses go-ethereum's ABI encoding
 */
export const encodeParameters = async (
  functionAbi: types.Function,
  inputs: TransactionInput[],
): Promise<string> => {
  try {
    // Convert inputs to the format expected by the backend
    const callArguments = inputs.map((input) => {
      // The Go backend expects proper types, not strings
      return convertInputValue(input.type, input.value);
    });

    // Call the core's backend Encode function which uses Function.Pack
    const encodedData = await Encode(functionAbi, callArguments);

    return encodedData;
  } catch (error) {
    let errorMsg = 'Unknown error';
    if (error instanceof Error) {
      errorMsg = error.message;
    } else if (typeof error === 'string') {
      errorMsg = error;
    } else if (error && typeof error === 'object') {
      // Try to extract meaningful error information
      errorMsg = JSON.stringify(error);
    }

    throw new Error(`Failed to encode transaction parameters: ${errorMsg}`);
  }
};

/**
 * Convert string input values to proper types for the Go backend
 */
const convertInputValue = (type: string, value: string): unknown => {
  if (type === 'address') {
    return value; // Keep as string
  }

  if (type.startsWith('uint') || type.startsWith('int')) {
    return value; // Go backend can handle string numbers
  }

  if (type === 'bool') {
    return value.toLowerCase() === 'true';
  }

  if (type === 'string') {
    return value;
  }

  if (type.startsWith('bytes')) {
    return value; // Keep as hex string
  }

  // For arrays and complex types, try to parse as JSON
  if (type.includes('[') || type.includes('(')) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

/**
 * Builds a transaction from form data
 */
export const buildTransaction = (
  contractAddress: string,
  functionAbi: types.Function,
  inputs: TransactionInput[],
  ethValue?: string,
): TransactionData => {
  return {
    to: contractAddress,
    function: functionAbi,
    inputs,
    value: ethValue || '0',
  };
};

/**
 * Prepares a transaction for signing
 */
export const prepareTransaction = async (
  transactionData: TransactionData,
): Promise<PreparedTransaction> => {
  try {
    const encodedData = await encodeParameters(
      transactionData.function,
      transactionData.inputs,
    );

    // TODO: Estimate gas
    const estimatedGas = await estimateGas(transactionData);

    return {
      to: transactionData.to,
      data: encodedData,
      value: transactionData.value || '0',
      gas: estimatedGas,
      gasPrice: await getGasPrice(),
    };
  } catch (error) {
    throw new Error(
      `Failed to prepare transaction: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

/**
 * Estimates gas for a transaction
 */
export const estimateGas = async (
  transactionData: TransactionData,
): Promise<string> => {
  // TODO: Implement actual gas estimation
  // This would typically call eth_estimateGas

  // Placeholder values based on function complexity
  const baseGas = 21000; // Base transaction cost
  const functionGas = transactionData.inputs.length * 5000; // Rough estimate per parameter

  return (baseGas + functionGas).toString();
};

/**
 * Gets current gas price
 */
export const getGasPrice = async (): Promise<string> => {
  // TODO: Implement actual gas price fetching
  // This would typically call eth_gasPrice or use a gas oracle

  // Placeholder: 20 gwei
  return (20 * 1e9).toString();
};

/**
 * Validates transaction inputs
 */
export const validateTransactionInputs = (
  functionAbi: types.Function,
  inputs: TransactionInput[],
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check all required parameters are provided
  functionAbi.inputs.forEach((param) => {
    const input = inputs.find((i) => i.name === param.name);
    if (!input || !input.value.trim()) {
      if (!param.name.startsWith('_')) {
        // Convention: optional params start with _
        errors.push(`Parameter '${param.name}' is required`);
      }
    }
  });

  // Check for extra parameters
  inputs.forEach((input) => {
    const param = functionAbi.inputs.find((p) => p.name === input.name);
    if (!param) {
      errors.push(`Unknown parameter '${input.name}'`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
