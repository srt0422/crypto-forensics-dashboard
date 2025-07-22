import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallets } from '@/contexts/WalletContext';
import { Plus, RefreshCw, Trash2, Wallet, Clock, Users, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletManagement = () => {
  const { 
    wallets, 
    accountHolders, 
    addWallet, 
    removeWallet, 
    addAccountHolder, 
    removeAccountHolder, 
    reimportWalletData, 
    isImporting 
  } = useWallets();
  
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [selectedAccountHolder, setSelectedAccountHolder] = useState('');
  const [newAccountHolderName, setNewAccountHolderName] = useState('');

  const handleAddAccountHolder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccountHolderName.trim()) {
      return;
    }

    try {
      const newId = await addAccountHolder(newAccountHolderName.trim());
      setSelectedAccountHolder(newId);
      setNewAccountHolderName('');
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAddress.trim() || !newLabel.trim() || !selectedAccountHolder) {
      return;
    }

    // Basic validation for crypto address format
    if (newAddress.length < 26 || newAddress.length > 62) {
      alert('Please enter a valid wallet address');
      return;
    }

    try {
      await addWallet(newAddress.trim(), newLabel.trim(), selectedAccountHolder);
      setNewAddress('');
      setNewLabel('');
    } catch (error) {
      // Error handling is done in the context
    }
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

  const getWalletsByAccountHolder = () => {
    const grouped = accountHolders.map(accountHolder => ({
      accountHolder,
      wallets: wallets.filter(w => w.accountHolderId === accountHolder.id)
    }));
    return grouped;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Account Holder Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Add Account Holder</span>
            </CardTitle>
            <CardDescription>
              Create a new account holder to group wallets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAccountHolder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input
                  id="accountName"
                  placeholder="e.g., John Doe, Trading Account"
                  value={newAccountHolderName}
                  onChange={(e) => setNewAccountHolderName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Account Holder
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add Wallet Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Wallet</span>
            </CardTitle>
            <CardDescription>
              Add a cryptocurrency wallet to an account holder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWallet} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder</Label>
                <Select value={selectedAccountHolder} onValueChange={setSelectedAccountHolder} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account holder" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountHolders.map((holder) => (
                      <SelectItem key={holder.id} value={holder.id}>
                        {holder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Button type="submit" className="w-full" disabled={accountHolders.length === 0}>
                {accountHolders.length === 0 ? 'Add Account Holder First' : 'Add Wallet'}
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
                <span className="text-sm font-medium">Account Holders</span>
                <Badge variant="secondary">{accountHolders.length}</Badge>
              </div>
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

      {/* Grouped Wallet List */}
      {accountHolders.length === 0 ? (
        <Alert>
          <AlertDescription>
            No account holders created yet. Add an account holder to start organizing wallets.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {getWalletsByAccountHolder().map((group) => (
            <Card key={group.accountHolder.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <CardTitle>{group.accountHolder.name}</CardTitle>
                    <Badge variant="outline">{group.wallets.length} wallets</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAccountHolder(group.accountHolder.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Created on {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(group.accountHolder.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {group.wallets.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No wallets assigned to this account holder yet.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {group.wallets.map((wallet, index) => (
                      <div key={wallet.id}>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Wallet className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate">
                                  {wallet.label}
                                </h4>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {truncateAddress(wallet.address)}
                                </p>
                                <div className="flex items-center space-x-3 mt-1">
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
                        {index < group.wallets.length - 1 && <Separator className="my-1" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletManagement;