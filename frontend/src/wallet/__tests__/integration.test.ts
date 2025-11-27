/**
 * Integration tests for transaction models showing real usage patterns
 */
import { types } from '@models';
import { describe, expect, it, vi } from 'vitest';

import {
  ApprovalTransaction,
  TransactionModelHelpers,
} from '../transaction-models';

// Mock payload for testing
const mockPayload: types.Payload = {
  collection: 'exports',
  dataFacet: '' as types.DataFacet,
  activeChain: 'mainnet',
  activeAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
};

// Mock the PrepareApprovalTransaction function
vi.mock('@app', () => ({
  PrepareApprovalTransaction: vi.fn().mockImplementation((_payload, _data) =>
    Promise.resolve({
      success: true,
      gasEstimate: '0xea60', // 60000 in hex
      gasPrice: '0x4a817c800', // 20 gwei in hex
      transactionData:
        '0x095ea7b3000000000000000000000000987654321098765432109876543210987654321000000000000000000000000000000000000000000000000000000000000000000',
      newAllowance: '0',
    }),
  ),
}));

describe('Transaction Models Integration', () => {
  const mockApproval: types.Approval = {
    token: {
      address: [
        18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18,
        52, 86, 120, 144,
      ],
    },
    spender: {
      address: [
        152, 118, 84, 50, 16, 152, 118, 84, 50, 16, 152, 118, 84, 50, 16, 152,
        118, 84, 50, 16,
      ],
    },
    owner: {
      address: [
        171, 205, 239, 171, 205, 239, 171, 205, 239, 171, 205, 239, 171, 205,
        239, 171, 205, 239, 171, 205,
      ],
    },
    allowance: '1000000000000000000000',
    blockNumber: 12345678,
    timestamp: 1640995200,
    lastAppBlock: 12345678,
    lastAppLogID: 1,
    lastAppTs: 1640995200,
    lastAppTxID: 1,
  } as types.Approval;

  const connectedWallet = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

  describe('RevokeTransaction usage patterns', () => {
    it('should create revoke transaction from approval', () => {
      const revokeTransaction = ApprovalTransaction.forRevoke(
        mockApproval,
        connectedWallet,
      );

      expect(revokeTransaction.function.name).toBe('approve');
      expect(revokeTransaction.function.encoding).toBe('0x095ea7b3');
      expect(revokeTransaction.function.inputs).toHaveLength(2);
      expect(revokeTransaction.function.inputs[1]?.value).toBe('0'); // Revoke = 0 allowance
    });

    it('should create complete transaction object', async () => {
      const revokeTransaction = ApprovalTransaction.forRevoke(
        mockApproval,
        connectedWallet,
      );
      const txObject =
        await revokeTransaction.getTransactionObject(mockPayload);

      expect(txObject.to).toBeDefined();
      expect(txObject.data.startsWith('0x095ea7b3')).toBe(true); // approve function selector
      expect(txObject.value).toBe('0x0');
      // Gas fields are no longer included - should be estimated separately using backend API
    });

    it('should validate approve function structure', () => {
      const revokeTransaction = ApprovalTransaction.forRevoke(
        mockApproval,
        connectedWallet,
      );
      const isValid = TransactionModelHelpers.validateApproveFunction(
        revokeTransaction.function,
      );

      expect(isValid).toBe(true);
    });
  });

  describe('ApprovalTransaction usage patterns', () => {
    it('should create approval transaction with validation', () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890';
      const spenderAddress = '0x9876543210987654321098765432109876543210';
      const amount = '100.5';

      const approvalTransaction = ApprovalTransaction.forApproval(
        tokenAddress,
        spenderAddress,
        connectedWallet,
        amount,
      );

      const validation = approvalTransaction.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should handle validation errors', () => {
      // Test with invalid address format
      const approvalTransaction = ApprovalTransaction.forApproval(
        'invalid-address', // Invalid address
        '0x9876543210987654321098765432109876543210',
        connectedWallet,
        '50', // Valid amount to isolate address validation error
      );

      const validation = approvalTransaction.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should create transaction with specific amount', () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890';
      const spenderAddress = '0x9876543210987654321098765432109876543210';
      const newAmount = '250';
      const approvalTransaction = ApprovalTransaction.forApproval(
        tokenAddress,
        spenderAddress,
        connectedWallet,
        newAmount,
      );

      expect(approvalTransaction.amount).toBe(newAmount);
      expect(approvalTransaction.function.inputs[1]?.value).toBe(
        (250 * 1e18).toString(),
      );
    });
  });

  describe('Helper validation', () => {
    it('should validate approve function signatures', () => {
      const validFunction = new types.Function();
      validFunction.name = 'approve';
      validFunction.encoding = '0x095ea7b3';
      validFunction.inputs = [
        { name: 'spender', type: 'address' } as types.Parameter,
        { name: 'amount', type: 'uint256' } as types.Parameter,
      ];

      const isValid =
        TransactionModelHelpers.validateApproveFunction(validFunction);
      expect(isValid).toBe(true);
    });
  });

  describe('Real workflow simulation', () => {
    it('should simulate complete revoke workflow', async () => {
      // Mock transaction sender
      const mockSendTransaction = vi
        .fn()
        .mockResolvedValue({ hash: '0xabcd1234' });

      // Create revoke transaction
      const revokeTransaction = ApprovalTransaction.forRevoke(
        mockApproval,
        connectedWallet,
      );
      const txObject =
        await revokeTransaction.getTransactionObject(mockPayload);

      // Validate function signature
      const isValidFunction = TransactionModelHelpers.validateApproveFunction(
        revokeTransaction.function,
      );
      expect(isValidFunction).toBe(true);

      // Simulate sending transaction
      await mockSendTransaction(txObject);
      expect(mockSendTransaction).toHaveBeenCalledWith(txObject);
    });

    it('should simulate complete approval workflow', async () => {
      const mockSendTransaction = vi
        .fn()
        .mockResolvedValue({ hash: '0xabcd1234' });

      const approvalTransaction = ApprovalTransaction.forApproval(
        '0x1234567890123456789012345678901234567890',
        '0x9876543210987654321098765432109876543210',
        connectedWallet,
        '75.25',
      );

      // Validate before sending
      const validation = approvalTransaction.validate();
      expect(validation.isValid).toBe(true);

      const txObject =
        await approvalTransaction.getTransactionObject(mockPayload);

      // Simulate sending transaction
      await mockSendTransaction(txObject);
      expect(mockSendTransaction).toHaveBeenCalledWith(txObject);
    });
  });
});
