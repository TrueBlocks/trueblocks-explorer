import { useCallback } from 'react';

import { OpenLink } from '@app';
import { StyledModal } from '@components';
import {
  Button,
  Code,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

interface TransactionSuccessModalProps {
  opened: boolean;
  onClose: () => void;
  transactionHash: string | null;
  title?: string;
  message?: string;
}

export const TransactionSuccessModal = ({
  opened,
  onClose,
  transactionHash,
  title = 'Transaction Sent!',
  message = 'Your transaction has been submitted to the network.',
}: TransactionSuccessModalProps) => {
  const handleViewEtherscan = useCallback(() => {
    if (transactionHash) {
      OpenLink('transactionHash', transactionHash);
    }
  }, [transactionHash]);

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title={null}
      centered
      size="md"
      padding="xl"
    >
      <Stack align="center" gap="lg">
        <ThemeIcon size={64} radius="xl" variant="light" color="green">
          <div style={{ fontSize: '32px', lineHeight: 1 }}>✅</div>
        </ThemeIcon>

        <Stack align="center" gap="xs">
          <Title order={3} ta="center" c="green">
            {title}
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            {message}
          </Text>
        </Stack>

        <Stack gap="xs" w="100%">
          <Text size="sm" c="dimmed" ta="center">
            Transaction Hash:
          </Text>
          <Code
            block
            style={{
              wordBreak: 'break-all',
              textAlign: 'center',
              fontSize: '12px',
            }}
          >
            {transactionHash}
          </Code>
        </Stack>

        <Group justify="center" gap="sm" w="100%">
          <Button variant="outline" onClick={handleViewEtherscan} size="sm">
            View on Etherscan
          </Button>
          <Button variant="filled" onClick={onClose} autoFocus size="sm">
            Close
          </Button>
        </Group>
      </Stack>
    </StyledModal>
  );
};
