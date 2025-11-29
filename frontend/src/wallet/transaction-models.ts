import { PrepareApprovalTransaction } from '@app';
import { app, types } from '@models';

import { withErrorHandling } from './error-simple';

export class ApprovalTransaction {
  public function: types.Function;
  public tokenAddress: string;
  public spenderAddress: string;
  public ownerAddress: string;
  public amount: string; // Amount in token units, "0" for revokes

  // constructor creates an ApprovalTransaction with default amount of "0" for revoke
  constructor(
    tokenAddress: string,
    spenderAddress: string,
    ownerAddress: string,
    amount: string = '0', // Default to revoke
  ) {
    this.tokenAddress = tokenAddress;
    this.spenderAddress = spenderAddress;
    this.ownerAddress = ownerAddress;
    this.amount = amount;

    // Create the Function object for ERC20 approve(address,uint256)
    this.function = this.createApproveFunction();
  }

  // createApproveFunction builds the ERC20 approve(address,uint256) function definition
  private createApproveFunction(): types.Function {
    const spenderParam = new types.Parameter();
    spenderParam.name = 'spender';
    spenderParam.type = 'address';
    spenderParam.value = this.spenderAddress;

    const amountParam = new types.Parameter();
    amountParam.name = 'amount';
    amountParam.type = 'uint256';
    // Backend handles amount conversion based on token decimals
    amountParam.value = this.amount;

    const func = new types.Function();
    func.name = 'approve';
    func.type = 'function';
    func.stateMutability = 'nonpayable';
    func.encoding = '0x095ea7b3'; // approve(address,uint256) function selector
    func.inputs = [spenderParam, amountParam];
    func.outputs = []; // approve returns bool but we don't need to model the return

    return func;
  }

  // getTransactionObject calls prepare() for real-time gas values, returns transaction ready for signing
  public async getTransactionObject(payload: types.Payload): Promise<{
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  }> {
    const prepareResult = await this.prepare(payload);
    if (!prepareResult.success) {
      throw new Error(
        `Failed to estimate gas for ${this.isRevoke() ? 'revoke' : 'approval'} transaction: ${
          prepareResult.error || 'Gas estimation failed'
        }. Transaction cancelled to prevent potential failures.`,
      );
    }

    // Ensure we have valid gas values - no fallbacks allowed
    const gasEstimate = prepareResult.gasUsed || prepareResult.gasEstimate;
    const gasPrice = prepareResult.gasPrice;

    if (!gasEstimate || !gasPrice) {
      throw new Error(
        `Backend returned success but missing gas values. Gas estimate: ${gasEstimate}, Gas price: ${gasPrice}. Transaction cancelled.`,
      );
    }

    return {
      to: this.tokenAddress,
      data: prepareResult.transactionData, // Use backend-encoded data with proper decimals
      value: '0x0',
      gas: gasEstimate.startsWith('0x')
        ? gasEstimate
        : '0x' + parseInt(gasEstimate).toString(16),
      gasPrice: gasPrice.startsWith('0x')
        ? gasPrice
        : '0x' + parseInt(gasPrice).toString(16),
    };
  }

  // forRevoke creates a revoke transaction (amount = "0") from existing approval
  public static forRevoke(
    approval: types.Approval,
    ownerAddress: string,
  ): ApprovalTransaction {
    try {
      const tokenAddress = ApprovalTransaction.baseAddressToString(
        approval.token,
      );
      const spenderAddress = ApprovalTransaction.baseAddressToString(
        approval.spender,
      );

      return new ApprovalTransaction(
        tokenAddress,
        spenderAddress,
        ownerAddress,
        '0', // Revoke = amount 0
      );
    } catch (error) {
      throw new Error(
        `Failed to create revoke transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // forApproval creates an approval transaction with specified amount
  public static forApproval(
    tokenAddress: string,
    spenderAddress: string,
    ownerAddress: string,
    amount: string,
  ): ApprovalTransaction {
    return new ApprovalTransaction(
      tokenAddress,
      spenderAddress,
      ownerAddress,
      amount,
    );
  }

  // isRevoke returns true if this is a revoke transaction (amount = "0")
  public isRevoke(): boolean {
    return this.amount === '0';
  }

  // validate checks all approval parameters and returns validation errors if any
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.tokenAddress || this.tokenAddress.trim() === '') {
      errors.push('Token address is required');
    } else if (!this.isValidAddress(this.tokenAddress)) {
      errors.push('Invalid token address format');
    }

    if (!this.spenderAddress || this.spenderAddress.trim() === '') {
      errors.push('Spender address is required');
    } else if (!this.isValidAddress(this.spenderAddress)) {
      errors.push('Invalid spender address format');
    }

    if (!this.ownerAddress || this.ownerAddress.trim() === '') {
      errors.push('Owner address is required');
    } else if (!this.isValidAddress(this.ownerAddress)) {
      errors.push('Invalid owner address format');
    }

    if (!this.isRevoke() && this.amount.trim() !== '') {
      const amountFloat = parseFloat(this.amount);
      if (isNaN(amountFloat) || amountFloat < 0) {
        errors.push('Amount must be a positive number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // baseAddressToString converts base.Address to hex string format
  private static baseAddressToString(baseAddr: { address?: number[] }): string {
    if (!baseAddr?.address || !Array.isArray(baseAddr.address)) {
      return '';
    }
    return (
      '0x' +
      baseAddr.address.map((b) => b.toString(16).padStart(2, '0')).join('')
    );
  }

  // isValidAddress validates Ethereum address format (0x + 40 hex chars)
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // submit sends the transaction using provided wallet function
  public async submit(
    walletSubmitFn: (tx: types.Function) => Promise<string>,
  ): Promise<string> {
    const operation = this.isRevoke() ? 'revoke' : 'approval';
    return withErrorHandling(async () => {
      return await walletSubmitFn(this.function);
    }, `Submitting ${operation} transaction`);
  }

  // prepare calls backend to get real-time gas estimation from blockchain
  public async prepare(
    payload: types.Payload,
  ): Promise<app.ApprovalTransactionResult> {
    return withErrorHandling(async () => {
      const data: app.ApprovalTransactionData = {
        tokenAddress: this.tokenAddress,
        spenderAddress: this.spenderAddress,
        ownerAddress: this.ownerAddress,
        amount: this.amount,
      };

      const result = await PrepareApprovalTransaction(payload, data);
      if (!result.success) {
        return app.ApprovalTransactionResult.createFrom({
          success: false,
          gasUsed: '0x0',
          error: result.error || 'Unknown error occurred',
        });
      }

      this.function.encoding = result.transactionData.slice(0, 10);

      return app.ApprovalTransactionResult.createFrom({
        success: true,
        transactionData: result.transactionData,
        gasEstimate: result.gasEstimate,
        gasUsed: result.gasEstimate,
        gasPrice: result.gasPrice,
        newAllowance: result.newAllowance,
      });
    }, 'Preparing approval transaction');
  }
}

export class TransactionModelHelpers {
  // formatAddress converts base.Address to hex string
  static formatAddress(address: { address: number[] }): string {
    return (
      '0x' +
      address.address.map((b) => b.toString(16).padStart(2, '0')).join('')
    );
  }

  // validateApproveFunction checks if function matches ERC20 approve(address,uint256) signature
  static validateApproveFunction(func: types.Function): boolean {
    return (
      func.name === 'approve' &&
      func.encoding === '0x095ea7b3' &&
      func.inputs.length === 2 &&
      func.inputs[0]?.type === 'address' &&
      func.inputs[1]?.type === 'uint256'
    );
  }
}
