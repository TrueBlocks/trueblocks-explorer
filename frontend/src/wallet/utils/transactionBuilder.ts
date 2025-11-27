import { Encode } from '@app';
import { types } from '@models';
import { LogError } from '@utils';

// TODO: BOGUS - IT MIGHT BE BETTER TO CREATE A @contracts or @contract_utils folder than put these in @utils

// Standard ERC20 approve function ABI
export const ERC20_APPROVE_FUNCTION: types.Function = {
  name: 'approve',
  type: 'function',
  inputs: [
    types.Parameter.createFrom({
      name: 'spender',
      type: 'address',
      internalType: 'address',
    }),
    types.Parameter.createFrom({
      name: 'amount',
      type: 'uint256',
      internalType: 'uint256',
    }),
  ],
  outputs: [
    types.Parameter.createFrom({
      name: '',
      type: 'bool',
      internalType: 'bool',
    }),
  ],
  stateMutability: 'nonpayable',
  encoding: '0x095ea7b3',
  convertValues: () => {},
};

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

    // Use simple gas estimation for non-approval transactions
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
 * Estimates gas for a transaction using simple heuristics
 * Note: For approval transactions, use the backend API PrepareApprovalTransaction instead
 */
export const estimateGas = async (
  transactionData: TransactionData,
): Promise<string> => {
  try {
    // For ERC20 approve, use a reasonable default
    if (transactionData.function.name === 'approve') {
      return '60000'; // Safe estimate for ERC20 approve transactions
    }

    // For other functions, estimate based on complexity
    const baseGas = 21000; // Base transaction cost
    const functionGas = Math.min(transactionData.inputs.length * 10000, 200000); // Cap at 200k
    return (baseGas + functionGas).toString();
  } catch {
    // Fallback to conservative estimate
    return '100000';
  }
};

/**
 * Gets current gas price from a gas oracle or reasonable default
 */
export const getGasPrice = async (): Promise<string> => {
  try {
    // Try to fetch from a gas price API (e.g., ETH Gas Station, Etherscan API)
    const response = await fetch(
      'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken',
    );
    if (response.ok) {
      const data = await response.json();
      if (data.status === '1' && data.result?.SafeGasPrice) {
        // Use SafeGasPrice from Etherscan (in gwei)
        const gasPriceGwei = parseInt(data.result.SafeGasPrice);
        return (gasPriceGwei * 1e9).toString(); // Convert to wei
      }
    }
  } catch (error) {
    // Fallback to reasonable default if API fails
    LogError('Failed to fetch gas price, using default:', String(error));
  }

  // Fallback: Conservative 15 gwei (much more reasonable than 20 gwei)
  return (15 * 1e9).toString();
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
