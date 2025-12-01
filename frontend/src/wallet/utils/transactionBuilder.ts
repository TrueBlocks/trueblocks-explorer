import { PrepareTransaction } from '@app';
import { types } from '@models';

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
 * Convert string input values to proper types for the Go backend
 */
const convertInputValue = (type: string, value: string): unknown => {
  if (type === 'address') {
    return value; // Keep as string
  }

  if (type.startsWith('uint') || type.startsWith('int')) {
    // For numeric types, ensure we return a proper number for small values
    // The Go ABI encoder may expect specific type handling
    if (type === 'uint256' || type === 'int256') {
      return value.trim();
    }
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
 * Prepares a transaction for signing using unified backend function
 */
export const prepareTransaction = async (
  payload: types.Payload,
  transactionData: TransactionData,
): Promise<PreparedTransaction> => {
  try {
    // Convert inputs to parameter values for backend
    const params = transactionData.inputs.map((input) =>
      convertInputValue(input.type, input.value),
    );

    // Call unified backend function that encodes + estimates gas
    // Pass plain object - Wails will handle the conversion
    const result = await PrepareTransaction(payload, {
      function: transactionData.function,
      params: params,
      from:
        payload.connectedAddress ||
        '0x0000000000000000000000000000000000000000',
      to: transactionData.to,
      value: transactionData.value || '0',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (!result.success) {
      throw new Error(
        `Transaction preparation failed: ${result.error || 'Unknown error'}. Transaction cancelled to prevent potential failures.`,
      );
    }

    const estimatedGas = parseInt(result.gasEstimate, 16).toString();
    const gasPrice = parseInt(result.gasPrice, 16).toString();

    return {
      to: transactionData.to,
      data: result.transactionData,
      value: transactionData.value || '0',
      gas: estimatedGas,
      gasPrice: gasPrice,
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
