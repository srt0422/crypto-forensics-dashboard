
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chainStatistics } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const NetworkAnalytics = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredData = filter === 'all' 
    ? chainStatistics 
    : chainStatistics.filter(chain => chain.layer === filter);

  const volumeData = filteredData.map(chain => ({
    name: chain.chain,
    value: chain.totalVolume,
  }));

  const txCountData = filteredData.map(chain => ({
    name: chain.chain,
    value: chain.transactionCount,
  }));

  return (
    <div>
      <DashboardHeader 
        title="Network Analytics" 
        subtitle="Chain-specific metrics and cross-chain analysis" 
      />

      <div className="flex justify-end mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by layer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chains</SelectItem>
            <SelectItem value="L1">Layer 1 Only</SelectItem>
            <SelectItem value="L2">Layer 2 Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Transaction Volume by Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Volume']}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Volume" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Transaction Count by Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={txCountData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Transactions" fill="#1e3a8a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mt-6">
        <CardHeader>
          <CardTitle>Chain Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Chain</th>
                  <th className="py-3 px-4 text-left">Layer</th>
                  <th className="py-3 px-4 text-right">Transactions</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-right">Unique Addresses</th>
                  <th className="py-3 px-4 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((chain) => (
                  <tr key={chain.chain} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-medium">{chain.chain}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={chain.layer === 'L1' ? 'default' : 'secondary'}>
                        {chain.layer}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">{chain.transactionCount}</td>
                    <td className="py-3 px-4 text-right">${chain.totalVolume.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{chain.uniqueAddresses}</td>
                    <td className="py-3 px-4 text-right">{chain.percentageOfTotal.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkAnalytics;
