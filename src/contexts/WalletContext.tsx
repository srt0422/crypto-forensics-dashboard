import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  addAccountHolder: (name: string) => Promise<string>;
  addWallet: (address: string, label: string, accountHolderId: string) => Promise<void>;
  removeWallet: (id: string) => Promise<void>;
  removeAccountHolder: (id: string) => Promise<void>;
  reimportWalletData: () => Promise<void>;
  isImporting: boolean;
  loading: boolean;
  loadData: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load data from Supabase on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Load account holders
      const { data: accountHoldersData, error: accountHoldersError } = await supabase
        .from('account_holders')
        .select('*')
        .order('created_at', { ascending: true });

      if (accountHoldersError) {
        console.error('Error loading account holders:', accountHoldersError);
        toast({
          title: "Error",
          description: "Failed to load account holders",
          variant: "destructive",
        });
      } else {
        setAccountHolders(accountHoldersData?.map(ah => ({
          id: ah.id,
          name: ah.name,
          createdAt: new Date(ah.created_at)
        })) || []);
      }

      // Load wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from('wallets')
        .select('*')
        .order('added_at', { ascending: true });

      if (walletsError) {
        console.error('Error loading wallets:', walletsError);
        toast({
          title: "Error",
          description: "Failed to load wallets",
          variant: "destructive",
        });
      } else {
        setWallets(walletsData?.map(w => ({
          id: w.id,
          address: w.address,
          label: w.label,
          accountHolderId: w.account_holder_id,
          addedAt: new Date(w.added_at),
          lastSync: w.last_sync ? new Date(w.last_sync) : null,
          isActive: w.is_active
        })) || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addAccountHolder = useCallback(async (name: string): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('account_holders')
        .insert({
          name,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newAccountHolder: AccountHolder = {
        id: data.id,
        name: data.name,
        createdAt: new Date(data.created_at),
      };
      
      setAccountHolders(prev => [...prev, newAccountHolder]);
      
      toast({
        title: "Account holder added",
        description: `${name} has been added successfully.`,
      });
      
      return newAccountHolder.id;
    } catch (error) {
      console.error('Error adding account holder:', error);
      toast({
        title: "Error",
        description: "Failed to add account holder",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const removeAccountHolder = useCallback(async (id: string): Promise<void> => {
    try {
      const accountHolder = accountHolders.find(ah => ah.id === id);
      if (!accountHolder) return;

      const { error } = await supabase
        .from('account_holders')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from local state (wallets will be removed by cascade)
      setAccountHolders(prev => prev.filter(ah => ah.id !== id));
      setWallets(prev => prev.filter(wallet => wallet.accountHolderId !== id));
      
      toast({
        title: "Account holder removed",
        description: `${accountHolder.name} and associated wallets have been removed.`,
      });
    } catch (error) {
      console.error('Error removing account holder:', error);
      toast({
        title: "Error",
        description: "Failed to remove account holder",
        variant: "destructive",
      });
    }
  }, [accountHolders, toast]);

  const addWallet = useCallback(async (address: string, label: string, accountHolderId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('wallets')
        .insert({
          address,
          label,
          account_holder_id: accountHolderId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newWallet: Wallet = {
        id: data.id,
        address: data.address,
        label: data.label,
        accountHolderId: data.account_holder_id,
        addedAt: new Date(data.added_at),
        lastSync: data.last_sync ? new Date(data.last_sync) : null,
        isActive: data.is_active,
      };
      
      setWallets(prev => [...prev, newWallet]);
      
      // Simulate background sync
      setTimeout(async () => {
        try {
          await supabase
            .from('wallets')
            .update({ last_sync: new Date().toISOString() })
            .eq('id', data.id);
            
          setWallets(prev => 
            prev.map(w => 
              w.id === newWallet.id 
                ? { ...w, lastSync: new Date() }
                : w
            )
          );
          
          toast({
            title: "Wallet synced",
            description: `${label} has been synced successfully.`,
          });
        } catch (error) {
          console.error('Error updating last sync:', error);
        }
      }, 2000);
      
      toast({
        title: "Wallet added",
        description: `${label} has been added and is syncing.`,
      });
    } catch (error) {
      console.error('Error adding wallet:', error);
      toast({
        title: "Error",
        description: "Failed to add wallet",
        variant: "destructive",
      });
    }
  }, [toast]);

  const removeWallet = useCallback(async (id: string): Promise<void> => {
    try {
      const wallet = wallets.find(w => w.id === id);
      if (!wallet) return;

      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setWallets(prev => prev.filter(w => w.id !== id));
      
      toast({
        title: "Wallet removed",
        description: `${wallet.label} has been removed.`,
      });
    } catch (error) {
      console.error('Error removing wallet:', error);
      toast({
        title: "Error",
        description: "Failed to remove wallet",
        variant: "destructive",
      });
    }
  }, [wallets, toast]);

  const reimportWalletData = useCallback(async (): Promise<void> => {
    if (wallets.length === 0) {
      toast({
        title: "No wallets",
        description: "Add wallets first to import their data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImporting(true);
      
      // Simulate reimport process by updating all wallet sync times
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('wallets')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      
      // Update local state
      setWallets(prev => 
        prev.map(wallet => ({
          ...wallet,
          lastSync: new Date(),
        }))
      );
      
      toast({
        title: "Data reimported",
        description: `Successfully updated data for ${wallets.length} wallet(s).`,
      });
    } catch (error) {
      console.error('Error reimporting data:', error);
      toast({
        title: "Error",
        description: "Failed to reimport wallet data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  }, [wallets.length, toast]);

  const contextValue = useMemo(
    () => ({
      wallets,
      accountHolders,
      addAccountHolder,
      addWallet,
      removeWallet,
      removeAccountHolder,
      reimportWalletData,
      isImporting,
      loading,
      loadData,
    }),
    [wallets, accountHolders, addAccountHolder, addWallet, removeWallet, removeAccountHolder, reimportWalletData, isImporting, loading, loadData]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};