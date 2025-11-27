// Wallet connection state store - separate from preferences
// This handles session-only wallet connection state

export interface WalletState {
  address: string;
  chainId: number;
  connected: boolean;
}

// Initial state
const initialState: WalletState = {
  address: '',
  chainId: 1, // Default to Ethereum mainnet
  connected: false,
};

class WalletStore {
  private state: WalletState = { ...initialState };
  private listeners = new Set<() => void>();

  // Get current state (required by useSyncExternalStore)
  getState = (): WalletState => {
    return this.state;
  };

  // Subscribe to state changes (required by useSyncExternalStore)
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  };

  // Notify all listeners of state changes
  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };

  // Internal method to update state and notify listeners
  private setState = (updates: Partial<WalletState>): void => {
    this.state = { ...this.state, ...updates };
    this.notify();
  };

  // Wallet actions - no backend persistence needed
  connectWallet = (address: string, chainId: number): void => {
    this.setState({
      address,
      chainId,
      connected: true,
    });
  };

  disconnectWallet = (): void => {
    this.setState({
      address: '',
      chainId: 1,
      connected: false,
    });
  };

  updateWalletChain = (chainId: number): void => {
    this.setState({ chainId });
  };

  // Computed getters
  get isWalletConnected(): boolean {
    return this.state.connected;
  }
}

// Create and export a singleton instance
export const walletStore = new WalletStore();
