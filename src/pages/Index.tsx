
import DashboardHeader from '@/components/DashboardHeader';
import SummaryCards from '@/components/SummaryCards';
import TransactionChart from '@/components/TransactionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilteredData } from '@/hooks/useFilteredData';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const Dashboard = () => {
  const { inboundTransactions, outboundTransactions, chainStatistics } = useFilteredData();
  
  // Calculate data for the chain distribution pie chart
  const chainData = Object.entries(
    chainStatistics.reduce((acc: Record<string, number>, chain) => {
      acc[chain.chain] = chain.transactionCount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#1e3a8a', '#0d9488', '#dc2626', '#16a34a', '#ca8a04', '#7e22ce', '#475569'];

  return (
    <div>
      <DashboardHeader 
        title="Forensic Wallet Dashboard" 
        subtitle="Comprehensive overview of financial activity over the past two years" 
      />

      <SummaryCards />
      <TransactionChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Chain Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chainData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {chainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, undefined]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-80 overflow-auto">
              {[...inboundTransactions, ...outboundTransactions]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{tx.chain}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 font-mono truncate max-w-[200px]">
                        {tx.hash}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${tx.fromAddress.startsWith('0x9c') ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {tx.fromAddress.startsWith('0x9c') ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
