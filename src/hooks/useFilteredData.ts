import { useMemo } from 'react';
import { useAccountHolder } from '@/contexts/AccountHolderContext';
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

  const walletAddresses = getSelectedAccountHolderWallets();
  const hasSelection = selectedAccountHolderId && walletAddresses.length > 0;

  const filteredData = useMemo(() => {
    if (!hasSelection) {
      return {
        inboundTransactions: defaultInbound,
        outboundTransactions: defaultOutbound,
        possibleAddresses: defaultAddresses,
        chainStatistics: defaultChainStats,
        fundSourceTree: defaultFundTree,
        timeSeriesData: defaultTimeData,
        summaryData: defaultSummary
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