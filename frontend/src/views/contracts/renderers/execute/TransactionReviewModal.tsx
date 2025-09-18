import React, { useCallback, useState } from 'react';

import {
  Alert,
  Badge,
  Button,
  Card,
  Code,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import {
  PreparedTransaction,
  TransactionData,
  prepareTransaction,
} from '@utils';

interface TransactionReviewModalProps {
  opened: boolean;
  onClose: () => void;
  transactionData: TransactionData | null;
  onConfirm: (preparedTx: PreparedTransaction) => Promise<void>;
}

export const TransactionReviewModal: React.FC<TransactionReviewModalProps> = ({
  opened,
  onClose,
  transactionData,
  onConfirm,
}) => {
  const [preparedTx, setPreparedTx] = useState<PreparedTransaction | null>(
    null,
  );
  const [preparing, setPreparing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prepareTx = useCallback(async () => {
    if (!transactionData) return;

    setPreparing(true);
    setError(null);

    try {
      const prepared = await prepareTransaction(transactionData);
      setPreparedTx(prepared);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to prepare transaction',
      );
    } finally {
      setPreparing(false);
    }
  }, [transactionData]);

  React.useEffect(() => {
    if (opened && transactionData) {
      prepareTx();
    } else {
      setPreparedTx(null);
      setError(null);
    }
  }, [opened, transactionData, prepareTx]);

  const handleConfirm = useCallback(async () => {
    if (!preparedTx) return;

    setConfirming(true);
    try {
      await onConfirm(preparedTx);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to execute transaction',
      );
    } finally {
      setConfirming(false);
    }
  }, [preparedTx, onConfirm, onClose]);

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
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text fw={600}>Review Transaction</Text>
          <Badge variant="light" color="blue">
            {transactionData.function.name}
          </Badge>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Function Details */}
        <Card withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Function
              </Text>
              <Badge
                variant="light"
                color={
                  transactionData.function.stateMutability === 'payable'
                    ? 'orange'
                    : 'blue'
                }
              >
                {transactionData.function.stateMutability}
              </Badge>
            </Group>
            <Text size="lg" fw={600}>
              {transactionData.function.name}
            </Text>
            <Text size="sm" c="dimmed">
              Contract: {transactionData.to}
            </Text>
          </Stack>
        </Card>

        {/* Parameters */}
        {transactionData.inputs.length > 0 && (
          <Card withBorder>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Parameters
              </Text>
              {transactionData.inputs.map((input, index) => (
                <Group key={index} justify="space-between">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      {input.name}
                    </Text>
                    <Badge variant="light" size="xs">
                      {input.type}
                    </Badge>
                  </Group>
                  <Code>{formatParameter(input)}</Code>
                </Group>
              ))}
            </Stack>
          </Card>
        )}

        {/* ETH Value */}
        {transactionData.value && transactionData.value !== '0' && (
          <Card withBorder>
            <Group justify="space-between">
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  ETH Value
                </Text>
              </Group>
              <Text size="lg" fw={600}>
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
                <Text size="sm" fw={500}>
                  Gas Estimation
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Gas Limit</Text>
                <Text size="sm" fw={500}>
                  {parseInt(preparedTx.gas || '0').toLocaleString()}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Gas Price</Text>
                <Text size="sm" fw={500}>
                  {formatGwei(preparedTx.gasPrice || '0')} Gwei
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Max Fee</Text>
                <Text size="sm" fw={500}>
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
              <Text size="sm" fw={500}>
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
          <Alert title="Error" color="red" variant="light">
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
          <Button variant="subtle" onClick={onClose} disabled={confirming}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!preparedTx || preparing}
            loading={confirming}
          >
            Sign & Send Transaction
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
