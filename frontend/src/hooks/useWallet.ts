import { useSyncExternalStore } from 'react';

import { walletStore } from '../stores/walletStore';

export interface UseWalletReturn {
  // Wallet state
  walletAddress: string;
  walletChainId: number;
  walletConnected: boolean;

  // Wallet actions
  connectWallet: (address: string, chainId: number) => void;
  disconnectWallet: () => void;
  updateWalletChain: (chainId: number) => void;

  // Computed values
  isWalletConnected: boolean;
}

export const useWallet = (): UseWalletReturn => {
  const state = useSyncExternalStore(
    walletStore.subscribe,
    walletStore.getState,
  );

  return {
    // State
    walletAddress: state.address,
    walletChainId: state.chainId,
    walletConnected: state.connected,

    // Actions - these are bound methods from the store
    connectWallet: walletStore.connectWallet,
    disconnectWallet: walletStore.disconnectWallet,
    updateWalletChain: walletStore.updateWalletChain,

    // Computed values - these are getters from the store
    isWalletConnected: walletStore.isWalletConnected,
  };
};
