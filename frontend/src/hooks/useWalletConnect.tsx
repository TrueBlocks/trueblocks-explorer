import { useCallback, useState } from 'react';

import { Log } from '@utils';
import { useConnect } from '@walletconnect/modal-sign-react';

export interface WalletSession {
  address?: string;
  chainId?: number;
  isConnected: boolean;
}

export const useWalletConnect = () => {
  const [session, setSession] = useState<WalletSession>({ isConnected: false });
  const [isConnecting, setIsConnecting] = useState(false);

  Log('WalletConnect Hook: Current session state:', JSON.stringify(session));

  // Log(
  //   'WalletConnect Hook: Project ID from env:',
  //   import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  // );

  const { connect } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'personal_sign'],
        chains: ['eip155:1'], // Ethereum mainnet
        events: ['chainChanged', 'accountsChanged'],
      },
    },
  });

  // Log('WalletConnect Hook: Connect function type:', typeof connect);
  // Log(
  //   'WalletConnect Hook: Connect function available:',
  /* !!connect ? 'true' : 'false', */
  // );

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      Log('Attempting to connect wallet...');
      Log('Project ID:', import.meta.env.VITE_WALLETCONNECT_PROJECT_ID);
      Log('Connect function available:', typeof connect);

      const walletSession = await connect();
      Log('Wallet connected successfully:', JSON.stringify(walletSession));

      // Extract address and chain info from session
      const address =
        walletSession.namespaces?.eip155?.accounts?.[0]?.split(':')[2];
      const chainId = parseInt(
        walletSession.namespaces?.eip155?.chains?.[0]?.split(':')[1] || '1',
      );

      Log('Extracted address:', address || 'none');
      Log('Extracted chainId:', String(chainId));

      const newSession = {
        address,
        chainId,
        isConnected: true,
      };

      Log('Setting new session state:', JSON.stringify(newSession));
      setSession(newSession);
    } catch {
      // Log(
      //   'Wallet connection failed:',
      //   err instanceof Error ? err.message : String(err),
      // );
      // LogError('Details:', JSON.stringify(err));
      // Make sure we reset the connecting state on error
      setIsConnecting(false);
    } finally {
      setIsConnecting(false);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      // Note: WalletConnect doesn't have a direct disconnect method
      // We'll just clear the session state
      setSession({ isConnected: false });
    } catch (err) {
      Log(
        'Wallet disconnection failed:',
        err instanceof Error ? err.message : String(err),
      );
    }
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    session,
    isConnecting,
    handleConnect,
    handleDisconnect,
    formatAddress,
  };
};
