import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { Log } from '@utils';
import { useWallet } from '@wallet';
import { useConnect } from '@walletconnect/modal-sign-react';

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

const WalletContext = createContext<WalletConnectContextType | null>(null);

interface WalletConnectProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletConnectProviderProps) => {
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
        methods: [
          'eth_sendTransaction',
          'personal_sign',
          'eth_sign',
          'eth_signTypedData',
        ],
        chains: ['eip155:1'], // Ethereum mainnet
        events: ['chainChanged', 'accountsChanged'],
      },
    },
    optionalNamespaces: {
      eip155: {
        methods: ['wallet_switchEthereumChain', 'wallet_addEthereumChain'],
        chains: ['eip155:1', 'eip155:11155111'], // Mainnet and Sepolia
        events: ['connect', 'disconnect'],
      },
    },
  });

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      Log('Attempting to connect wallet...');
      Log('Project ID:', import.meta.env.VITE_WALLETCONNECT_PROJECT_ID);
      Log('Connect function available:', typeof connect);

      const connectionPromise = connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timeout after 60 seconds'));
        }, 60000);
      });

      const walletSession = (await Promise.race([
        connectionPromise,
        timeoutPromise,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ])) as any;

      Log(
        'Wallet connected successfully:',
        JSON.stringify(walletSession, null, 2),
      );

      // Extract address and chain info from session with better error handling
      const accounts = walletSession.namespaces?.eip155?.accounts;
      const chains = walletSession.namespaces?.eip155?.chains;

      Log('Available accounts:', accounts);
      Log('Available chains:', chains);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet session');
      }

      const address = accounts[0]?.split(':')[2];
      const chainId = parseInt(chains?.[0]?.split(':')[1] || '1');

      if (!address) {
        throw new Error('Failed to extract address from wallet session');
      }

      Log('Extracted address:', address);
      Log('Extracted chainId:', String(chainId));

      setWalletConnectSession(
        walletSession as unknown as Record<string, unknown>,
      );

      // Update global state
      await connectWallet(address, chainId);
      Log('Wallet connected to global state:', address, String(chainId));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Log('Wallet connection failed:', errorMessage);

      // Provide more specific error messages
      if (errorMessage.includes('Modal closed')) {
        Log(
          'User closed the wallet connection modal. Please try again and complete the connection process.',
        );
      } else if (errorMessage.includes('timeout')) {
        Log(
          'Connection timed out. Please ensure your wallet app is open and responsive.',
        );
      } else if (errorMessage.includes('User rejected')) {
        Log('Connection was rejected by user.');
      } else {
        Log(
          'Unexpected connection error. Please try again or check your wallet app.',
        );
      }
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
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
