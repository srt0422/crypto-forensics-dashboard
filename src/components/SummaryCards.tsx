
import {
  ArrowDown,
  ArrowUp,
  Users,
  FilterIcon,
  Database,
  LinkIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { summaryData } from '@/data/mockData';

const SummaryCards = () => {
  const {
    totalIn,
    totalOut,
    netFlow,
    transactionCount,
    uniqueAddressCount,
    potentiallyOwnedAddresses,
    layerCounts,
  } = summaryData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-sm animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Funds</CardTitle>
          <FilterIcon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-gray-500 block">Inflows</span>
              <div className="flex items-center mt-1">
                <ArrowDown className="h-4 w-4 text-crypto-green mr-1" />
                <span className="text-2xl font-bold">${totalIn.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 block">Outflows</span>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-crypto-red mr-1" />
                <span className="text-2xl font-bold">${totalOut.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-gray-500 block">Net Flow</span>
            <div className="flex items-center mt-1">
              {netFlow >= 0 ? (
                <ArrowDown className="h-4 w-4 text-crypto-green mr-1" />
              ) : (
                <ArrowUp className="h-4 w-4 text-crypto-red mr-1" />
              )}
              <span
                className={`text-2xl font-bold ${
                  netFlow >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                }`}
              >
                ${Math.abs(netFlow).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Activity</CardTitle>
          <FilterIcon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-500 block">Transactions</span>
              <span className="text-2xl font-bold">{transactionCount}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 block">Unique Addresses</span>
              <span className="text-2xl font-bold">{uniqueAddressCount}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 block">Possibly Owned</span>
              <span className="text-2xl font-bold">{potentiallyOwnedAddresses}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Chain Distribution</CardTitle>
          <Database className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">Layer 1 Chains</span>
                <span className="text-xs font-medium">{layerCounts.L1} txns</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-crypto-blue h-2 rounded-full"
                  style={{
                    width: `${(layerCounts.L1 / (layerCounts.L1 + layerCounts.L2)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">Layer 2 Chains</span>
                <span className="text-xs font-medium">{layerCounts.L2} txns</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-crypto-teal h-2 rounded-full"
                  style={{
                    width: `${(layerCounts.L2 / (layerCounts.L1 + layerCounts.L2)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 text-crypto-purple mr-1" />
                  <span className="text-xs font-medium">Cross-Chain Activity</span>
                </div>
                <span className="text-xs font-medium">
                  {Math.round((layerCounts.L2 / (layerCounts.L1 + layerCounts.L2)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
