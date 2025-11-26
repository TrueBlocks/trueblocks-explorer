/**
 * Quick test to verify @wallet alias works correctly
 */
import { ApprovalTransaction, TransactionModelHelpers } from '@wallet';

// Test that we can import from @wallet alias
export const testWalletAlias = (): void => {
  console.log('Testing @wallet alias...');

  // Test creating a simple approval transaction
  const approval = ApprovalTransaction.forApproval(
    '0x1234567890123456789012345678901234567890',
    '0x9876543210987654321098765432109876543210',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '100',
  );

  console.log('✅ @wallet alias working correctly');
  console.log('Approval function encoding:', approval.function.encoding);
  console.log(
    'Validation result:',
    TransactionModelHelpers.validateApproveFunction(approval.function),
  );
};
