// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { OpenLink, Reload } from '@app';
import {
  BorderedSection,
  DetailPanelContainer,
  InfoAddressRenderer,
  PanelRow,
  PanelTable,
  StyledButton,
  approvalToAddressInfo,
  txToDetailsInfo,
} from '@components';
import { useWalletGatedAction } from '@hooks';
import { usePayload } from '@hooks';
import { Group, Stack, Text } from '@mantine/core';
import { crud } from '@models';
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
} from '@utils';

import { Crud as ExportsCrud } from '../../../../../../wailsjs/go/exports/ExportsCollection';
import '../../../../../components/detail/DetailTable.css';

/*
// Helper functions
const formatTimestamp = (timestamp: number | string): string => {
  const numTimestamp = Number(timestamp);
  if (isNaN(numTimestamp) || numTimestamp <= 0) {
    return 'No timestamp';
  }
  return new Date(numTimestamp * 1000).toLocaleString(undefined, {
    hour12: false,
  });
};

const truncateAddress = (address: unknown): string => {
  if (!address) return 'N/A';
  const hex = addressToHex(address);
  if (!hex || hex.length < 10) return hex;
  return `${hex.slice(0, 6)}...${hex.slice(-4)}`;
};
*/

export const OpenApprovalsPanel = (rowData: Record<string, unknown> | null) => {
  // Collapse state management
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Store hardcoded calldata for transaction preparation
  const hardcodedCallDataRef = useRef<string>('');

  const [transactionModal, setTransactionModal] = useState<{
    opened: boolean;
    transactionData: TransactionData | null;
  }>({ opened: false, transactionData: null });

  const [successModal, setSuccessModal] = useState<{
    opened: boolean;
    txHash: string | null;
  }>({ opened: false, txHash: null });

  const { createWalletGatedAction } = useWalletGatedAction();
  const createPayload = usePayload('exports'); // Handle section toggle
  const handleToggle = (sectionName: string) => {
    const isCollapsed = collapsed.has(sectionName);
    if (isCollapsed) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(sectionName);
        return next;
      });
    } else {
      setCollapsed((prev) => new Set([...prev, sectionName]));
    }
  };

  // Memoize approval conversion to avoid dependency warnings
  const approval = useMemo(
    () => (rowData as unknown as types.Approval) || ({} as types.Approval),
    [rowData],
  );

  // Update approval allowance to zero
  const updateApprovalToZero = useCallback(async () => {
    try {
      const updatedApproval = {
        ...approval,
        allowance: '0',
        lastAppTs: Math.floor(Date.now() / 1000), // Current timestamp
      };

      // Create payload for the CRUD operation using OpenApprovals facet
      const payload = createPayload(types.DataFacet.OPENAPPROVALS);

      // Update in backend
      await ExportsCrud(payload, crud.Operation.UPDATE, updatedApproval);

      // Trigger a reload of the exports data to sync with backend
      await Reload(payload);
    } catch (error) {
      LogError('Failed to update approval allowance:', String(error));
      // Note: If backend update fails, the optimistic update will be overwritten
      // when Reload() fetches fresh data from the backend
    }
  }, [approval, createPayload]);

  const { sendTransaction } = useWalletConnection({
    onTransactionSigned: (txHash: string) => {
      Log('✅ Revoke transaction signed:', txHash);
      Log('🔍 View on Etherscan: https://etherscan.io/tx/' + txHash);
      setTransactionModal({ opened: false, transactionData: null });
      setSuccessModal({ opened: true, txHash });

      // Update the approval allowance to zero in the backend and refresh data
      updateApprovalToZero();
    },
    onError: (error: string) => {
      LogError('Revoke transaction error:', error);
    },
  });

  // Memoized converter functions (called before early return to maintain hook order)
  const detailsInfo = useMemo(() => {
    if (!rowData) return null;
    // Create a pseudo-transaction structure for the InfoDetailsRenderer
    const pseudoTransaction = {
      hash: approval.token, // Use token address as hash for display
      blockNumber: approval.blockNumber,
      blockHash: approval.token, // Use token as block hash placeholder
      transactionIndex: 0,
      timestamp: approval.timestamp,
      nonce: 0,
      type: 'approval',
      value: approval.allowance,
      from: approval.owner,
      fromName: approval.ownerName,
      to: approval.spender,
      toName: approval.spenderName,
      // Add missing required fields with default values
      gas: 0,
      gasPrice: 0,
      gasUsed: 0,
      hasToken: false,
      isError: false,
      receipt: null,
      traces: [],
    };
    return txToDetailsInfo(pseudoTransaction as unknown as types.Transaction);
  }, [rowData, approval]);

  const addressInfo = useMemo(() => {
    if (!rowData) return null;
    return approvalToAddressInfo(
      approval.owner,
      approval.ownerName,
      approval.spender,
      approval.spenderName,
    );
  }, [rowData, approval]);

  const tokenInfo = useMemo(() => {
    if (!rowData) return null;
    return [
      {
        label: 'Token',
        value: addressToHex(approval.token),
        name: approval.tokenName,
      },
      {
        label: 'Name',
        value: approval.tokenName || 'Unknown Token',
      },
    ];
  }, [rowData, approval]);

  const allowanceInfo = useMemo(() => {
    if (!rowData) return null;
    return [
      {
        label: 'Allowance',
        value: formatNumericValue(approval.allowance || 0),
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
  }, [rowData, approval]);

  // Custom prepare transaction that uses hardcoded calldata
  const customPrepareTransaction = useCallback(async () => {
    return {
      to: addressToHex(approval.token),
      data: hardcodedCallDataRef.current,
      value: '0',
      gas: '100000', // Standard gas limit for ERC20 approve
      gasPrice: '20000000000', // 20 gwei default
    } as PreparedTransaction;
  }, [approval.token]);

  // Handle transaction confirmation from modal
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

  // Create revoke transaction
  const createRevokeTransaction = useCallback(() => {
    try {
      Log('Creating hardcoded revoke transaction data');

      // ERC20 approve(address spender, uint256 amount) calldata construction
      // Function selector: 0x095ea7b3
      const spenderAddress = addressToHex(approval.spender);

      // Remove 0x prefix and pad spender to 32 bytes (64 hex chars)
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');

      // Amount = 0 padded to 32 bytes (64 hex chars)
      const paddedAmount = '0'.padStart(64, '0');

      // Construct complete calldata: selector + spender + amount
      const callData = '0x095ea7b3' + paddedSpender + paddedAmount;

      Log('Hardcoded calldata:', callData);

      // Store the hardcoded calldata for the modal to use
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

      Log('Transaction data created:', JSON.stringify(transactionData));

      // Open the transaction modal
      setTransactionModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating revoke transaction:', String(error));
    }
  }, [approval]);

  // Handle revoke action with wallet gating
  const handleRevoke = createWalletGatedAction(() => {
    createRevokeTransaction();
  }, 'Revoke');

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setTransactionModal({ opened: false, transactionData: null });
  }, []);

  // Handle success modal close
  const handleSuccessModalClose = useCallback(() => {
    setSuccessModal({ opened: false, txHash: null });
  }, []);

  // Show loading state if no data is provided (moved after all hooks)
  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  // Title component with key identifying info
  const titleComponent = () => (
    <Group justify="space-between" align="flex-start">
      <Text variant="primary" size="md" fw={600}>
        Approval {displayHash(approval.token)}
      </Text>
      <Text variant="primary" size="md" fw={600}>
        {approval.tokenName || 'Token'}
      </Text>
    </Group>
  );

  // Return null if computed data is invalid (after all hooks)
  if (!detailsInfo || !addressInfo || !tokenInfo || !allowanceInfo) {
    return null;
  }

  return (
    <Stack gap={0} className="fixed-prompt-width">
      <Group
        justify="flex-end"
        style={{ padding: '8px 0', marginBottom: '8px' }}
      >
        <StyledButton
          onClick={handleRevoke}
          variant="warning"
          size="sm"
          disabled={!approval.token || !approval.spender}
        >
          Revoke
        </StyledButton>
      </Group>

      <DetailPanelContainer title={titleComponent()}>
        <BorderedSection>
          <div
            onClick={() => handleToggle('Address Information')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Address Information') ? '▶ ' : '▼ '}Address
                Information
              </div>
            </Text>
          </div>
          {!collapsed.has('Address Information') && (
            <InfoAddressRenderer addressInfo={addressInfo} />
          )}
        </BorderedSection>

        <BorderedSection>
          <div
            onClick={() => handleToggle('Token Information')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Token Information') ? '▶ ' : '▼ '}Token
                Information
              </div>
            </Text>
          </div>
          {!collapsed.has('Token Information') && (
            <PanelTable>
              {tokenInfo.map((item, index) => (
                <PanelRow
                  label={item.label}
                  key={index}
                  value={<div className="panel-nested-name">{item.value}</div>}
                />
              ))}
            </PanelTable>
          )}
          {/* <PanelRow
                  key={index}
                  label={item.label}
                  value={
                    <span
                      style={{
                        fontFamily: item.label.includes('Address')
                          ? 'monospace'
                          : 'inherit',
                        fontSize: '14px',
                      }}
                      title={String(item.value)}
                    >
                      {item.name && item.label.includes('Address')
                        ? `${item.value.slice(0, 6)}...${item.value.slice(-4)}`
                        : item.value}
                      {item.name && item.label.includes('Address') && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--mantine-color-dimmed)',
                            marginTop: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.name}
                        </div>
                      )}
                    </span>
                  }
                /> */}
        </BorderedSection>

        {/* <BorderedSection>
          <div
            onClick={() => handleToggle('Allowance Details')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Allowance Details') ? '▶ ' : '▼ '}Allowance
                Details
              </div>
            </Text>
          </div>
          {!collapsed.has('Allowance Details') && (
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
          )}
        </BorderedSection> */}

        {/* <BorderedSection>
          <div
            onClick={() => handleToggle('Approval Details')}
            style={{ cursor: 'pointer' }}
          >
            <Text variant="primary" size="sm">
              <div className="detail-section-header">
                {collapsed.has('Approval Details') ? '▶ ' : '▼ '}Approval
                Details
              </div>
            </Text>
          </div>
          {!collapsed.has('Approval Details') && (
            <InfoDetailsRenderer detailsInfo={detailsInfo} />
          )}
        </BorderedSection> */}
      </DetailPanelContainer>

      {/* Custom Transaction Review Modal */}
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

      {/* Success Modal with Etherscan Link */}
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
    </Stack>
  );
};
