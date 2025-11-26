import { StyledButton } from '@components';
import { Group, Text } from '@mantine/core';
import { useWalletConnectContext } from '@wallet';
import { useWallet } from '@wallet';

export const WalletConnectButton = () => {
  const { isConnecting, handleConnect, handleDisconnect, formatAddress } =
    useWalletConnectContext();
  const { isWalletConnected, walletAddress } = useWallet();

  if (isWalletConnected) {
    return (
      <Group gap="xs">
        <Text variant="success" size="md">
          {formatAddress(walletAddress || '')}
        </Text>
        <StyledButton size="xs" onClick={handleDisconnect}>
          Disconnect
        </StyledButton>
      </Group>
    );
  }

  return (
    <StyledButton onClick={handleConnect} loading={isConnecting} size="xs">
      Connect Wallet
    </StyledButton>
  );
};
