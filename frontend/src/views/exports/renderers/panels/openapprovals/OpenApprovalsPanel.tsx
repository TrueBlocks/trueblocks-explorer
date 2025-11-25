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
import { useWalletGatedAction } from '@hooks';
import { Group, Text } from '@mantine/core';
import { types } from '@models';
import {
  LogError,
  PreparedTransaction,
  TransactionData,
  addressToHex,
  displayHash,
  formatNumericValue,
  useWalletConnection,
} from '@utils';
import { isInfiniteValue } from 'src/components/renderers/utils';

import '../../../../../components/detail/DetailTable.css';

// EXISTING_CODE

export const OpenApprovalsPanel = (rowData: Record<string, unknown> | null) => {
  // EXISTING_CODE
  const [transactionModal, setTransactionModal] = useState<{
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

  const hardcodedCallDataRef = useRef<string>('');
  const { createWalletGatedAction, isWalletConnected, isConnecting } =
    useWalletGatedAction();
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

  const customPrepareTransaction = useCallback(async () => {
    return {
      to: addressToHex(approval.token),
      data: hardcodedCallDataRef.current,
      value: '0',
      gas: '100000', // Standard gas limit for ERC20 approve
      gasPrice: '20000000000', // 20 gwei default
    } as PreparedTransaction;
  }, [approval.token]);

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

  const handleRevoke = createWalletGatedAction(() => {
    createRevokeTransaction();
  }, 'Revoke');

  const handleModalClose = useCallback(() => {
    setTransactionModal({ opened: false, transactionData: null });
  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setSuccessModal({ opened: false, txHash: null });
  }, []);

  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  return (
    <>
      <DetailContainer>
        <DetailHeader>
          <Group justify="space-between" align="flex-start">
            <div>
              <StyledButton
                onClick={handleRevoke}
                size="sm"
                disabled={!approval.token || !approval.spender || isConnecting}
                title={
                  isConnecting
                    ? 'Connecting wallet... Please check your wallet app and scan the QR code'
                    : !isWalletConnected
                      ? 'Connect wallet to revoke approval'
                      : !approval.token || !approval.spender
                        ? 'Invalid approval data'
                        : 'Revoke this token approval'
                }
              >
                {isConnecting
                  ? 'Connecting...'
                  : isWalletConnected
                    ? 'Revoke'
                    : 'Connect & Revoke'}
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
              {`Approval ${displayHash(approval.token)} ${approval.tokenName || 'Token'}`}
            </Text>
          </Group>
        </DetailHeader>
        <DetailSection title={'Information'}>
          <InfoAddressRenderer addressInfo={addressInfo} />
        </DetailSection>
        <DetailSection title={'Allowance Details'} cond={!!allowanceInfo}>
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
                  if (!calldata) return '';
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
    </>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
