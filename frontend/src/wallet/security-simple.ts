/**
 * Simple security checks for wallet operations
 */

/**
 * Checks if approval amount is unlimited (close to max uint256)
 */
export function isUnlimitedApproval(amount: string): boolean {
  try {
    const maxUint256 = BigInt(
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    );
    const amountBN = BigInt(amount);
    // Consider anything over 90% of max uint256 as unlimited
    return amountBN > (maxUint256 * 90n) / 100n;
  } catch {
    return false;
  }
}

/**
 * Gets security warning for unlimited approvals
 */
export function getSecurityWarning(amount: string): string | null {
  if (isUnlimitedApproval(amount)) {
    return 'Warning: This grants unlimited access to your tokens. Consider approving only what you need.';
  }
  return null;
}
