# Transaction Models Using Function Type

## Overview

I've successfully created `RevokeTransaction` and `ApprovalTransaction` models that utilize the `types.Function` type from the auto-generated models.ts file. These models encapsulate ERC20 approval transaction logic with proper TypeScript typing and validation.

## Files Created

### 1. `/frontend/src/wallet/transaction-models.ts`

The main models file containing:

- **`RevokeTransaction`** class - Represents ERC20 approve transactions that set allowance to 0
- **`ApprovalTransaction`** class - Represents ERC20 approve transactions with specific amounts
- **`TransactionModelHelpers`** class - Utility functions for gas estimation, validation, etc.

### 2. `/frontend/src/wallet/index.ts`

Export file for the custom models to enable clean imports.

### 3. `/frontend/src/wallet/__tests__/`

Test directory containing:

- `transaction-models.test.ts` - Unit tests for the wallet models
- `alias-test.ts` - Verification test for the `@wallet` TypeScript alias
- `integration.test.ts` - Integration tests showing real usage patterns

## Key Features

### RevokeTransaction Class

```typescript
const revokeTransaction = RevokeTransaction.fromApproval(
  approval,
  ownerAddress,
);
const txObject = revokeTransaction.getTransactionObject();
```

**Properties:**

- `function: types.Function` - Properly constructed Function object with ERC20 approve signature
- `tokenAddress: string` - Token contract address
- `spenderAddress: string` - Spender address to revoke approval for
- `ownerAddress: string` - Owner of the tokens

**Methods:**

- `getTransactionData()` - Returns encoded transaction data
- `getTransactionObject()` - Returns complete transaction object ready for signing
- `fromApproval(approval, owner)` - Static factory method from existing approval

### ApprovalTransaction Class

```typescript
const approvalTransaction = ApprovalTransaction.create(
  token,
  spender,
  owner,
  amount,
);
const validation = approvalTransaction.validate();
const txObject = approvalTransaction.getTransactionObject();
```

**Properties:**

- `function: types.Function` - Properly constructed Function object
- `tokenAddress: string` - Token contract address
- `spenderAddress: string` - Spender address to grant approval to
- `ownerAddress: string` - Owner of the tokens
- `amount: string` - Amount in token units (converted to wei automatically)

**Methods:**

- `validate()` - Returns validation results with error messages
- `getTransactionData()` - Returns encoded transaction data
- `getTransactionObject()` - Returns complete transaction object ready for signing
- `create(token, spender, owner, amount)` - Static factory method
- `fromApproval(approval, owner, newAmount)` - Static factory from existing approval

### TransactionModelHelpers Class

```typescript
const gasEstimate = TransactionModelHelpers.estimateGasCost();
const isValid = TransactionModelHelpers.validateApproveFunction(function);
const addressHex = TransactionModelHelpers.formatAddress(baseAddress);
```

**Static Methods:**

- `estimateGasCost()` - Calculates gas costs in ETH and USD
- `validateApproveFunction()` - Validates Function objects match ERC20 approve signature
- `formatAddress()` - Converts base.Address to hex string

## Function Type Usage

Both models properly use the `types.Function` type with:

```typescript
const func = new types.Function();
func.name = 'approve';
func.type = 'function';
func.stateMutability = 'nonpayable';
func.encoding = '0x095ea7b3'; // approve(address,uint256) function selector
func.inputs = [spenderParam, amountParam]; // Properly typed Parameters
func.outputs = []; // Empty for approve function
```

Each input parameter is a properly constructed `types.Parameter`:

```typescript
const spenderParam = new types.Parameter();
spenderParam.name = 'spender';
spenderParam.type = 'address';
spenderParam.value = this.spenderAddress;
```

## Configuration Updates

### tsconfig.json

Added new alias for wallet models:

```json
"@wallet": ["src/wallet"]
```

This allows importing wallet models with:

```typescript
import { ApprovalTransaction, RevokeTransaction } from '@wallet';
```

While keeping the auto-generated models available via:

```typescript
import { types } from '@models';
```

## Usage Benefits

1. **Type Safety**: Full TypeScript support with proper Function type usage
2. **Validation**: Built-in address and amount validation
3. **Reusability**: Models can be used across components
4. **Consistency**: Standardized transaction construction
5. **Maintainability**: Centralized ERC20 approve logic
6. **Testing**: Easily unit testable models
7. **Gas Estimation**: Built-in gas cost calculations

## Usage Examples

### Basic Revoke Transaction

```typescript
import { ApprovalTransaction } from '@wallet';

// Create revoke transaction from existing approval
const revokeTransaction = ApprovalTransaction.forRevoke(
  approval,
  connectedWallet,
);

// Get transaction object ready for signing
const txObject = revokeTransaction.getTransactionObject();

// Send transaction
const hash = await revokeTransaction.submit(sendTransaction);
```

### Basic Approval Transaction

```typescript
import { ApprovalTransaction } from '@wallet';

// Create approval transaction
const approvalTransaction = ApprovalTransaction.forApproval(
  tokenAddress,
  spenderAddress,
  ownerAddress,
  amount
);

// Validate inputs
const validation = approvalTransaction.validate();
if (!validation.isValid) {
  console.error('Validation failed:', validation.errors);
  return;
}

// Get transaction object and send
const txObject = approvalTransaction.getTransactionObject();
const hash = await approvalTransaction.submit(sendTransaction);
```

### Refactoring OpenApprovalsPanel Hook

```typescript
import { useCallback } from 'react';

import { ApprovalTransaction } from '@wallet';

const useWalletTransactions = (approval, connectedWallet, sendTransaction) => {
  const handleRevoke = useCallback(async () => {
    try {
      const revokeTransaction = ApprovalTransaction.forRevoke(
        approval,
        connectedWallet,
      );
      const hash = await revokeTransaction.submit(sendTransaction);
      console.log('Revoke transaction submitted:', hash);
    } catch (error) {
      console.error('Revoke failed:', error);
    }
  }, [approval, connectedWallet, sendTransaction]);

  const handleApprove = useCallback(
    async (amount, token, spender) => {
      try {
        const approvalTransaction = ApprovalTransaction.forApproval(
          token,
          spender,
          connectedWallet,
          amount,
        );

        const validation = approvalTransaction.validate();
        if (!validation.isValid) {
          throw new Error('Validation failed: ' + validation.errors.join(', '));
        }

        const hash = await approvalTransaction.submit(sendTransaction);
        console.log('Approval transaction submitted:', hash);
      } catch (error) {
        console.error('Approval failed:', error);
      }
    },
    [connectedWallet, sendTransaction],
  );

  return { handleRevoke, handleApprove };
};
```

## Integration Comparison

**Before (Manual Construction):**

```typescript
// OLD: Manual construction
const callData = '0x095ea7b3' + paddedSpender + paddedAmount;
const txObject = {
  to: token,
  data: callData,
  value: '0',
  gas: gasLimit,
  gasPrice,
};
```

**After (Using Wallet Models):**

```typescript
// NEW: Using wallet models
const approvalTransaction = ApprovalTransaction.create(
  token,
  spender,
  owner,
  amount,
);
const validation = approvalTransaction.validate();
if (validation.isValid) {
  const txObject = approvalTransaction.getTransactionObject();
  await sendTransaction(txObject);
}
```

## Next Steps

The wallet models are ready for integration into OpenApprovalsPanel.tsx. The example file shows exactly how to refactor the existing `createRevokeTransaction` and `createApprovalTransaction` functions to use these new wallet models.

This provides a clean, type-safe, and maintainable approach to ERC20 approval transactions while properly utilizing the `Function` type from the auto-generated models.
