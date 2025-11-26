/**
 * Test file to verify the transaction models work correctly
 */
import { types } from '@models';
import { describe, expect, it } from 'vitest';

import {
  ApprovalTransaction,
  TransactionModelHelpers,
} from '../transaction-models';

describe('ApprovalTransaction', () => {
  const tokenAddress = '0x1234567890123456789012345678901234567890';
  const spenderAddress = '0x9876543210987654321098765432109876543210';
  const ownerAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

  describe('Revoke transactions', () => {
    it('should create revoke transaction with amount = "0"', () => {
      const revokeTransaction = new ApprovalTransaction(
        tokenAddress,
        spenderAddress,
        ownerAddress,
        '0', // Revoke = amount 0
      );

      expect(revokeTransaction.amount).toBe('0');
      expect(revokeTransaction.isRevoke()).toBe(true);
      expect(revokeTransaction.function.name).toBe('approve');
      expect(revokeTransaction.function.encoding).toBe('0x095ea7b3');
      expect(revokeTransaction.function.inputs).toHaveLength(2);
    });

    it('should generate correct transaction data for revoke', () => {
      const revokeTransaction = new ApprovalTransaction(
        tokenAddress,
        spenderAddress,
        ownerAddress,
        '0',
      );

      const txData = revokeTransaction.getTransactionData();
      expect(txData).toContain('0x095ea7b3'); // Function selector
      expect(txData).toMatch(/^0x095ea7b3[0-9a-f]{128}$/); // Selector + 64 chars spender + 64 chars amount
    });

    it('should create complete transaction object for revoke', () => {
      const revokeTransaction = new ApprovalTransaction(
        tokenAddress,
        spenderAddress,
        ownerAddress,
        '0',
      );

      const txObject = revokeTransaction.getTransactionObject();
      expect(txObject.to).toBe(tokenAddress);
      expect(txObject.value).toBe('0x0');
      expect(txObject.gas).toBeDefined();
      expect(txObject.gasPrice).toBeDefined();
    });
  });

  describe('Approval transactions', () => {
    it('should create approval transaction with specific amount', () => {
      const amount = '100.5';
      const approvalTransaction = ApprovalTransaction.forApproval(
        tokenAddress,
        spenderAddress,
        ownerAddress,
        amount,
      );

      expect(approvalTransaction.amount).toBe(amount);
      expect(approvalTransaction.isRevoke()).toBe(false);
      expect(approvalTransaction.function.name).toBe('approve');
    });

    it('should validate transaction parameters', () => {
      const approvalTransaction = ApprovalTransaction.forApproval(
        tokenAddress,
        spenderAddress,
        ownerAddress,
        '100',
      );

      const validation = approvalTransaction.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid parameters', () => {
      const approvalTransaction = ApprovalTransaction.forApproval(
        'invalid-address', // Invalid address format
        spenderAddress,
        ownerAddress,
        '100',
      );

      const validation = approvalTransaction.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Static factory methods', () => {
    it('should create revoke transaction using forRevoke', () => {
      const mockApproval = {
        token: {
          address: [
            18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18, 52, 86, 120, 144,
            18, 52, 86, 120, 144,
          ],
        },
        spender: {
          address: [
            152, 118, 84, 50, 16, 152, 118, 84, 50, 16, 152, 118, 84, 50, 16,
            152, 118, 84, 50, 16,
          ],
        },
      } as types.Approval;

      const revokeTransaction = ApprovalTransaction.forRevoke(
        mockApproval,
        ownerAddress,
      );
      expect(revokeTransaction.isRevoke()).toBe(true);
      expect(revokeTransaction.amount).toBe('0');
    });
  });
});

describe('TransactionModelHelpers', () => {
  it('should validate correct approve function structure', () => {
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

  it('should reject invalid function structure', () => {
    const invalidFunction = new types.Function();
    invalidFunction.name = 'transfer'; // Wrong name
    invalidFunction.encoding = '0x095ea7b3';
    invalidFunction.inputs = [];

    const isValid =
      TransactionModelHelpers.validateApproveFunction(invalidFunction);
    expect(isValid).toBe(false);
  });

  it('should format addresses correctly', () => {
    const address = {
      address: [
        18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18,
        52, 86, 120, 144,
      ],
    };
    const formatted = TransactionModelHelpers.formatAddress(address);
    expect(formatted).toMatch(/^0x[0-9a-f]{40}$/);
  });
});
