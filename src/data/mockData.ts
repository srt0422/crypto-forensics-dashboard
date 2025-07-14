
export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  chain: string;
  layer: string;
  hash: string;
}

export interface Address {
  address: string;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  transactionCount: number;
  totalValue: number;
  chain: string;
  tokenType: string;
}

export interface ChainStats {
  chain: string;
  layer: string;
  transactionCount: number;
  totalVolume: number;
  uniqueAddresses: number;
  percentageOfTotal: number;
}

export interface FundSourceNode {
  id: string;
  address: string;
  value: number;
  chain: string;
  depth: number;
  children?: FundSourceNode[];
}

// Generate random transactions for specific wallets
const generateTransactions = (count: number, direction: 'in' | 'out', walletAddresses: string[] = []): Transaction[] => {
  const chains = ['Ethereum', 'Bitcoin', 'Polygon', 'Arbitrum', 'Optimism', 'Solana', 'Avalanche'];
  const layers = {
    'Ethereum': 'L1',
    'Bitcoin': 'L1',
    'Solana': 'L1',
    'Avalanche': 'L1',
    'Polygon': 'L2',
    'Arbitrum': 'L2',
    'Optimism': 'L2'
  };
  
  const transactions: Transaction[] = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date();
  
  const randomAddressPrefix = direction === 'in' ? '0x9c' : '0x8a';
  const defaultWallet = '0x8a7c0c23e98a2d7f8c5c83187bc7f22b8810aa17';
  
  for (let i = 0; i < count; i++) {
    const chain = chains[Math.floor(Math.random() * chains.length)];
    const timestamp = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    ).toISOString();
    
    // Use specific wallet addresses if provided
    const targetWallet = walletAddresses.length > 0 
      ? walletAddresses[Math.floor(Math.random() * walletAddresses.length)]
      : defaultWallet;
    
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${i}`,
      timestamp,
      amount: Math.random() * 100 + 0.1,
      fromAddress: direction === 'in' 
        ? `${randomAddressPrefix}${Math.random().toString(16).slice(2, 12)}` 
        : targetWallet,
      toAddress: direction === 'in' 
        ? targetWallet 
        : `${randomAddressPrefix}${Math.random().toString(16).slice(2, 12)}`,
      chain,
      layer: layers[chain as keyof typeof layers],
      hash: `0x${Math.random().toString(16).slice(2, 42)}`
    };
    transactions.push(transaction);
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock addresses for specific wallets
const generateAddresses = (count: number, walletAddresses: string[] = []): Address[] => {
  const chains = ['Ethereum', 'Bitcoin', 'Polygon', 'Arbitrum', 'Optimism', 'Solana', 'Avalanche'];
  const tokenTypes = ['Native', 'ERC20', 'ERC721', 'SPL'];
  const addresses: Address[] = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const address: Address = {
      address: walletAddresses.length > 0 && i < walletAddresses.length
        ? walletAddresses[i]
        : `0x${Math.random().toString(16).slice(2, 42)}`,
      confidence: Math.random() * 100,
      firstSeen: new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      ).toISOString(),
      lastSeen: new Date().toISOString(),
      transactionCount: Math.floor(Math.random() * 200),
      totalValue: Math.random() * 1000,
      chain: chains[Math.floor(Math.random() * chains.length)],
      tokenType: tokenTypes[Math.floor(Math.random() * tokenTypes.length)]
    };
    addresses.push(address);
  }
  
  return addresses.sort((a, b) => b.confidence - a.confidence);
};

// Generate chain statistics for specific transactions
const generateChainStats = (transactions: Transaction[] = []): ChainStats[] => {
  const chains = [
    { name: 'Ethereum', layer: 'L1' },
    { name: 'Bitcoin', layer: 'L1' },
    { name: 'Solana', layer: 'L1' },
    { name: 'Avalanche', layer: 'L1' },
    { name: 'Polygon', layer: 'L2' },
    { name: 'Arbitrum', layer: 'L2' },
    { name: 'Optimism', layer: 'L2' }
  ];
  
  // If we have transactions, calculate stats from them
  if (transactions.length > 0) {
    const chainCounts: Record<string, { count: number; volume: number; addresses: Set<string> }> = {};
    
    transactions.forEach(tx => {
      if (!chainCounts[tx.chain]) {
        chainCounts[tx.chain] = { count: 0, volume: 0, addresses: new Set() };
      }
      chainCounts[tx.chain].count++;
      chainCounts[tx.chain].volume += tx.amount;
      chainCounts[tx.chain].addresses.add(tx.fromAddress);
      chainCounts[tx.chain].addresses.add(tx.toAddress);
    });
    
    const totalTransactions = transactions.length;
    return chains.map(c => ({
      chain: c.name,
      layer: c.layer,
      transactionCount: chainCounts[c.name]?.count || 0,
      totalVolume: chainCounts[c.name]?.volume || 0,
      uniqueAddresses: chainCounts[c.name]?.addresses.size || 0,
      percentageOfTotal: ((chainCounts[c.name]?.count || 0) / totalTransactions) * 100
    }));
  }
  
  // Fallback to random data
  let totalTransactions = 0;
  const stats: ChainStats[] = chains.map(c => {
    const txCount = Math.floor(Math.random() * 1000) + 100;
    totalTransactions += txCount;
    return {
      chain: c.name,
      layer: c.layer,
      transactionCount: txCount,
      totalVolume: Math.random() * 10000,
      uniqueAddresses: Math.floor(Math.random() * 100) + 10,
      percentageOfTotal: 0 // Calculate after all counts are determined
    };
  });
  
  return stats.map(s => ({
    ...s,
    percentageOfTotal: (s.transactionCount / totalTransactions) * 100
  }));
};

// Generate fund source tree for specific wallets
const generateFundSourceTree = (depth: number = 1, maxDepth: number = 4, walletAddresses: string[] = []): FundSourceNode => {
  if (depth > maxDepth) {
    return {
      id: `node-leaf-${Math.random().toString(16).slice(2, 10)}`,
      address: walletAddresses.length > 0 && depth === 1
        ? walletAddresses[Math.floor(Math.random() * walletAddresses.length)]
        : `0x${Math.random().toString(16).slice(2, 42)}`,
      value: Math.random() * 50,
      chain: ['Ethereum', 'Bitcoin', 'Polygon', 'Arbitrum'][Math.floor(Math.random() * 4)],
      depth
    };
  }
  
  const childCount = Math.max(1, 5 - depth); // More children for lower depths
  const children: FundSourceNode[] = [];
  
  for (let i = 0; i < childCount; i++) {
    children.push(generateFundSourceTree(depth + 1, maxDepth, walletAddresses));
  }
  
  return {
    id: `node-${depth}-${Math.random().toString(16).slice(2, 10)}`,
    address: walletAddresses.length > 0 && depth === 1
      ? walletAddresses[Math.floor(Math.random() * walletAddresses.length)]
      : `0x${Math.random().toString(16).slice(2, 42)}`,
    value: children.reduce((sum, child) => sum + child.value, 0),
    chain: ['Ethereum', 'Bitcoin', 'Polygon', 'Arbitrum'][Math.floor(Math.random() * 4)],
    depth,
    children
  };
};

// Generate time series data for chart from transactions
const generateTimeSeriesData = (transactions: Transaction[] = []) => {
  const data = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date();
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (transactions.length > 0) {
    // Group transactions by week
    const weeklyData: Record<string, { inflow: number; outflow: number }> = {};
    
    transactions.forEach(tx => {
      const txDate = new Date(tx.timestamp);
      const weekStart = new Date(txDate);
      weekStart.setDate(txDate.getDate() - txDate.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { inflow: 0, outflow: 0 };
      }
      
      if (tx.fromAddress.startsWith('0x9c')) {
        weeklyData[weekKey].inflow += tx.amount;
      } else {
        weeklyData[weekKey].outflow += tx.amount;
      }
    });
    
    // Convert to array and sort
    return Object.entries(weeklyData)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  // Fallback to random data
  for (let i = 0; i < totalDays; i += 7) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      inflow: Math.random() * 500 + 100,
      outflow: Math.random() * 400 + 50,
    });
  }
  
  return data;
};

// Calculate summary data
export const calculateSummaryData = (
  inbound: Transaction[],
  outbound: Transaction[]
) => {
  const totalIn = inbound.reduce((sum, tx) => sum + tx.amount, 0);
  const totalOut = outbound.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Collect unique addresses
  const uniqueAddresses = new Set();
  [...inbound, ...outbound].forEach(tx => {
    uniqueAddresses.add(tx.fromAddress);
    uniqueAddresses.add(tx.toAddress);
  });
  
  // Count transactions by chain
  const chainCounts: Record<string, number> = {};
  const layerCounts = { L1: 0, L2: 0 };
  
  [...inbound, ...outbound].forEach(tx => {
    chainCounts[tx.chain] = (chainCounts[tx.chain] || 0) + 1;
    layerCounts[tx.layer as keyof typeof layerCounts] += 1;
  });
  
  return {
    totalIn,
    totalOut,
    netFlow: totalIn - totalOut,
    transactionCount: inbound.length + outbound.length,
    uniqueAddressCount: uniqueAddresses.size,
    potentiallyOwnedAddresses: Math.floor(uniqueAddresses.size * 0.15),
    chainCounts,
    layerCounts
  };
};

// Export data generation functions
export { generateTransactions, generateAddresses, generateChainStats, generateFundSourceTree, generateTimeSeriesData };

// Create default mock data (for backward compatibility)
export const inboundTransactions = generateTransactions(150, 'in');
export const outboundTransactions = generateTransactions(80, 'out');
export const possibleAddresses = generateAddresses(35);
export const chainStatistics = generateChainStats();
export const fundSourceTree = generateFundSourceTree();
export const timeSeriesData = generateTimeSeriesData();
export const summaryData = calculateSummaryData(inboundTransactions, outboundTransactions);
