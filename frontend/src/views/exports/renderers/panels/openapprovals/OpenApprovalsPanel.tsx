// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React, { useCallback, useMemo, useState } from 'react';

import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  InfoAddressRenderer,
  PanelRow,
  PanelTable,
  StyledButton,
  TransactionSuccessModal,
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
  emitError,
  emitStatus,
  formatNumericValue,
} from '@utils';
import {
  PreparedTransaction,
  TransactionData,
  TxReviewModal,
  buildTransaction,
  useWallet,
  useWalletConnection,
  useWalletGatedAction,
} from '@wallet';
import { isInfiniteValue } from 'src/components/renderers/utils';

import '../../../../../components/detail/DetailTable.css';

// Standard ERC20 approve function ABI
export const ERC20_APPROVE_FUNCTION: types.Function = {
  name: 'approve',
  type: 'function',
  inputs: [
    types.Parameter.createFrom({
      name: 'spender',
      type: 'address',
      internalType: 'address',
    }),
    types.Parameter.createFrom({
      name: 'amount',
      type: 'uint256',
      internalType: 'uint256',
    }),
  ],
  outputs: [
    types.Parameter.createFrom({
      name: '',
      type: 'bool',
      internalType: 'bool',
    }),
  ],
  stateMutability: 'nonpayable',
  encoding: '0x095ea7b3',
  convertValues: () => {},
};

// EXISTING_CODE

