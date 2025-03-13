// Import vid toppen av filen
import { useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Auth from "@/pages/Auth";
import SalonLogin from "@/pages/SalonLogin";
import SalonDashboard from "@/pages/SalonDashboard";
import ProductDetails from "@/pages/ProductDetails";
import SecureDeal from "@/pages/SecureDeal"; // Ny import
import PartnerPage from "@/pages/PartnerPage";
import SearchResults from "@/pages/SearchResults";

// Import components
import Layout from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { AdminAuthCheck } from "@/components/admin/auth/AdminAuthCheck";
import { SalonAuthGuard } from "@/components/salon/SalonAuthGuard";
import { SalonDeals } from "@/components/salon/SalonDeals";

// Setup QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms" element={<Terms />} />
            <Route path="bli-partner" element={<PartnerPage />} />
            <Route path="deal/:id" element={<ProductDetails />} />
            <Route path="secure-deal/:id" element={<SecureDeal />} />
            <Route path="search" element={<SearchResults />} />
          </Route>

          {/* Admin Pages */}
          <Route path="/admin" element={<AdminAuthCheck><AdminLayout /></AdminAuthCheck>}>
            <Route index element={<Dashboard />} />
            {/* ... keep existing admin routes */}
          </Route>

          {/* Salon Dashboard */}
          <Route path="/salon" element={<SalonAuthGuard><Layout /></SalonAuthGuard>}>
            <Route index element={<SalonDashboard />} />
            <Route path="deal/:id" element={<SalonDeals />} />
          </Route>

          {/* Auth Pages */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/salon/login" element={<SalonLogin />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
