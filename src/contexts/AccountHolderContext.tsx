import React, { createContext, useContext, useState } from 'react';
import { useWallets } from './WalletContext';

interface AccountHolderContextType {
  selectedAccountHolderId: string | null;
  setSelectedAccountHolderId: (id: string | null) => void;
  getSelectedAccountHolderWallets: () => string[];
}

const AccountHolderContext = createContext<AccountHolderContextType | undefined>(undefined);

export const useAccountHolder = () => {
  const context = useContext(AccountHolderContext);
  if (!context) {
    throw new Error('useAccountHolder must be used within an AccountHolderProvider');
  }
  return context;
};

export const AccountHolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAccountHolderId, setSelectedAccountHolderId] = useState<string | null>(null);
  const { wallets } = useWallets();

  const getSelectedAccountHolderWallets = () => {
    if (!selectedAccountHolderId) return [];
    return wallets
      .filter(wallet => wallet.accountHolderId === selectedAccountHolderId)
      .map(wallet => wallet.address);
  };

  return (
    <AccountHolderContext.Provider
      value={{
        selectedAccountHolderId,
        setSelectedAccountHolderId,
        getSelectedAccountHolderWallets,
      }}
    >
      {children}
    </AccountHolderContext.Provider>
  );
};