export const OpenApprovalsPanel = (
  rowData: Record<string, unknown> | null,
  onFinal?: (rowKey: string, newValue: string, txHash: string) => void,
) => {
  // EXISTING_CODE

  const { currentView } = useViewContext();
  const createPayload = usePayload(currentView);
  const payload = useMemo(
    () => createPayload('' as types.DataFacet),
    [createPayload],
  );
  const [revokeModal, setRevokeModal] = useState<{
    opened: boolean;
    transactionData: TransactionData | null;
  }>({ opened: false, transactionData: null });
  const [approveModal, setApproveModal] = useState<{
    opened: boolean;
    transactionData: TransactionData | null;
  }>({ opened: false, transactionData: null });
  const [successModal, setSuccessModal] = useState<{
    opened: boolean;
    txHash: string | null;
  }>({ opened: false, txHash: null });

  // State to track pending transaction amount
  const [pendingAmount, setPendingAmount] = useState<string>('');

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

  const [isPreparingTransaction] = useState(false);
  const { createWalletGatedAction, isWalletConnected, isConnecting } =
    useWalletGatedAction();
  useWallet();
  const { sendTransaction } = useWalletConnection({
    onTransactionSigned: (txHash: string) => {
      setRevokeModal({ opened: false, transactionData: null });
      setApproveModal({ opened: false, transactionData: null });
      setSuccessModal({ opened: true, txHash });
      emitStatus('Transaction submitted successfully');

      // Call onFinal callback for demo hack
      if (onFinal && pendingAmount !== '') {
        // Generate the same row key used in the facet: owner-token-spender
        const rowKey = `${approval.owner}-${approval.token}-${approval.spender}`;
        Log(
          `[OpenApprovalsPanel] POST-CONFIRM: Calling onFinal: rowKey=${rowKey}, amount=${pendingAmount}, txHash=${txHash}`,
        );
        onFinal(rowKey, pendingAmount, txHash);
        setPendingAmount(''); // Clear pending amount
      }
    },
    onError: (error: string) => {
      LogError('Transaction error:', error);
      emitError('Transaction rejected by wallet');
      setPendingAmount(''); // Clear pending amount on error
    },
  });

  // Helper: Get token address from row data or payload
  const getTokenAddress = useCallback((): string => {
    return addressToHex(approval.token) || payload.activeContract || '';
  }, [approval.token, payload.activeContract]);

  const handleConfirmTransaction = useCallback(
    async (preparedTx: PreparedTransaction) => {
      try {
        // For approve transactions, use current allowance as demo hack amount
        // (revoke already sets to '0' in createRevokeTransaction)
        if (pendingAmount === '') {
          const currentAllowance = approval.allowance || '0';
          setPendingAmount(currentAllowance);
          Log(
            `[OpenApprovalsPanel] CONFIRM: Setting pendingAmount from current allowance: ${currentAllowance}`,
          );
        }

        await sendTransaction(preparedTx);
      } catch (error) {
        LogError('Failed to send transaction:', String(error));
        emitError('Failed to submit transaction to network');
        throw error;
      }
    },
    [sendTransaction, approval.allowance, pendingAmount],
  );

  const createRevokeTransaction = useCallback(() => {
    try {
      const spenderAddress = addressToHex(approval.spender);

      const transactionData: TransactionData = buildTransaction(
        addressToHex(approval.token),
        ERC20_APPROVE_FUNCTION,
        [
          { name: 'spender', type: 'address', value: spenderAddress },
          { name: 'amount', type: 'uint256', value: '0' },
        ],
      );

      // Track revoke amount for demo hack
      setPendingAmount('0');
      Log(`[OpenApprovalsPanel] CONFIRM: Setting pendingAmount for revoke: 0`);

      setRevokeModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating revoke transaction:', String(error));
      emitError('Failed to prepare revoke transaction');
    }
  }, [approval]);

  const createApprovalTransaction = useCallback(() => {
    try {
      // Build transaction data with empty values for user to fill
      const transactionData: TransactionData = buildTransaction(
        getTokenAddress(),
        ERC20_APPROVE_FUNCTION,
        [
          {
            name: 'spender',
            type: 'address',
            value: approval.spender ? addressToHex(approval.spender) : '',
          },
          { name: 'amount', type: 'uint256', value: '' },
        ],
      );

      setApproveModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating approval transaction:', String(error));
      emitError('Failed to prepare approval transaction');
    }
  }, [approval, getTokenAddress]);

  const handleRevoke = createWalletGatedAction(() => {
    createRevokeTransaction();
  }, 'Revoke');

  const handleApprove = createWalletGatedAction(() => {
    createApprovalTransaction();
  }, 'Approve');

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
                    ? 'Pending...'
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
      <TxReviewModal
        opened={revokeModal.opened}
        onClose={() => setRevokeModal({ opened: false, transactionData: null })}
        transactionData={revokeModal.transactionData}
        onConfirm={handleConfirmTransaction}
        editable={false}
      />
      <TxReviewModal
        opened={approveModal.opened}
        onClose={() =>
          setApproveModal({ opened: false, transactionData: null })
        }
        transactionData={approveModal.transactionData}
        onConfirm={handleConfirmTransaction}
        editable={true}
        rowData={{
          tokenAddress: approval.token
            ? addressToHex(approval.token)
            : undefined,
          spenderAddress: approval.spender
            ? addressToHex(approval.spender)
            : undefined,
        }}
      />
      <TransactionSuccessModal
        opened={successModal.opened}
        transactionHash={successModal.txHash}
        onClose={handleSuccessModalClose}
        title="Transaction Sent!"
        message="Your revoke transaction has been submitted to the network."
      />
      {revokeModal.opened && revokeModal.transactionData && (
        <TxReviewModal
          opened={revokeModal.opened}
          onClose={() =>
            setRevokeModal({ opened: false, transactionData: null })
          }
          transactionData={revokeModal.transactionData}
          onConfirm={handleConfirmTransaction}
          editable={false}
        />
      )}
      {approveModal.opened && approveModal.transactionData && (
        <TxReviewModal
          opened={approveModal.opened}
          onClose={() =>
            setApproveModal({ opened: false, transactionData: null })
          }
          transactionData={approveModal.transactionData}
          onConfirm={handleConfirmTransaction}
          editable={true}
          rowData={{
            tokenAddress: addressToHex(approval.token),
            spenderAddress: addressToHex(approval.spender),
          }}
        />
      )}
    </>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
