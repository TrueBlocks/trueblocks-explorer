import { StyledButton, StyledText } from '@components';
import { useWalletConnectContext } from '@contexts';
import { useWallet } from '@hooks';
import { Group } from '@mantine/core';

export const WalletConnectButton = () => {
  const { isConnecting, handleConnect, handleDisconnect, formatAddress } =
    useWalletConnectContext();
  const { isWalletConnected, walletAddress } = useWallet();

  if (isWalletConnected) {
    return (
      <Group gap="xs">
        <StyledText variant="success" size="sm">
          {formatAddress(walletAddress || '')}
        </StyledText>
        <StyledButton size="xs" onClick={handleDisconnect} variant="warning">
          Disconnect
        </StyledButton>
      </Group>
    );
  }

  return (
    <StyledButton
      onClick={handleConnect}
      loading={isConnecting}
      size="xs"
      variant="primary"
    >
      Connect Wallet
    </StyledButton>
  );
};
