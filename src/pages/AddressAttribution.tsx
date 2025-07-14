
import { useState, useMemo } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilteredData } from '@/hooks/useFilteredData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AddressAttribution = () => {
  const { possibleAddresses } = useFilteredData();
  const [searchTerm, setSearchTerm] = useState('');

  // Apply search filter
  const filteredAddresses = useMemo(() => {
    if (!searchTerm) return possibleAddresses;
    
    const searchLower = searchTerm.toLowerCase();
    return possibleAddresses.filter(addr => 
      addr.address.toLowerCase().includes(searchLower) ||
      addr.chain.toLowerCase().includes(searchLower) ||
      addr.tokenType.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  // Color function for confidence scores
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'bg-crypto-green';
    if (confidence >= 50) return 'bg-crypto-teal';
    if (confidence >= 25) return 'bg-crypto-yellow';
    return 'bg-crypto-red';
  };

  return (
    <div>
      <DashboardHeader 
        title="Address Attribution" 
        subtitle="Analysis of possibly owned addresses with confidence scores" 
      />

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Search Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by address, chain, or token type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Possibly Owned Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">Confidence</th>
                  <th className="py-3 px-4 text-left">First Seen</th>
                  <th className="py-3 px-4 text-left">Last Seen</th>
                  <th className="py-3 px-4 text-right">Tx Count</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-left">Chain</th>
                  <th className="py-3 px-4 text-left">Token Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredAddresses.map((addr) => (
                  <tr key={addr.address} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs">{addr.address}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={addr.confidence} className={`h-2 ${getConfidenceColor(addr.confidence)}`} />
                        <span className="text-sm">{addr.confidence.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(addr.firstSeen).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(addr.lastSeen).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">{addr.transactionCount}</td>
                    <td className="py-3 px-4 text-right">${addr.totalValue.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{addr.chain}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{addr.tokenType}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAddresses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No matching addresses found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressAttribution;
