import { useMemo, useEffect, useState } from 'react';
import { useAccountHolder } from '@/contexts/AccountHolderContext';
import { useWallets } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  generateTransactions, 
  generateAddresses, 
  generateChainStats, 
  generateFundSourceTree, 
  generateTimeSeriesData,
  calculateSummaryData
} from '@/data/mockData';

export const useFilteredData = () => {
  const { selectedAccountHolderId, getSelectedAccountHolderWallets } = useAccountHolder();
  const { accountHolders, loading: walletsLoading } = useWallets();
  const [storedTransactions, setStoredTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const walletAddresses = getSelectedAccountHolderWallets();
  const hasSelection = selectedAccountHolderId && walletAddresses.length > 0;
  const hasAccountHolders = accountHolders.length > 0;

  // Load transactions from Supabase when wallet selection changes
  useEffect(() => {
    const loadTransactions = async () => {
      if (!hasSelection) {
        setStoredTransactions([]);
        return;
      }

      try {
        setTransactionsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .in('wallet_address', walletAddresses)
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Error loading transactions:', error);
          setStoredTransactions([]);
        } else {
          setStoredTransactions(data || []);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        setStoredTransactions([]);
      } finally {
        setTransactionsLoading(false);
      }
    };

    loadTransactions();
  }, [hasSelection, selectedAccountHolderId, walletAddresses.join(',')]);

  const shouldGenerateMockData = hasSelection && storedTransactions.length === 0 && !transactionsLoading;

  const filteredData = useMemo(() => {
    // If no account holders exist, return empty data
    if (!hasAccountHolders) {
      return {
        inboundTransactions: [],
        outboundTransactions: [],
        possibleAddresses: [],
        chainStatistics: [],
        fundSourceTree: { id: 'root', address: 'No Data', value: 0, chain: '', depth: 0, children: [] },
        timeSeriesData: [],
        summaryData: {
          totalIn: 0,
          totalOut: 0,
          netFlow: 0,
          transactionCount: 0,
          uniqueAddressCount: 0,
          potentiallyOwnedAddresses: 0,
          chainCounts: {},
          layerCounts: { L1: 0, L2: 0 }
        }
      };
    }

    // If account holders exist but none selected, show empty data
    if (!hasSelection) {
      return {
        inboundTransactions: [],
        outboundTransactions: [],
        possibleAddresses: [],
        chainStatistics: [],
        fundSourceTree: { id: 'root', address: 'No Data', value: 0, chain: '', depth: 0, children: [] },
        timeSeriesData: [],
        summaryData: {
          totalIn: 0,
          totalOut: 0,
          netFlow: 0,
          transactionCount: 0,
          uniqueAddressCount: 0,
          potentiallyOwnedAddresses: 0,
          chainCounts: {},
          layerCounts: { L1: 0, L2: 0 }
        }
      };
    }

    // Use stored transactions if available, otherwise generate mock data
    if (storedTransactions.length > 0) {
      const inbound = storedTransactions.filter(t => t.transaction_type === 'in').map(t => ({
        id: t.id,
        fromAddress: t.from_address,
        toAddress: t.to_address,
        amount: parseFloat(t.amount),
        chain: t.chain,
        hash: t.transaction_hash,
        timestamp: t.timestamp,
        layer: t.chain.toLowerCase().includes('polygon') ? 'L2' : 'L1'
      }));
      
      const outbound = storedTransactions.filter(t => t.transaction_type === 'out').map(t => ({
        id: t.id,
        fromAddress: t.from_address,
        toAddress: t.to_address,
        amount: parseFloat(t.amount),
        chain: t.chain,
        hash: t.transaction_hash,
        timestamp: t.timestamp,
        layer: t.chain.toLowerCase().includes('polygon') ? 'L2' : 'L1'
      }));
      
      const allTransactions = [...inbound, ...outbound];
      
      return {
        inboundTransactions: inbound,
        outboundTransactions: outbound,
        possibleAddresses: generateAddresses(35, walletAddresses),
        chainStatistics: generateChainStats(allTransactions),
        fundSourceTree: generateFundSourceTree(1, 4, walletAddresses),
        timeSeriesData: generateTimeSeriesData(allTransactions),
        summaryData: calculateSummaryData(inbound, outbound)
      };
    } else if (shouldGenerateMockData) {
      // Generate fresh mock data for the selected account holder's wallets
      const inbound = generateTransactions(150, 'in', walletAddresses);
      const outbound = generateTransactions(80, 'out', walletAddresses);
      const allTransactions = [...inbound, ...outbound];
      
      return {
        inboundTransactions: inbound,
        outboundTransactions: outbound,
        possibleAddresses: generateAddresses(35, walletAddresses),
        chainStatistics: generateChainStats(allTransactions),
        fundSourceTree: generateFundSourceTree(1, 4, walletAddresses),
        timeSeriesData: generateTimeSeriesData(allTransactions),
        summaryData: calculateSummaryData(inbound, outbound)
      };
    } else {
      // Return empty data while loading or when no data
      return {
        inboundTransactions: [],
        outboundTransactions: [],
        possibleAddresses: [],
        chainStatistics: [],
        fundSourceTree: { id: 'root', address: 'No Data', value: 0, chain: '', depth: 0, children: [] },
        timeSeriesData: [],
        summaryData: {
          totalIn: 0,
          totalOut: 0,
          netFlow: 0,
          transactionCount: 0,
          uniqueAddressCount: 0,
          potentiallyOwnedAddresses: 0,
          chainCounts: {},
          layerCounts: { L1: 0, L2: 0 }
        }
      };
    }
  }, [hasSelection, walletAddresses, storedTransactions, shouldGenerateMockData, transactionsLoading]);

  return {
    ...filteredData,
    isFiltered: hasSelection,
    selectedWalletCount: walletAddresses.length,
    loading: walletsLoading || transactionsLoading,
    hasStoredData: storedTransactions.length > 0
  };
};