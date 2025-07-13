import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AccountHolder {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  address: string;
  label: string;
  accountHolderId: string;
  addedAt: Date;
  lastSync: Date | null;
  isActive: boolean;
}

interface WalletContextType {
  wallets: Wallet[];
  accountHolders: AccountHolder[];
  addAccountHolder: (name: string) => string;
  addWallet: (address: string, label: string, accountHolderId: string) => void;
  removeWallet: (id: string) => void;
  removeAccountHolder: (id: string) => void;
  reimportWalletData: () => void;
  isImporting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallets = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallets must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [accountHolders, setAccountHolders] = useState<AccountHolder[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const addAccountHolder = useCallback((name: string) => {
    const newAccountHolder: AccountHolder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    };

    setAccountHolders(prev => [...prev, newAccountHolder]);
    
    toast({
      title: "Account Holder Added",
      description: `${name} has been added successfully.`,
    });

    return newAccountHolder.id;
  }, [toast]);

  const removeAccountHolder = useCallback((id: string) => {
    const accountHolder = accountHolders.find(ah => ah.id === id);
    const associatedWallets = wallets.filter(w => w.accountHolderId === id);
    
    if (associatedWallets.length > 0) {
      toast({
        title: "Cannot Remove Account Holder",
        description: "Remove all associated wallets first.",
        variant: "destructive",
      });
      return;
    }

    setAccountHolders(prev => prev.filter(ah => ah.id !== id));
    
    if (accountHolder) {
      toast({
        title: "Account Holder Removed",
        description: `${accountHolder.name} has been removed.`,
      });
    }
  }, [accountHolders, wallets, toast]);

  const addWallet = useCallback((address: string, label: string, accountHolderId: string) => {
    const newWallet: Wallet = {
      id: crypto.randomUUID(),
      address,
      label,
      accountHolderId,
      addedAt: new Date(),
      lastSync: null,
      isActive: true,
    };

    setWallets(prev => [...prev, newWallet]);
    
    // Simulate background sync process
    setTimeout(() => {
      setWallets(prev => 
        prev.map(w => 
          w.id === newWallet.id 
            ? { ...w, lastSync: new Date() }
            : w
        )
      );
      toast({
        title: "Wallet Added",
        description: `${label} has been added and synced successfully.`,
      });
    }, 2000);

    toast({
      title: "Wallet Adding",
      description: `Starting background sync for ${label}...`,
    });
  }, [toast]);

  const removeWallet = useCallback((id: string) => {
    const wallet = wallets.find(w => w.id === id);
    setWallets(prev => prev.filter(w => w.id !== id));
    
    if (wallet) {
      toast({
        title: "Wallet Removed",
        description: `${wallet.label} has been removed from monitoring.`,
      });
    }
  }, [wallets, toast]);

  const reimportWalletData = useCallback(() => {
    if (wallets.length === 0) {
      toast({
        title: "No Wallets",
        description: "Add wallets first to import their data.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    
    // Simulate re-import process
    setTimeout(() => {
      setWallets(prev => 
        prev.map(w => ({ ...w, lastSync: new Date() }))
      );
      setIsImporting(false);
      
      toast({
        title: "Data Re-imported",
        description: `Successfully updated data for ${wallets.length} wallet(s).`,
      });
    }, 3000);

    toast({
      title: "Re-importing Data",
      description: "Starting background process to update all wallet data...",
    });
  }, [wallets.length, toast]);

  return (
    <WalletContext.Provider
      value={{
        wallets,
        accountHolders,
        addAccountHolder,
        addWallet,
        removeWallet,
        removeAccountHolder,
        reimportWalletData,
        isImporting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};