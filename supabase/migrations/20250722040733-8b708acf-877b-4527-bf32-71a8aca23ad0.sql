-- Create account holders table
CREATE TABLE public.account_holders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create wallets table
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  label TEXT NOT NULL,
  account_holder_id UUID NOT NULL REFERENCES public.account_holders(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create transactions table for storing transaction data
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('in', 'out')),
  amount DECIMAL NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  chain TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  block_number BIGINT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.account_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for account_holders
CREATE POLICY "Users can view their own account holders" 
ON public.account_holders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own account holders" 
ON public.account_holders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own account holders" 
ON public.account_holders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own account holders" 
ON public.account_holders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for wallets
CREATE POLICY "Users can view their own wallets" 
ON public.wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallets" 
ON public.wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" 
ON public.wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets" 
ON public.wallets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_wallets_account_holder_id ON public.wallets(account_holder_id);
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_transactions_wallet_address ON public.transactions(wallet_address);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_timestamp ON public.transactions(timestamp);
CREATE INDEX idx_account_holders_user_id ON public.account_holders(user_id);