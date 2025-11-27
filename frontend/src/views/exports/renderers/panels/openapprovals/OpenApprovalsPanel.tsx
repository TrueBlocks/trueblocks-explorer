// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { OpenLink } from '@app';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  InfoAddressRenderer,
  PanelRow,
  PanelTable,
  StyledButton,
  approvalToAddressInfo,
} from '@components';
import { useViewContext } from '@contexts';
import { usePayload } from '@hooks';
import { Group, Text } from '@mantine/core';
import { types } from '@models';
import {
  Log,
  LogError,
  addressToHex,
  displayHash,
  formatNumericValue,
} from '@utils';
import {
  PreparedTransaction,
  TransactionData,
  useWalletConnection,
} from '@wallet';
import { useWalletGatedAction } from '@wallet';
import { useWallet } from '@wallet';
import { ApprovalTransaction, TransactionModelHelpers } from '@wallet';
import { isInfiniteValue } from 'src/components/renderers/utils';

import '../../../../../components/detail/DetailTable.css';

// EXISTING_CODE

export const OpenApprovalsPanel = (rowData: Record<string, unknown> | null) => {
  // EXISTING_CODE
  const { currentView } = useViewContext();
  const createPayload = usePayload(currentView);
  const payload = useMemo(
    () => createPayload('' as types.DataFacet),
    [createPayload],
  );
  const [transactionModal, setTransactionModal] = useState<{
    opened: boolean;
    transactionData: TransactionData | null;
  }>({ opened: false, transactionData: null });
  const [successModal, setSuccessModal] = useState<{
    opened: boolean;
    txHash: string | null;
  }>({ opened: false, txHash: null });
  const [approveModal, setApproveModal] = useState<{
    opened: boolean;
    owner: string;
    spender: string;
    token: string;
    amount: string;
  }>({
    opened: false,
    owner: '',
    spender: '',
    token: '',
    amount: '',
  });

  const approval = useMemo(
    () =>
      (rowData as unknown as types.Approval) || types.Approval.createFrom({}),
    [rowData],
  );

  const addressInfo = useMemo(() => {
    return approvalToAddressInfo(
      approval.owner,
      approval.ownerName,
      approval.spender,
      approval.spenderName,
      approval.token,
      approval.tokenName,
    );
  }, [approval]);

  const allowanceInfo = useMemo(() => {
    return [
      {
        label: 'Allowance',
        value: isInfiniteValue(approval.allowance)
          ? 'infinite'
          : formatNumericValue(approval.allowance || 0),
        isHighlight: Number(approval.allowance) > 0,
      },
      {
        label: 'Block',
        value: approval.lastAppBlock?.toString() || 'N/A',
      },
      {
        label: 'Timestamp',
        value: approval.lastAppTs
          ? new Date(approval.lastAppTs * 1000).toLocaleString()
          : 'N/A',
      },
    ];
  }, [approval]);

  const [isPreparingTransaction, setIsPreparingTransaction] = useState(false);
  const hardcodedCallDataRef = useRef<string>('');
  const { createWalletGatedAction, isWalletConnected, isConnecting } =
    useWalletGatedAction();
  const { walletAddress } = useWallet();
  const { sendTransaction } = useWalletConnection({
    onTransactionSigned: (txHash: string) => {
      setTransactionModal({ opened: false, transactionData: null });
      setSuccessModal({ opened: true, txHash });
      // updateApprovalToZero();
    },
    onError: (error: string) => {
      LogError('Revoke transaction error:', error);
    },
  });

  // Validation functions for approve modal
  const validateAmount = useCallback((amount: string): string => {
    if (amount.trim() === '') {
      return ''; // Empty is valid (means current allowance)
    }

    const numValue = parseFloat(amount);
    if (isNaN(numValue)) {
      return 'Amount must be a valid number';
    }

    if (numValue < 0) {
      return 'Amount cannot be negative';
    }

    // Note: 0 is a valid amount (different from revoke which sets to 0)

    // Check for reasonable decimal places (max 18 for most tokens)
    const decimalPlaces = (amount.split('.')[1] || '').length;
    if (decimalPlaces > 18) {
      return 'Too many decimal places (max 18)';
    }

    return '';
  }, []);

  const validateAddress = useCallback((address: string): boolean => {
    if (!address || address.trim() === '') {
      return false;
    }

    // Basic Ethereum address validation
    const trimmedAddress = address.trim();

    // Must start with 0x and be 42 characters long
    if (!trimmedAddress.startsWith('0x') || trimmedAddress.length !== 42) {
      return false;
    }

    // Must contain only valid hex characters after 0x
    const hexPart = trimmedAddress.slice(2);
    return /^[a-fA-F0-9]{40}$/.test(hexPart);
  }, []);

  const isApproveModalValid = useMemo(() => {
    const isTokenValid = validateAddress(approveModal.token);
    const isSpenderValid = validateAddress(approveModal.spender);
    const isAmountValid = validateAmount(approveModal.amount) === '';

    return isTokenValid && isSpenderValid && isAmountValid;
  }, [
    approveModal.token,
    approveModal.spender,
    approveModal.amount,
    validateAddress,
    validateAmount,
  ]);

  const customPrepareTransaction = useCallback(async () => {
    setIsPreparingTransaction(true);
    try {
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      // Use ApprovalTransaction model for revoke (amount = "0")
      const revokeTransaction = ApprovalTransaction.forRevoke(
        approval,
        walletAddress,
      );

      // Validate function structure
      if (
        !TransactionModelHelpers.validateApproveFunction(
          revokeTransaction.function,
        )
      ) {
        throw new Error('Invalid approve function signature');
      }

      // Log transaction details
      Log(
        `✅ Revoke transaction created using wallet model - Token: ${TransactionModelHelpers.formatAddress(approval.token)}, Spender: ${TransactionModelHelpers.formatAddress(approval.spender)}`,
        `Function encoding: ${revokeTransaction.function.encoding}`,
      );

      // Get transaction object ready for signing
      return await revokeTransaction.getTransactionObject(payload);
    } catch (error) {
      LogError('Failed to prepare revoke transaction:', String(error));
      // Fallback to manual construction for backwards compatibility
      LogError(
        'Failed to prepare transaction using wallet model, using fallback',
        String(error),
      );

      const spenderAddress = addressToHex(approval.spender);
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = '0'.padStart(64, '0');
      const fallbackCallData = '0x095ea7b3' + paddedSpender + paddedAmount;

      return {
        to: addressToHex(approval.token),
        data: fallbackCallData,
        value: '0',
        gas: '0x' + (60000).toString(16),
        gasPrice: '0x' + (20 * 1e9).toString(16),
      } as PreparedTransaction;
    } finally {
      setIsPreparingTransaction(false);
    }
  }, [approval, walletAddress, payload]);

  const handleConfirmTransaction = useCallback(
    async (preparedTx: PreparedTransaction) => {
      try {
        await sendTransaction(preparedTx);
      } catch (error) {
        LogError('Failed to send revoke transaction:', String(error));
      }
    },
    [sendTransaction],
  );

  const createRevokeTransaction = useCallback(() => {
    try {
      const spenderAddress = addressToHex(approval.spender);

      // Generate calldata for display (same as before for visual purposes)
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = '0'.padStart(64, '0');
      const callData = '0x095ea7b3' + paddedSpender + paddedAmount;
      hardcodedCallDataRef.current = callData;

      const transactionData: TransactionData = {
        to: addressToHex(approval.token),
        function: {
          name: 'approve',
          type: 'function',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
          encoding: '0x095ea7b3',
          convertValues: () => {},
        } as types.Function,
        inputs: [
          { name: 'spender', type: 'address', value: spenderAddress },
          { name: 'amount', type: 'uint256', value: '0' },
        ],
        value: '0',
      };
      setTransactionModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating revoke transaction:', String(error));
    }
  }, [approval]);

  const createApprovalTransaction = useCallback(
    async (amount: string, token: string, spender: string) => {
      setIsPreparingTransaction(true);
      try {
        if (!walletAddress) {
          throw new Error('Wallet not connected');
        }

        // Use ApprovalTransaction model
        const approvalTransaction = ApprovalTransaction.forApproval(
          token,
          spender,
          walletAddress,
          amount,
        );

        // Validate inputs using built-in validation
        const validation = approvalTransaction.validate();
        if (!validation.isValid) {
          throw new Error('Validation failed: ' + validation.errors.join(', '));
        }

        // Validate function structure
        if (
          !TransactionModelHelpers.validateApproveFunction(
            approvalTransaction.function,
          )
        ) {
          throw new Error('Invalid approve function signature');
        }

        // Log transaction details
        Log(
          `✅ Approval transaction created using wallet model - Amount: ${amount || '0'} tokens, Token: ${token}, Spender: ${spender}`,
          `Function encoding: ${approvalTransaction.function.encoding}`,
        );

        // Get transaction object and execute
        const preparedTx =
          await approvalTransaction.getTransactionObject(payload);
        await sendTransaction(preparedTx);

        // Close modal on success
        setApproveModal({
          opened: false,
          owner: '',
          spender: '',
          token: '',
          amount: '',
        });
      } catch (error) {
        LogError('Failed to prepare/send approval transaction:', String(error));
      } finally {
        setIsPreparingTransaction(false);
      }
    },
    [sendTransaction, walletAddress, payload],
  );

  const handleRevoke = createWalletGatedAction(() => {
    createRevokeTransaction();
  }, 'Revoke');

  const handleApprove = createWalletGatedAction(() => {
    setApproveModal({
      opened: true,
      owner: addressToHex(walletAddress || ''),
      spender: addressToHex(approval.spender || ''),
      token: addressToHex(approval.token || ''),
      amount: '',
    });
  }, 'Approve');

  const handleModalClose = useCallback(() => {
    setTransactionModal({ opened: false, transactionData: null });
  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setSuccessModal({ opened: false, txHash: null });
  }, []);

  // Handle no data case but still show the approve button
  const hasApprovalData = rowData && approval.token && approval.spender;

  return (
    <>
      <DetailContainer>
        <DetailHeader>
          <Group justify="space-between" align="flex-start">
            <div style={{ display: 'flex', gap: '12px' }}>
              <StyledButton
                onClick={handleRevoke}
                size="sm"
                disabled={
                  !hasApprovalData || isPreparingTransaction || isConnecting
                }
                title={
                  isConnecting
                    ? 'Connecting wallet... Please check your wallet app and scan the QR code'
                    : isPreparingTransaction
                      ? 'Preparing transaction with current gas prices...'
                      : !isWalletConnected
                        ? 'Connect wallet to revoke approval'
                        : !hasApprovalData
                          ? 'No approval data available'
                          : 'Revoke this token approval'
                }
              >
                {isConnecting
                  ? 'Connecting...'
                  : isPreparingTransaction
                    ? 'Preparing...'
                    : 'Revoke'}
              </StyledButton>
              <StyledButton
                onClick={handleApprove}
                size="sm"
                disabled={isPreparingTransaction || isConnecting}
                title={
                  isConnecting
                    ? 'Connecting wallet... Please check your wallet app and scan the QR code'
                    : isPreparingTransaction
                      ? 'Preparing transaction with current gas prices...'
                      : !isWalletConnected
                        ? 'Connect wallet to approve tokens'
                        : 'Grant token approval'
                }
              >
                {isConnecting
                  ? 'Connecting...'
                  : isPreparingTransaction
                    ? 'Preparing...'
                    : 'Approve'}
              </StyledButton>
              {isConnecting && (
                <Text size="xs" c="dimmed" mt={4}>
                  📱 Check your wallet app and scan the QR code to connect
                  <br />
                  💡 If the modal closes, click the button again to retry
                </Text>
              )}
            </div>
            <Text variant="primary" size="md" fw={600}>
              {hasApprovalData
                ? `Approval ${displayHash(approval.token)} ${approval.tokenName || 'Token'}`
                : 'Token Approval Management'}
            </Text>
          </Group>
        </DetailHeader>
        {!hasApprovalData && (
          <DetailSection title={'No Open Approvals'}>
            <div
              style={{ padding: '16px', textAlign: 'center', color: '#666' }}
            >
              <p style={{ margin: '0', fontSize: '14px' }}>
                You may still create new token approvals using the Approve
                button above.
              </p>
            </div>
          </DetailSection>
        )}
        {hasApprovalData && (
          <DetailSection title={'Information'}>
            <InfoAddressRenderer addressInfo={addressInfo} />
          </DetailSection>
        )}
        <DetailSection
          title={'Allowance Details'}
          cond={Boolean(hasApprovalData && allowanceInfo)}
        >
          <PanelTable>
            {allowanceInfo.map((item, index) => (
              <PanelRow
                key={index}
                label={item.label}
                value={
                  <span
                    style={{
                      fontFamily: item.label.includes('Allowance')
                        ? 'monospace'
                        : 'inherit',
                      fontSize: '14px',
                      fontWeight: item.isHighlight ? 600 : 'normal',
                      color: item.isHighlight
                        ? 'var(--mantine-color-red-6)'
                        : 'inherit',
                    }}
                    title={String(item.value)}
                  >
                    {item.value}
                  </span>
                }
              />
            ))}
          </PanelTable>
        </DetailSection>
      </DetailContainer>
      {transactionModal.opened && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
            onClick={handleModalClose}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            <h3>Confirm Revoke Transaction</h3>
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
              }}
            >
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                ⚠️ You are about to revoke approval for:
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Token:</strong> {addressToHex(approval.token)} (
                {approval.tokenName || 'Unknown'})
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Spender:</strong> {addressToHex(approval.spender)} (
                {approval.spenderName || 'Unknown'})
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>Action:</strong> Set allowance to 0 (complete
                revocation)
              </p>
            </div>
            <div>
              <strong>Transaction Details:</strong>
              <div
                style={{
                  fontSize: '12px',
                  marginTop: '8px',
                  padding: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  wordBreak: 'break-all',
                }}
              >
                <div>
                  <strong>Function:</strong> approve(address,uint256)
                </div>
                <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>
                  <strong>Spender:</strong> {addressToHex(approval.spender)}
                </div>
                <div style={{ fontFamily: 'monospace' }}>
                  <strong>Amount:</strong> 0 (revoke all)
                </div>
                <div
                  style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}
                >
                  Gas limit and price will be estimated when you confirm
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <strong>Calldata:</strong>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  marginTop: '8px',
                  padding: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  wordBreak: 'break-all',
                }}
              >
                {(() => {
                  const calldata = hardcodedCallDataRef.current;
                  if (!calldata)
                    return 'Calldata will be generated when transaction is prepared';
                  // Function selector (first 4 bytes = 8 hex chars)
                  const selector = calldata.slice(0, 10); // includes 0x
                  // Parameters (remaining data in 32-byte chunks = 64 hex chars each)
                  const params = calldata.slice(10);
                  const chunks = [];
                  for (let i = 0; i < params.length; i += 64) {
                    chunks.push(params.slice(i, i + 64));
                  }
                  return (
                    <>
                      <div>{selector}</div>
                      {chunks.map((chunk, index) => (
                        <div key={index}>0x{chunk}</div>
                      ))}
                    </>
                  );
                })()}
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={async () => {
                  const preparedTx = await customPrepareTransaction();
                  await handleConfirmTransaction(preparedTx);
                }}
              >
                Confirm
              </button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </>
      )}
      {successModal.opened && successModal.txHash && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
            onClick={handleSuccessModalClose}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '400px',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#28a745' }}>
                Transaction Sent!
              </h3>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                Your revoke transaction has been submitted to the network.
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              <p
                style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}
              >
                Transaction Hash:
              </p>
              <code
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  display: 'block',
                  padding: '4px',
                }}
              >
                {successModal.txHash}
              </code>
            </div>
            <div
              style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
            >
              <button
                onClick={() =>
                  OpenLink('transactionHash', successModal.txHash!)
                }
                style={{
                  padding: '10px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                View on Etherscan
              </button>
              <button
                onClick={handleSuccessModalClose}
                style={{
                  padding: '10px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {approveModal.opened && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
            onClick={() =>
              setApproveModal({
                opened: false,
                owner: '',
                spender: '',
                token: '',
                amount: '',
              })
            }
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '24px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '500px',
            }}
          >
            <h3>Grant Token Approval</h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Owner Address (Connected Wallet):
                </label>
                <input
                  type="text"
                  value={approveModal.owner}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    cursor: 'not-allowed',
                  }}
                  title="Owner address is automatically set to your connected wallet address"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Token Contract Address:
                </label>
                <input
                  type="text"
                  value={approveModal.token}
                  onChange={(e) =>
                    setApproveModal({ ...approveModal, token: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}
                  placeholder="Enter token contract address"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Spender Address:
                </label>
                <input
                  type="text"
                  value={approveModal.spender}
                  onChange={(e) =>
                    setApproveModal({
                      ...approveModal,
                      spender: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}
                  placeholder="Enter spender address (contract/address to approve)"
                />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                Approval Amount:
              </label>
              <input
                type="text"
                placeholder="Enter amount (e.g., 100) or leave empty for current allowance"
                value={approveModal.amount}
                onChange={(e) =>
                  setApproveModal({ ...approveModal, amount: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                }}
              />
              <p
                style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}
              >
                💡 This amount will replace any existing allowance for this
                token/spender pair. Leave empty to set allowance to 0
                (effectively revoking approval).
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() =>
                  createApprovalTransaction(
                    approveModal.amount,
                    approveModal.token,
                    approveModal.spender,
                  )
                }
                disabled={isPreparingTransaction || !isApproveModalValid}
                title={
                  isPreparingTransaction
                    ? 'Processing transaction...'
                    : !isApproveModalValid
                      ? 'Please enter valid token and spender addresses and a valid amount'
                      : 'Confirm the approval transaction'
                }
                style={{
                  padding: '10px 16px',
                  background:
                    isPreparingTransaction || !isApproveModalValid
                      ? '#6c757d'
                      : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor:
                    isPreparingTransaction || !isApproveModalValid
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    isPreparingTransaction || !isApproveModalValid ? 0.6 : 1,
                }}
              >
                {isPreparingTransaction ? 'Processing...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() =>
                  setApproveModal({
                    opened: false,
                    owner: '',
                    spender: '',
                    token: '',
                    amount: '',
                  })
                }
                style={{
                  padding: '10px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
