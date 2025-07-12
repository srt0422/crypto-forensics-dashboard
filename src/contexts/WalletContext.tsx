import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Wallet {
  id: string;
  address: string;
  label: string;
  addedAt: Date;
  lastSync: Date | null;
  isActive: boolean;
}

interface WalletContextType {
  wallets: Wallet[];
  addWallet: (address: string, label: string) => void;
  removeWallet: (id: string) => void;
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
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const addWallet = useCallback((address: string, label: string) => {
    const newWallet: Wallet = {
      id: crypto.randomUUID(),
      address,
      label,
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
        addWallet,
        removeWallet,
        reimportWalletData,
        isImporting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};