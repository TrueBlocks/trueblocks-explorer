// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React, { useCallback, useMemo, useState } from 'react';

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
  LogError,
  addressToHex,
  displayHash,
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

export const OpenApprovalsPanel = (rowData: Record<string, unknown> | null) => {
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
    },
    onError: (error: string) => {
      LogError('Transaction error:', error);
    },
  });

  // Helper: Get token address from row data or payload
  const getTokenAddress = useCallback((): string => {
    return addressToHex(approval.token) || payload.activeContract || '';
  }, [approval.token, payload.activeContract]);

  const handleConfirmTransaction = useCallback(
    async (preparedTx: PreparedTransaction) => {
      try {
        await sendTransaction(preparedTx);
      } catch (error) {
        LogError('Failed to send transaction:', String(error));
        throw error;
      }
    },
    [sendTransaction],
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

      setRevokeModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating revoke transaction:', String(error));
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
