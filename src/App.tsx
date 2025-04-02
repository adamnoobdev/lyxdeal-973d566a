
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { useSession } from './hooks/useSession';
import { useUserRole } from './hooks/useUserRole';
import AdminUsers from "./pages/AdminUsers";
import Admin from './pages/Admin';
import IndexPage from './pages/Index';
import Layout from './components/layout/Layout';
import ProductDetails from './pages/ProductDetails';
import SecureDeal from './pages/SecureDeal';
import SalonLogin from './pages/SalonLogin';
import SearchResults from './pages/SearchResults';
import PartnerPage from './pages/PartnerPage';
import Auth from './pages/Auth';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';

// Import DealsList component for admin deals route
import { DealsList } from './components/admin/deals';
import { SalonsList } from './components/admin/salons/SalonsList';

function App() {
  const queryClient = new QueryClient();
  const { session } = useSession();
  const { userRole, isLoading: isRoleLoading } = useUserRole();
  const [hasCheckedInitialSession, setHasCheckedInitialSession] = useState(false);

  useEffect(() => {
    // Mark that we've checked the initial session, so we don't redirect unnecessarily
    if (!hasCheckedInitialSession && session !== undefined) {
      setHasCheckedInitialSession(true);
    }
  }, [session, hasCheckedInitialSession]);

  // Show a loading indicator if we're still checking the session or user role
  if (!hasCheckedInitialSession || isRoleLoading) {
    return <div>Loading...</div>; // Replace with a more appropriate loading indicator
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main layout with common elements like header and footer */}
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/deal/:id" element={<ProductDetails />} />
            <Route path="/deals/:dealId" element={<ProductDetails />} />
            <Route path="/salons/:salonId" element={<div>Salon Page</div>} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<div>Privacy Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/cookies" element={<div>Cookies Page</div>} />
            <Route path="/partner" element={<PartnerPage />} />

            {/* User profile - must be logged in */}
            <Route path="/profile" element={session ? <div>Profile Page</div> : <Navigate to="/" replace />} />
          </Route>

          {/* Secure deal page */}
          <Route path="/secure-deal/:id" element={<SecureDeal />} />

          {/* Auth route - redirects to login */}
          <Route path="/auth" element={<Auth />} />

          {/* Salon routes - only accessible if NOT logged in */}
          <Route path="/salon/login" element={session ? <Navigate to="/salon" replace /> : <SalonLogin />} />
          <Route path="/salon/register" element={session ? <Navigate to="/salon" replace /> : <div>Salon Register</div>} />

          {/* Salon routes - only accessible if logged in as a salon */}
          <Route path="/salon" element={
            session ? <div>Salon Dashboard</div> : <Navigate to="/salon/login" replace />
          } />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/deals/*" element={<Admin />} />
          <Route path="/admin/salons/*" element={<Admin />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
        
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
