
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilteredData } from '@/hooks/useFilteredData';

const TransactionChart = () => {
  const { timeSeriesData } = useFilteredData();
  
  return (
    <Card className="shadow-sm mt-6">
      <CardHeader>
        <CardTitle>Transaction Flow Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeSeriesData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                stroke="#888"
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                stroke="#888"
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="inflow"
                name="Inflow"
                stroke="#16a34a"
                fillOpacity={1}
                fill="url(#colorInflow)"
              />
              <Area
                type="monotone"
                dataKey="outflow"
                name="Outflow"
                stroke="#dc2626"
                fillOpacity={1}
                fill="url(#colorOutflow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
