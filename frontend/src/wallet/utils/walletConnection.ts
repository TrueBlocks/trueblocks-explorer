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

      // Extract the topic from the session
      const topic = (session.walletConnectSession as Record<string, unknown>)
        ?.topic as string;
      if (!topic) {
        throw new Error('WalletConnect session topic not found');
      }

      // Make the actual WalletConnect request
      const txHash = (await makeWalletConnectRequest({
        topic,
        chainId: `eip155:${walletChainId}`,
        request: {
          method: 'eth_sendTransaction',
          params: [transactionRequest],
        },
      })) as string;

      if (onTransactionSigned) {
        onTransactionSigned(txHash);
      }

      return txHash;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Transaction failed';
      if (onError) {
        onError(errorMessage);
      }
      throw new Error(errorMessage);
    }
  };

  return {
    sendTransaction,
  };
};
