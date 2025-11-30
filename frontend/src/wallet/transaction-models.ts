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

  // getTransactionObject encodes + estimates gas, returns transaction ready for signing
  public async getTransactionObject(payload: types.Payload): Promise<{
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  }> {
    // Import at top of function to avoid circular dependencies
    const { EncodeTransaction, EstimateGasAndPrice } = await import('@app');

    // Step 1: Encode the transaction using generic EncodeTransaction
    // Amount is already in wei format from frontend conversion
    const encodeRequest = app.EncodeTransactionRequest.createFrom({
      contractAddress: this.tokenAddress,
      signature: 'approve(address,uint256)',
      arguments: [this.spenderAddress, this.amount],
    });

    const encodeResult = await EncodeTransaction(payload, encodeRequest);
    if (!encodeResult.success || !encodeResult.data) {
      throw new Error(
        `Failed to encode ${this.isRevoke() ? 'revoke' : 'approval'} transaction: ${
          encodeResult.error || 'Encoding failed'
        }`,
      );
    }

    // Step 2: Estimate gas and get gas price
    const gasRequest = app.TransactionPayload.createFrom({
      from: this.ownerAddress,
      to: this.tokenAddress,
      data: encodeResult.data,
      value: '0x0',
    });

    const gasResult = await EstimateGasAndPrice(payload, gasRequest);
    if (!gasResult.success) {
      throw new Error(
        `Failed to estimate gas: ${gasResult.error || 'Gas estimation failed'}. Transaction cancelled.`,
      );
    }

    if (!gasResult.gasEstimate || !gasResult.gasPrice) {
      throw new Error(
        `Backend returned success but missing gas values. Transaction cancelled.`,
      );
    }

    return {
      to: this.tokenAddress,
      data: encodeResult.data,
      value: '0x0',
      gas: gasResult.gasEstimate.startsWith('0x')
        ? gasResult.gasEstimate
        : '0x' + parseInt(gasResult.gasEstimate).toString(16),
      gasPrice: gasResult.gasPrice.startsWith('0x')
        ? gasResult.gasPrice
        : '0x' + parseInt(gasResult.gasPrice).toString(16),
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
