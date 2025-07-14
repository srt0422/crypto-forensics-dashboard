
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallets } from '@/contexts/WalletContext';
import { useAccountHolder } from '@/contexts/AccountHolderContext';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const { accountHolders } = useWallets();
  const { selectedAccountHolderId, setSelectedAccountHolderId } = useAccountHolder();
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()),
    to: new Date(),
  });

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedAccountHolderId || "all"} onValueChange={(value) => setSelectedAccountHolderId(value === "all" ? null : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select account holder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Account Holders</SelectItem>
              {accountHolders.map((holder) => (
                <SelectItem key={holder.id} value={holder.id}>
                  {holder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(selected) => {
                  if (selected?.from && selected?.to) {
                    setDateRange({ from: selected.from, to: selected.to });
                  }
                }}
                defaultMonth={dateRange.from}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
