import { Encode } from '@app';
import { EstimateTransactionGas } from '@app';
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
  payload: types.Payload,
  transactionData: TransactionData,
): Promise<PreparedTransaction> => {
  try {
    const encodedData = await encodeParameters(
      transactionData.function,
      transactionData.inputs,
    );

    // Use backend API for complete gas estimation (includes both gas limit and price)
    const gasPayload = {
      chain: payload.activeChain || 'mainnet',
      from:
        payload.connectedAddress ||
        '0x0000000000000000000000000000000000000000',
      to: transactionData.to,
      data: encodedData,
      value: transactionData.value || '0x0',
    };

    const gasResult = await EstimateTransactionGas(payload, gasPayload);

    let estimatedGas: string;
    let gasPrice: string;

    if (gasResult.success) {
      estimatedGas = parseInt(gasResult.gasEstimate, 16).toString();
      gasPrice = parseInt(gasResult.gasPrice, 16).toString();
    } else {
      LogError(
        'Gas estimation failed, using fallbacks:',
        gasResult.error || 'Unknown error',
      );
      estimatedGas = '100000';
      gasPrice = (15 * 1e9).toString(); // 15 gwei fallback
    }

    return {
      to: transactionData.to,
      data: encodedData,
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
 * Estimates gas for a transaction using backend RPC calls
 * This replaces frontend heuristics with real network estimation
 */
export const estimateGas = async (
  payload: types.Payload,
  transactionData: TransactionData,
): Promise<string> => {
  try {
    // Encode the transaction data
    const encodedData = await encodeParameters(
      transactionData.function,
      transactionData.inputs,
    );

    // Create payload for backend
    const gasPayload = {
      chain: payload.activeChain || 'mainnet',
      from:
        payload.connectedAddress ||
        '0x0000000000000000000000000000000000000000',
      to: transactionData.to,
      data: encodedData,
      value: transactionData.value || '0x0',
    };

    const result = await EstimateTransactionGas(payload, gasPayload);

    if (!result.success) {
      throw new Error(result.error || 'Gas estimation failed');
    }

    // Convert hex result to decimal string
    return parseInt(result.gasEstimate, 16).toString();
  } catch (error) {
    LogError('Gas estimation failed, using fallback:', String(error));
    // Fallback to conservative estimate
    return '100000';
  }
};

/**
 * Gets current gas price using backend RPC calls
 * @deprecated Use estimateGas instead which provides both gas estimate and gas price
 */
export const getGasPrice = async (payload: types.Payload): Promise<string> => {
  try {
    // Use a dummy transaction to get current gas price
    const dummyPayload = {
      chain: payload.activeChain || 'mainnet',
      from:
        payload.connectedAddress ||
        '0x0000000000000000000000000000000000000000',
      to: '0x0000000000000000000000000000000000000000',
      data: '0x',
      value: '0x0',
    };

    const result = await EstimateTransactionGas(payload, dummyPayload);

    if (!result.success) {
      throw new Error(result.error || 'Gas price estimation failed');
    }

    // Convert hex result to decimal string
    return parseInt(result.gasPrice, 16).toString();
  } catch (error) {
    LogError(
      'Failed to get gas price from backend, using fallback:',
      String(error),
    );
    // Fallback: Conservative 15 gwei
    return (15 * 1e9).toString();
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
