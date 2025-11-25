import { useCallback } from 'react';

import { useWalletConnectContext } from '@contexts';
import { useWallet } from '@hooks';
import { Log } from '@utils';

/**
 * Hook for creating wallet-gated actions that require a connected wallet
 *
 * @example
 * ```tsx
 * const { isWalletConnected, createWalletGatedAction } = useWalletGatedAction();
 *
 * const handleTransfer = createWalletGatedAction(
 *   (walletAddress: string) => {
 *     // This will only execute if wallet is connected
 *     transferTokens(walletAddress, amount);
 *   },
 *   'Transfer'
 * );
 *
 * return (
 *   <Button
 *     onClick={handleTransfer}
 *     disabled={!isWalletConnected}
 *   >
 *     Transfer Tokens
 *   </Button>
 * );
 * ```
 */
export const useWalletGatedAction = () => {
  const { isWalletConnected, walletAddress } = useWallet();
  const { handleConnect, isConnecting } = useWalletConnectContext();

  const createWalletGatedAction = useCallback(
    (
      action: (walletAddress: string) => void,
      actionName: string = 'Action',
    ) => {
      return async () => {
        if (!isWalletConnected) {
          Log(
            `${actionName} requires wallet connection. Opening wallet connect modal...`,
          );
          try {
            await handleConnect();
            const walletAddr = walletAddress || '';
            if (walletAddr) {
              Log(`${actionName} executed with wallet:`, walletAddr);
              action(walletAddr);
            }
          } catch (error) {
            Log(
              `${actionName} cancelled or failed:`,
              error instanceof Error ? error.message : String(error),
            );
          }
          return;
        }

        const walletAddr = walletAddress || '';
        Log(`${actionName} executed with wallet:`, walletAddr);
        action(walletAddr);
      };
    },
    [isWalletConnected, walletAddress, handleConnect],
  );

  return {
    isWalletConnected,
    walletAddress: walletAddress,
    isConnecting,
    createWalletGatedAction,
  };
};
