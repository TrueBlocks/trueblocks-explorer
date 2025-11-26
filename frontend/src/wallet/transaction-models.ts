import { types } from '@models';

import { getErrorMessage, withErrorHandling } from './error-simple';

/**
 * Simple simulation result for transaction preview
 */
export interface SimulationResult {
  success: boolean;
  gasUsed: string;
  error?: string;
  currentAllowance?: string;
  newAllowance?: string;
}

/**
 * Represents an ERC20 Approval transaction (including revokes with amount = "0")
 */
export class ApprovalTransaction {
  public function: types.Function;
  public tokenAddress: string;
  public spenderAddress: string;
  public ownerAddress: string;
  public amount: string; // Amount in token units, "0" for revokes

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

  /**
   * Creates the ERC20 approve function definition
   */
  private createApproveFunction(): types.Function {
    const spenderParam = new types.Parameter();
    spenderParam.name = 'spender';
    spenderParam.type = 'address';
    spenderParam.value = this.spenderAddress;

    const amountParam = new types.Parameter();
    amountParam.name = 'amount';
    amountParam.type = 'uint256';
    amountParam.value = this.getAmountWei();

    const func = new types.Function();
    func.name = 'approve';
    func.type = 'function';
    func.stateMutability = 'nonpayable';
    func.encoding = '0x095ea7b3'; // approve(address,uint256) function selector
    func.inputs = [spenderParam, amountParam];
    func.outputs = []; // approve returns bool but we don't need to model the return

    return func;
  }

  /**
   * Converts the amount to wei (assumes 18 decimals for now)
   */
  private getAmountWei(): string {
    if (this.amount.trim() === '' || this.amount.trim() === '0') {
      return '0';
    }

    const amountFloat = parseFloat(this.amount);
    if (isNaN(amountFloat) || amountFloat < 0) {
      throw new Error('Invalid amount: must be a positive number');
    }

    return (amountFloat * 1e18).toString();
  }

  /**
   * Gets the transaction data for this approval operation
   */
  public getTransactionData(): string {
    const spenderHex = this.spenderAddress.startsWith('0x')
      ? this.spenderAddress.slice(2).padStart(64, '0')
      : this.spenderAddress.padStart(64, '0');

    const amountWei = this.getAmountWei();
    const amountBigInt = BigInt(amountWei);
    const amountHex = amountBigInt.toString(16).padStart(64, '0');

    return this.function.encoding + spenderHex + amountHex;
  }

  /**
   * Gets the complete transaction object ready for signing
   */
  public getTransactionObject(): {
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  } {
    const gasLimitDecimal = 60000;
    const gasPriceGwei = 20;
    const gasPriceWei = gasPriceGwei * 1e9;

    return {
      to: this.tokenAddress,
      data: this.getTransactionData(),
      value: '0x0',
      gas: '0x' + gasLimitDecimal.toString(16),
      gasPrice: '0x' + gasPriceWei.toString(16),
    };
  }

  /**
   * Creates a revoke transaction (approval with amount = "0") from existing approval
   */
  public static forRevoke(
    approval: types.Approval,
    ownerAddress: string,
  ): ApprovalTransaction {
    return new ApprovalTransaction(
      approval.token.address.join(''), // Convert base.Address to string
      approval.spender.address.join(''), // Convert base.Address to string
      ownerAddress,
      '0', // Revoke = amount 0
    );
  }

  /**
   * Creates an approval transaction with specific amount
   */
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

  /**
   * Checks if this is a revoke transaction
   */
  public isRevoke(): boolean {
    return this.amount === '0';
  }

  /**
   * Validates the approval parameters
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate token address
    if (!this.tokenAddress || this.tokenAddress.trim() === '') {
      errors.push('Token address is required');
    } else if (!this.isValidAddress(this.tokenAddress)) {
      errors.push('Invalid token address format');
    }

    // Validate spender address
    if (!this.spenderAddress || this.spenderAddress.trim() === '') {
      errors.push('Spender address is required');
    } else if (!this.isValidAddress(this.spenderAddress)) {
      errors.push('Invalid spender address format');
    }

    // Validate owner address
    if (!this.ownerAddress || this.ownerAddress.trim() === '') {
      errors.push('Owner address is required');
    } else if (!this.isValidAddress(this.ownerAddress)) {
      errors.push('Invalid owner address format');
    }

    // Validate amount
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

  /**
   * Validates Ethereum address format
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Submits the transaction
   */
  public async submit(
    walletSubmitFn: (tx: types.Function) => Promise<string>,
  ): Promise<string> {
    const operation = this.isRevoke() ? 'revoke' : 'approval';
    return withErrorHandling(async () => {
      return await walletSubmitFn(this.function);
    }, `Submitting ${operation} transaction`);
  }

  /**
   * Simulates the transaction without executing
   */
  public async simulate(rpcProvider: string): Promise<SimulationResult> {
    try {
      // Get current allowance
      const currentAllowance = await this.getCurrentAllowance(rpcProvider);

      // Simulate the transaction
      const gasUsed = await this.estimateGas(rpcProvider, this.function);

      return {
        success: true,
        gasUsed,
        currentAllowance,
        newAllowance: this.amount,
      };
    } catch (error) {
      return {
        success: false,
        gasUsed: '0x0',
        error: getErrorMessage(error),
      };
    }
  }

  private async getCurrentAllowance(rpcProvider: string): Promise<string> {
    const data =
      '0xdd62ed3e' +
      this.ownerAddress.slice(2).padStart(64, '0') +
      this.spenderAddress.slice(2).padStart(64, '0');

    const response = await fetch(rpcProvider, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: this.tokenAddress, data }, 'latest'],
      }),
    });

    const result = await response.json();
    return result.result || '0x0';
  }

  private async estimateGas(
    rpcProvider: string,
    txObject: types.Function,
  ): Promise<string> {
    const response = await fetch(rpcProvider, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'eth_estimateGas',
        params: [txObject],
      }),
    });

    const result = await response.json();
    return result.result || '0x0';
  }
}

/**
 * Utility class for transaction-related helper functions
 */
export class TransactionModelHelpers {
  /**
   * Formats a base.Address to hex string
   */
  static formatAddress(address: { address: number[] }): string {
    return (
      '0x' +
      address.address.map((b) => b.toString(16).padStart(2, '0')).join('')
    );
  }

  /**
   * Validates that a function matches the expected ERC20 approve signature
   */
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
