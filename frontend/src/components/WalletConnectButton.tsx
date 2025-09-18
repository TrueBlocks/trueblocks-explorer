import { useWalletConnectContext } from '@contexts';
import { useWallet } from '@hooks';
import { Button, Group, Text } from '@mantine/core';

export const WalletConnectButton = () => {
  const { isConnecting, handleConnect, handleDisconnect, formatAddress } =
    useWalletConnectContext();
  const { isWalletConnected, walletAddress } = useWallet();

  if (isWalletConnected) {
    return (
      <Group gap="xs">
        <Text size="sm" c="green">
          {formatAddress(walletAddress || '')}
        </Text>
        <Button
          variant="subtle"
          size="xs"
          onClick={handleDisconnect}
          color="red"
        >
          Disconnect
        </Button>
      </Group>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      loading={isConnecting}
      variant="filled"
      size="xs"
      color="green"
    >
      Connect Wallet
    </Button>
  );
};
