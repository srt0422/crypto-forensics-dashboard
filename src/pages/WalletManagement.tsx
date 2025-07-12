import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWallets } from '@/contexts/WalletContext';
import { Plus, RefreshCw, Trash2, Wallet, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletManagement = () => {
  const { wallets, addWallet, removeWallet, reimportWalletData, isImporting } = useWallets();
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAddress.trim() || !newLabel.trim()) {
      return;
    }

    // Basic validation for crypto address format
    if (newAddress.length < 26 || newAddress.length > 62) {
      alert('Please enter a valid wallet address');
      return;
    }

    addWallet(newAddress.trim(), newLabel.trim());
    setNewAddress('');
    setNewLabel('');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet Management</h1>
          <p className="text-muted-foreground">
            Add and manage cryptocurrency wallets for transaction monitoring
          </p>
        </div>
        <Button
          onClick={reimportWalletData}
          disabled={isImporting || wallets.length === 0}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isImporting ? 'animate-spin' : ''}`} />
          <span>{isImporting ? 'Re-importing...' : 'Re-import Data'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Wallet Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Wallet</span>
            </CardTitle>
            <CardDescription>
              Add a cryptocurrency wallet to start monitoring its transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWallet} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Wallet Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., Main Wallet, Exchange Wallet"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  placeholder="Enter wallet address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Wallet
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Wallet Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Overview</CardTitle>
            <CardDescription>
              Current wallet monitoring status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Wallets</span>
                <Badge variant="secondary">{wallets.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Monitoring</span>
                <Badge variant="default">
                  {wallets.filter(w => w.isActive).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={isImporting ? "default" : "secondary"}>
                  {isImporting ? "Syncing" : "Ready"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Monitored Wallets</span>
          </CardTitle>
          <CardDescription>
            Manage your cryptocurrency wallets and their monitoring status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wallets.length === 0 ? (
            <Alert>
              <AlertDescription>
                No wallets added yet. Add your first wallet to start monitoring transactions.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet, index) => (
                <div key={wallet.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">
                            {wallet.label}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {truncateAddress(wallet.address)}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              Last sync: {formatDate(wallet.lastSync)}
                            </div>
                            <Badge 
                              variant={wallet.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {wallet.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWallet(wallet.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {index < wallets.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;