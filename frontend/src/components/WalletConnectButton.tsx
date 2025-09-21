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
        <Text size="sm" style={{ color: 'var(--skin-success)' }}>
          {formatAddress(walletAddress || '')}
        </Text>
        <Button
          size="xs"
          onClick={handleDisconnect}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--skin-error)',
          }}
          variant="transparent"
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
      size="xs"
      style={{
        backgroundColor: 'var(--skin-primary)',
        color: 'var(--skin-text-inverse)',
      }}
      variant="filled"
    >
      Connect Wallet
    </Button>
  );
};
