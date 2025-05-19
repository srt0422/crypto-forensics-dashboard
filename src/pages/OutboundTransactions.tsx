
import { useState, useMemo } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { outboundTransactions } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

const OutboundTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState('all');

  // Get unique chains for filter options
  const chains = useMemo(() => {
    const uniqueChains = new Set(outboundTransactions.map(tx => tx.chain));
    return Array.from(uniqueChains);
  }, []);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return outboundTransactions.filter(tx => {
      // Chain filter
      if (chainFilter !== 'all' && tx.chain !== chainFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          tx.fromAddress.toLowerCase().includes(searchLower) ||
          tx.toAddress.toLowerCase().includes(searchLower) ||
          tx.hash.toLowerCase().includes(searchLower) ||
          tx.chain.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [searchTerm, chainFilter]);

  return (
    <div>
      <DashboardHeader 
        title="Outbound Transactions" 
        subtitle="Detailed view of all outgoing transactions" 
      />

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by address or transaction hash"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={chainFilter} onValueChange={setChainFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                {chains.map((chain) => (
                  <SelectItem key={chain} value={chain}>
                    {chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">From</th>
                  <th className="py-3 px-4 text-left">To</th>
                  <th className="py-3 px-4 text-left">Chain</th>
                  <th className="py-3 px-4 text-left">Hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-crypto-red">
                      -${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs">{tx.fromAddress}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs">{tx.toAddress}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{tx.chain}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs truncate block max-w-[150px]" title={tx.hash}>
                        {tx.hash}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No matching transactions found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutboundTransactions;
