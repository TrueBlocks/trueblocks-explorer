import React, { useCallback, useMemo, useState } from 'react';

import { StyledBadge, StyledButton, StyledModal } from '@components';
import { useViewContext } from '@contexts';
import { usePayload } from '@hooks';
import {
  Alert,
  Card,
  Code,
  Divider,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { types } from '@models';

import { validateSolidityValue } from './utils/solidityValidation';
import {
  PreparedTransaction,
  TransactionData,
  prepareTransaction,
} from './utils/transactionBuilder';

interface TransactionReviewModalProps {
  opened: boolean;
  onClose: () => void;
  transactionData: TransactionData | null;
  onConfirm: (preparedTx: PreparedTransaction) => Promise<void>;
  editable?: boolean;
  rowData?: {
    tokenAddress?: string;
    spenderAddress?: string;
  };
}

export const TxReviewModal: React.FC<TransactionReviewModalProps> = ({
  opened,
  onClose,
  transactionData,
  onConfirm,
  editable = false,
  rowData,
}) => {
  const { currentView } = useViewContext();
  const createPayload = usePayload(currentView);
  const payload = useMemo(
    () => createPayload('' as types.DataFacet),
    [createPayload],
  );

  const [preparedTx, setPreparedTx] = useState<PreparedTransaction | null>(
    null,
  );
  const [preparing, setPreparing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<number, string>>({});
  const [paramErrors, setParamErrors] = useState<Record<number, string>>({});

  const prepareTx = useCallback(async () => {
    if (!transactionData) return;

    setPreparing(true);
    setError(null);

    try {
      const prepared = await prepareTransaction(payload, transactionData);
      setPreparedTx(prepared);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to prepare transaction',
      );
    } finally {
      setPreparing(false);
    }
  }, [payload, transactionData]);

  React.useEffect(() => {
    if (opened && transactionData) {
      if (editable) {
        const initialValues: Record<number, string> = {};
        transactionData.inputs.forEach((input, index) => {
          if (input.name === 'spender' && rowData?.spenderAddress) {
            initialValues[index] = rowData.spenderAddress;
          } else {
            initialValues[index] = input.value || '';
          }
        });
        setParamValues(initialValues);
        setParamErrors({});
      } else {
        prepareTx();
      }
    } else {
      setPreparedTx(null);
      setError(null);
      setParamValues({});
      setParamErrors({});
    }
  }, [opened, transactionData, prepareTx, editable, rowData]);

  const handleParamChange = useCallback((index: number, value: string) => {
    setParamValues((prev) => ({ ...prev, [index]: value }));
    setParamErrors((prev) => ({ ...prev, [index]: '' }));
  }, []);

  const handleParamBlur = useCallback(
    (index: number, type: string, value: string) => {
      if (value.trim()) {
        const validationError = validateSolidityValue(type, value);
        if (validationError) {
          setParamErrors((prev) => ({ ...prev, [index]: validationError }));
        }
      }
    },
    [],
  );

  const handlePrepareFromEditable = useCallback(async () => {
    if (!transactionData || !editable) return;

    const hasErrors = Object.values(paramErrors).some((err) => err !== '');
    if (hasErrors) {
      setError('Please fix validation errors before continuing');
      return;
    }

    const updatedInputs = transactionData.inputs.map(
      (
        input: { name: string; type: string; value: string },
        index: number,
      ) => ({
        ...input,
        value: paramValues[index] || input.value,
      }),
    );

    const tokenAddress = rowData?.tokenAddress || payload.activeContract || '';
    const updatedTransactionData = {
      ...transactionData,
      to: tokenAddress,
      inputs: updatedInputs,
    };

    setPreparing(true);
    setError(null);

    try {
      const prepared = await prepareTransaction(
        payload,
        updatedTransactionData,
      );
      setPreparedTx(prepared);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to prepare transaction',
      );
    } finally {
      setPreparing(false);
    }
  }, [transactionData, editable, paramValues, paramErrors, payload, rowData]);

  const handleConfirm = useCallback(async () => {
    if (editable && !preparedTx) {
      await handlePrepareFromEditable();
      return;
    }

    if (!preparedTx) return;

    setConfirming(true);
    setError(null);
    try {
      await onConfirm(preparedTx);
      // Modal will be closed by the onTransactionSigned callback
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to execute transaction';
      setError(errorMessage);
    } finally {
      setConfirming(false);
    }
  }, [preparedTx, onConfirm, editable, handlePrepareFromEditable]);

  const formatParameter = (input: {
    name: string;
    type: string;
    value: string;
  }) => {
    if (input.type === 'address') {
      return `${input.value.slice(0, 6)}...${input.value.slice(-4)}`;
    }
    if (input.type.startsWith('uint') || input.type.startsWith('int')) {
      return input.value;
    }
    if (input.type === 'bool') {
      return input.value.toLowerCase() === 'true' ? 'true' : 'false';
    }
    if (input.value.length > 50) {
      return `${input.value.slice(0, 47)}...`;
    }
    return input.value;
  };

  const formatEther = (wei: string) => {
    const ethValue = parseFloat(wei) / 1e18;
    return ethValue.toFixed(6);
  };

  const formatGwei = (wei: string) => {
    const gweiValue = parseFloat(wei) / 1e9;
    return gweiValue.toFixed(2);
  };

  if (!transactionData) {
    return null;
  }

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text variant="primary" size="md" fw={600}>
            Review Transaction
          </Text>
          <StyledBadge variant="light">
            {transactionData.function.name}
          </StyledBadge>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        <Card withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text variant="primary" size="sm" fw={600}>
                Function
              </Text>
              <StyledBadge
                variant={
                  transactionData.function.stateMutability === 'payable'
                    ? 'filled'
                    : 'light'
                }
              >
                {transactionData.function.stateMutability}
              </StyledBadge>
            </Group>
            <Text variant="primary" size="md" fw={600}>
              {transactionData.function.name}
            </Text>
            <Text variant="dimmed" size="sm">
              Contract:{' '}
              {editable && rowData
                ? rowData.tokenAddress || payload.activeContract
                : transactionData.to}
            </Text>
          </Stack>
        </Card>

        {/* Parameters */}
        {transactionData.inputs.length > 0 && (
          <Card withBorder>
            <Stack gap="sm">
              <Text variant="primary" size="sm" fw={600}>
                Parameters
              </Text>
              {editable
                ? transactionData.inputs.map(
                    (
                      input: { name: string; type: string; value: string },
                      index: number,
                    ) => (
                      <TextInput
                        key={index}
                        label={
                          <Group gap="xs">
                            <Text variant="primary" size="sm" fw={600}>
                              {input.name}
                            </Text>
                            <StyledBadge variant="light" size="xs">
                              {input.type}
                            </StyledBadge>
                          </Group>
                        }
                        value={paramValues[index] || ''}
                        onChange={(e) =>
                          handleParamChange(index, e.target.value)
                        }
                        onBlur={(e) =>
                          handleParamBlur(index, input.type, e.target.value)
                        }
                        error={paramErrors[index]}
                        placeholder={`Enter ${input.type}`}
                        readOnly={
                          transactionData.to === payload.activeContract &&
                          !rowData
                        }
                      />
                    ),
                  )
                : transactionData.inputs.map(
                    (
                      input: { name: string; type: string; value: string },
                      index: number,
                    ) => (
                      <Group key={index} justify="space-between">
                        <Group gap="xs">
                          <Text variant="primary" size="sm" fw={600}>
                            {input.name}
                          </Text>
                          <StyledBadge variant="light" size="xs">
                            {input.type}
                          </StyledBadge>
                        </Group>
                        <Code>{formatParameter(input)}</Code>
                      </Group>
                    ),
                  )}
            </Stack>
          </Card>
        )}

        {/* ETH Value */}
        {transactionData.value && transactionData.value !== '0' && (
          <Card withBorder>
            <Group justify="space-between">
              <Group gap="xs">
                <Text variant="primary" size="sm" fw={600}>
                  ETH Value
                </Text>
              </Group>
              <Text variant="primary" size="md" fw={600}>
                {formatEther(transactionData.value)} ETH
              </Text>
            </Group>
          </Card>
        )}

        {/* Gas Estimation */}
        {preparedTx && (
          <Card withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <Text variant="primary" size="sm" fw={600}>
                  Gas Estimation
                </Text>
              </Group>
              <Group justify="space-between">
                <Text variant="primary" size="sm">
                  Gas Limit
                </Text>
                <Text variant="primary" size="sm" fw={600}>
                  {parseInt(preparedTx.gas || '0').toLocaleString()}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text variant="primary" size="sm">
                  Gas Price
                </Text>
                <Text variant="primary" size="sm" fw={600}>
                  {formatGwei(preparedTx.gasPrice || '0')} Gwei
                </Text>
              </Group>
              <Group justify="space-between">
                <Text variant="primary" size="sm">
                  Max Fee
                </Text>
                <Text variant="primary" size="sm" fw={600}>
                  ~
                  {formatEther(
                    (
                      parseInt(preparedTx.gas || '0') *
                      parseInt(preparedTx.gasPrice || '0')
                    ).toString(),
                  )}{' '}
                  ETH
                </Text>
              </Group>
            </Stack>
          </Card>
        )}

        {/* Transaction Data */}
        {preparedTx && (
          <Card withBorder>
            <Stack gap="sm">
              <Text variant="primary" size="sm" fw={600}>
                Transaction Data
              </Text>
              <Code block>
                {preparedTx.data.slice(0, 100)}
                {preparedTx.data.length > 100 && '...'}
              </Code>
            </Stack>
          </Card>
        )}

        <Divider />

        {/* Error Display */}
        {error && (
          <Alert
            title="Error"
            variant="light"
            bd="1px solid var(--mantine-color-error-6)"
            bg="error.1"
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        <LoadingOverlay
          visible={preparing}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ size: 'sm' }}
        />

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <StyledButton
            variant="transparent"
            onClick={onClose}
            disabled={confirming}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={handleConfirm}
            disabled={
              editable
                ? Object.values(paramErrors).some((err) => err !== '')
                : !preparedTx || preparing
            }
            loading={confirming || (editable && preparing)}
          >
            {editable && !preparedTx
              ? 'Review Transaction'
              : 'Sign & Send Transaction'}
          </StyledButton>
        </Group>
      </Stack>
    </StyledModal>
  );
};
