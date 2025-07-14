
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import LoginPage from "@/components/LoginPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { AccountHolderProvider } from "@/contexts/AccountHolderContext";
import Index from "./pages/Index";
import NetworkAnalytics from "./pages/NetworkAnalytics";
import InboundTransactions from "./pages/InboundTransactions";
import OutboundTransactions from "./pages/OutboundTransactions";
import AddressAttribution from "./pages/AddressAttribution";
import FundSourceHierarchy from "./pages/FundSourceHierarchy";
import WalletManagement from "./pages/WalletManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/wallet-management" element={<Layout><WalletManagement /></Layout>} />
        <Route path="/network-analytics" element={<Layout><NetworkAnalytics /></Layout>} />
        <Route path="/inbound-transactions" element={<Layout><InboundTransactions /></Layout>} />
        <Route path="/outbound-transactions" element={<Layout><OutboundTransactions /></Layout>} />
        <Route path="/address-attribution" element={<Layout><AddressAttribution /></Layout>} />
        <Route path="/fund-source-hierarchy" element={<Layout><FundSourceHierarchy /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <WalletProvider>
          <AccountHolderProvider>
            <AppContent />
          </AccountHolderProvider>
        </WalletProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
