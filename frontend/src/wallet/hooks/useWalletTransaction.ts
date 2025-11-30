import { useMemo, useState } from 'react';

import { useViewContext } from '@contexts';
import { usePayload } from '@hooks';
import { types } from '@models';
import { Log } from '@utils';
import { useWalletContext } from '@wallet';
import { useWallet } from '@wallet';
import { useRequest } from '@walletconnect/modal-sign-react';
import { EncodeTransaction } from 'wailsjs/go/app/App';
import { app } from 'wailsjs/go/models';

export interface WalletTransactionRequest {
  contractAddress: string;
  signature: string;
  arguments: string[];
  value?: string;
}

export interface WalletTransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export function useWalletTransaction() {
  const { session } = useWalletContext();
  const { walletAddress, walletChainId, isWalletConnected } = useWallet();
  const { currentView } = useViewContext();
  const createPayload = usePayload(currentView);
  const payload = useMemo(
    () => createPayload('' as types.DataFacet),
    [createPayload],
  );
  const [isPreparingTransaction, setIsPreparingTransaction] = useState(false);

  const { request: makeWalletConnectRequest } = useRequest({
    topic: '',
    chainId: '',
    request: {
      method: 'eth_sendTransaction',
      params: [],
    },
  });

  const executeTransaction = async (
    txRequest: WalletTransactionRequest,
  ): Promise<WalletTransactionResult> => {
    setIsPreparingTransaction(true);
    Log(
      'useWalletTransaction.executeTransaction START',
      JSON.stringify(txRequest),
    );

    try {
      // Validation
      if (!isWalletConnected || !walletAddress) {
        setIsPreparingTransaction(false);
        return {
          success: false,
          error: 'Wallet not connected',
        };
      }

      if (!session.isConnected || !session.walletConnectSession) {
        setIsPreparingTransaction(false);
        return {
          success: false,
          error: 'WalletConnect session not available',
        };
      }

      // Step 1: Encode transaction using backend SDK
      Log('Step 1: Encoding transaction calldata');
      const encodeRequest = new app.EncodeTransactionRequest({
        contractAddress: txRequest.contractAddress,
        signature: txRequest.signature,
        arguments: txRequest.arguments,
      });

      const encodeResult = await EncodeTransaction(payload, encodeRequest);
      Log('Encode result:', JSON.stringify(encodeResult));

      if (!encodeResult.success || !encodeResult.data) {
        Log(
          'ERROR: Failed to encode transaction',
          encodeResult.error || 'Unknown error',
        );
        setIsPreparingTransaction(false);
        return {
          success: false,
          error: encodeResult.error || 'Failed to encode transaction',
        };
      }

      // Step 2: Send transaction via WalletConnect
      Log('Step 2: Sending transaction via WalletConnect');
      const chainId = `eip155:${walletChainId}`;

      const wcRequest = {
        method: 'eth_sendTransaction',
        params: [
          {
            from: walletAddress,
            to: txRequest.contractAddress,
            data: encodeResult.data,
            value: txRequest.value || '0x0',
          },
        ],
      };

      Log('WalletConnect request:', JSON.stringify(wcRequest));

      const topic = (session.walletConnectSession as Record<string, unknown>)
        ?.topic as string;
      if (!topic) {
        throw new Error('WalletConnect session topic not found');
      }

      const txHash = (await makeWalletConnectRequest({
        topic,
        chainId,
        request: wcRequest,
      })) as string;

      Log('Transaction sent! Hash:', txHash);

      setIsPreparingTransaction(false);
      return {
        success: true,
        transactionHash: txHash,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Log('ERROR in executeTransaction:', errorMessage);
      setIsPreparingTransaction(false);

      // User rejected
      const isRejection =
        (error instanceof Error && error.message?.includes('User rejected')) ||
        (typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          (error as { code: number }).code === 4001);

      if (isRejection) {
        return {
          success: false,
          error: 'Transaction rejected by user',
        };
      }

      return {
        success: false,
        error: errorMessage || 'Transaction failed',
      };
    }
  };

  return {
    executeTransaction,
    isPreparingTransaction,
  };
}
