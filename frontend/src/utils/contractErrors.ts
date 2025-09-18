/**
 * Contract error handling utilities
 * Consolidated from multiple duplicate implementations
 */

/**
 * Extract meaningful error message from different error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error occurred';
};

/**
 * Check if error is related to network issues
 */
export const isNetworkError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('cors')
  );
};

/**
 * Check if error is related to contract ABI issues
 */
export const isAbiError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('abi') ||
    message.includes('function not found') ||
    message.includes('invalid function') ||
    message.includes('encoding') ||
    message.includes('decoding')
  );
};

/**
 * Check if error is related to transaction issues
 */
export const isTransactionError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('transaction') ||
    message.includes('gas') ||
    message.includes('revert') ||
    message.includes('insufficient') ||
    message.includes('nonce')
  );
};

/**
 * Check if error is related to wallet connection
 */
export const isWalletError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('wallet') ||
    message.includes('walletconnect') ||
    message.includes('not connected') ||
    message.includes('rejected') ||
    message.includes('user denied')
  );
};

/**
 * Get error category for better user messaging
 */
export const getErrorCategory = (error: unknown): string => {
  if (isWalletError(error)) return 'Wallet';
  if (isTransactionError(error)) return 'Transaction';
  if (isAbiError(error)) return 'Contract ABI';
  if (isNetworkError(error)) return 'Network';
  return 'General';
};

/**
 * Get user-friendly error message with suggestions
 */
export const getUserFriendlyError = (
  error: unknown,
): {
  message: string;
  suggestions: string[];
} => {
  const originalMessage = getErrorMessage(error);
  const category = getErrorCategory(error);

  switch (category) {
    case 'Wallet':
      return {
        message: 'Wallet connection issue',
        suggestions: [
          'Make sure your wallet is connected',
          'Check if you approved the connection request',
          'Try reconnecting your wallet',
          "Ensure you're on the correct network",
        ],
      };

    case 'Transaction':
      return {
        message: 'Transaction failed',
        suggestions: [
          'Check if you have enough ETH for gas fees',
          'Verify the transaction parameters are correct',
          'Try increasing the gas limit',
          'Make sure the contract function exists',
        ],
      };

    case 'Contract ABI':
      return {
        message: 'Contract interface issue',
        suggestions: [
          'Verify the contract address is correct',
          'Check if the contract ABI is up to date',
          'Ensure the function name and parameters are correct',
          'Make sure the contract is deployed on this network',
        ],
      };

    case 'Network':
      return {
        message: 'Network connection issue',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Verify the RPC endpoint is working',
          'Check if the blockchain network is operational',
        ],
      };

    default:
      return {
        message: originalMessage || 'An unexpected error occurred',
        suggestions: [
          'Try refreshing the page',
          'Check the browser console for more details',
          'Contact support if the issue persists',
        ],
      };
  }
};
