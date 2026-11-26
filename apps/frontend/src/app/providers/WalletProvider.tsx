import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockWalletService, type WalletContext, type WalletService } from '../../services/wallet';

type WalletContextValue = {
  wallet: WalletContext;
  connecting: boolean;
  service: WalletService;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContextState = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletContext>({
    status: 'disconnected',
    account: null,
    chainId: null,
    chainName: null,
  });
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    const result = await mockWalletService.connect();
    setWallet(result);
    setConnecting(false);
  };

  const disconnect = async () => setWallet(await mockWalletService.disconnect());

  return (
    <WalletContextState.Provider value={{ wallet, connecting, service: mockWalletService, connect, disconnect }}>
      {children}
    </WalletContextState.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWallet() {
  const context = useContext(WalletContextState);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
