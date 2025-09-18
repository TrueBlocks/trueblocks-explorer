import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { Log } from '@utils';
import { useConnect } from '@walletconnect/modal-sign-react';

import { useWallet } from '../hooks/useWallet';

export interface WalletSession {
  address?: string;
  chainId?: number;
  isConnected: boolean;
  walletConnectSession?: Record<string, unknown>;
}

interface WalletConnectContextType {
  session: WalletSession;
  isConnecting: boolean;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  formatAddress: (address: string) => string;
}

const WalletConnectContext = createContext<WalletConnectContextType | null>(
  null,
);

interface WalletConnectProviderProps {
  children: ReactNode;
}

export const WalletConnectProvider = ({
  children,
}: WalletConnectProviderProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletConnectSession, setWalletConnectSession] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  const {
    connectWallet,
    disconnectWallet,
    walletAddress,
    walletChainId,
    isWalletConnected,
  } = useWallet();

  // Create session object from global state
  const session: WalletSession = {
    address: walletAddress,
    chainId: walletChainId,
    isConnected: isWalletConnected,
    walletConnectSession,
  };

  // Log('WalletConnect Context: Current session state:', JSON.stringify(session));

  const { connect } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'personal_sign'],
        chains: ['eip155:1'], // Ethereum mainnet
        events: ['chainChanged', 'accountsChanged'],
      },
    },
  });

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

      setWalletConnectSession(
        walletSession as unknown as Record<string, unknown>,
      );

      // Update global state instead of local state
      if (address && chainId) {
        await connectWallet(address, chainId);
        Log('Wallet connected to global state:', address, String(chainId));
      }
    } catch (error) {
      Log(
        'Wallet connection failed:',
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsConnecting(false);
    }
  }, [connect, connectWallet]);

  const handleDisconnect = useCallback(async () => {
    try {
      setWalletConnectSession(undefined);
      await disconnectWallet();
      Log('Wallet disconnected from global state');
    } catch (err) {
      Log(
        'Wallet disconnection failed:',
        err instanceof Error ? err.message : String(err),
      );
    }
  }, [disconnectWallet]);

  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const value = {
    session,
    isConnecting,
    handleConnect,
    handleDisconnect,
    formatAddress,
  };

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  );
};

export const useWalletConnectContext = () => {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error(
      'useWalletConnectContext must be used within a WalletConnectProvider',
    );
  }
  return context;
};
