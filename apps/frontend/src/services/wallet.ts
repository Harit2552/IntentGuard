export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'unsupported' | 'provider-unavailable';

export type WalletContext = {
  status: WalletStatus;
  account: string | null;
  chainId: number | null;
  chainName: string | null;
};

export interface WalletService {
  connect(): Promise<WalletContext>;
  disconnect(): Promise<WalletContext>;
  getContext(): Promise<WalletContext>;
}

export const mockWalletService: WalletService = {
  async connect() {
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    return {
      status: 'connected',
      account: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      chainId: 1,
      chainName: 'Ethereum Mainnet',
    };
  },
  async disconnect() {
    return { status: 'disconnected', account: null, chainId: null, chainName: null };
  },
  async getContext() {
    return { status: 'disconnected', account: null, chainId: null, chainName: null };
  },
};
