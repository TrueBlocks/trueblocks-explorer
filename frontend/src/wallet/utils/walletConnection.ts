import { Log, LogError } from '@utils';
import { useWalletContext } from '@wallet';
import { useWallet } from '@wallet';
import { useRequest } from '@walletconnect/modal-sign-react';

import { PreparedTransaction } from './transactionBuilder';

export interface WalletConnectionProps {
  onTransactionSigned?: (txHash: string) => void;
  onError?: (error: string) => void;
}

export const useWalletConnection = ({
  onTransactionSigned,
  onError,
}: WalletConnectionProps = {}) => {
  const { session } = useWalletContext();
  const { walletAddress, walletChainId, isWalletConnected } = useWallet();

  // Initialize the WalletConnect request hook
  const {
    request: makeWalletConnectRequest,
    loading: _requestLoading,
    error: _requestError,
  } = useRequest({
    topic: '', // Will be set when making the actual request
    chainId: '', // Will be set when making the actual request
    request: {
      method: 'eth_sendTransaction',
      params: [],
    },
  });

  /**
   * Send a transaction via WalletConnect for signing
   */
  const sendTransaction = async (
    preparedTx: PreparedTransaction,
  ): Promise<string> => {
    if (!isWalletConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    if (!session.isConnected) {
      throw new Error('WalletConnect session not available');
    }

    if (!session.walletConnectSession) {
      throw new Error(
        'WalletConnect session not available for transaction requests',
      );
    }

    try {
      // Prepare the transaction request for WalletConnect
      const transactionRequest = {
        from: walletAddress,
        to: preparedTx.to,
        data: preparedTx.data,
        value: preparedTx.value,
        gas: preparedTx.gas,
        gasPrice: preparedTx.gasPrice,
      };

      Log(
        'Sending transaction via WalletConnect:',
        JSON.stringify(transactionRequest),
      );
      Log(
        'WalletConnect session available:',
        String(!!session.walletConnectSession),
      );

      // Extract the topic from the session
      const topic = (session.walletConnectSession as Record<string, unknown>)
        ?.topic as string;
      if (!topic) {
        throw new Error('WalletConnect session topic not found');
      }

      Log('🚀 Making real WalletConnect request with topic:', topic);

      // Make the actual WalletConnect request
      const txHash = (await makeWalletConnectRequest({
        topic,
        chainId: `eip155:${walletChainId}`,
        request: {
          method: 'eth_sendTransaction',
          params: [transactionRequest],
        },
      })) as string;

      // TODO: Show this hash to the user
      Log('✅ Transaction signed and sent via WalletConnect:', txHash);
      Log('🔍 View on Etherscan: https://etherscan.io/tx/' + txHash);

      if (onTransactionSigned) {
        onTransactionSigned(txHash);
      }

      return txHash;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Transaction failed';

      LogError('WalletConnect transaction error:', JSON.stringify(error));

      if (onError) {
        onError(errorMessage);
      }

      throw new Error(errorMessage);
    }
  };

  /**
   * Sign a message via WalletConnect
   */
  const signMessage = async (message: string): Promise<string> => {
    if (!isWalletConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    if (!session.isConnected) {
      throw new Error('WalletConnect session not available');
    }

    try {
      // TODO: Implement actual WalletConnect message signing
      Log('Signing message via WalletConnect:', message);

      // For now, simulate a signature
      const signature = `0x${Math.random().toString(16).substring(2, 130)}`;

      return signature;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Message signing failed';

      if (onError) {
        onError(errorMessage);
      }

      throw new Error(errorMessage);
    }
  };

  /**
   * Get the current wallet info
   */
  const getWalletInfo = () => ({
    address: walletAddress,
    chainId: walletChainId,
    isConnected: isWalletConnected,
    session: session,
  });

  return {
    // Transaction methods
    sendTransaction,
    signMessage,

    // Wallet info
    getWalletInfo,

    // Connection status
    isConnected: isWalletConnected,
    address: walletAddress,
    chainId: walletChainId,
  };
};
