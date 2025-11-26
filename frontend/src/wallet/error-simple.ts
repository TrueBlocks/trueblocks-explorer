/**
 * Simple error handling for wallet operations
 */

/**
 * Gets user-friendly error message from wallet/RPC errors
 */
export function getErrorMessage(error: unknown): string {
  const msg =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  if (msg.includes('user rejected') || msg.includes('denied')) {
    return 'Transaction cancelled by user';
  }

  if (msg.includes('insufficient funds')) {
    return 'Not enough ETH for gas fees';
  }

  if (msg.includes('gas') && msg.includes('too low')) {
    return 'Gas price too low, try increasing it';
  }

  if (msg.includes('nonce') && msg.includes('too low')) {
    return 'Transaction nonce error. Reset your wallet and try again';
  }

  if (
    msg.includes('network') ||
    msg.includes('connection') ||
    msg.includes('fetch')
  ) {
    return 'Network connection error. Check your internet and try again';
  }

  if (msg.includes('revert') || msg.includes('execution failed')) {
    return 'Transaction was reverted by the contract';
  }

  return 'Transaction failed. Please try again';
}

/**
 * Wraps async operations with basic error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const userMessage = getErrorMessage(error);
    const enhancedError = new Error(`${context}: ${userMessage}`);
    Object.assign(enhancedError, { userMessage });
    throw enhancedError;
  }
}
