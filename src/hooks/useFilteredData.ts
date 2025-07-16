import { useMemo } from 'react';
import { useAccountHolder } from '@/contexts/AccountHolderContext';
import { useWallets } from '@/contexts/WalletContext';
import { 
  generateTransactions, 
  generateAddresses, 
  generateChainStats, 
  generateFundSourceTree, 
  generateTimeSeriesData,
  calculateSummaryData,
  inboundTransactions as defaultInbound,
  outboundTransactions as defaultOutbound,
  possibleAddresses as defaultAddresses,
  chainStatistics as defaultChainStats,
  fundSourceTree as defaultFundTree,
  timeSeriesData as defaultTimeData,
  summaryData as defaultSummary
} from '@/data/mockData';

export const useFilteredData = () => {
  const { selectedAccountHolderId, getSelectedAccountHolderWallets } = useAccountHolder();
  const { accountHolders } = useWallets();

  const walletAddresses = getSelectedAccountHolderWallets();
  const hasSelection = selectedAccountHolderId && walletAddresses.length > 0;
  const hasAccountHolders = accountHolders.length > 0;

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

    // Generate fresh data for the selected account holder's wallets
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
  }, [hasSelection, walletAddresses]);

  return {
    ...filteredData,
    isFiltered: hasSelection,
    selectedWalletCount: walletAddresses.length
  };
};