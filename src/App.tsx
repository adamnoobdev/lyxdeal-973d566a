
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Index from './pages/Index';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import Admin from './pages/Admin';
import SalonDashboard from './pages/SalonDashboard';
import SalonLogin from './pages/SalonLogin';
import UpdatePassword from './pages/UpdatePassword';
import SalonDetails from './pages/SalonDetails';
import PartnerPage from './pages/PartnerPage';
import PartnerSignup from './pages/PartnerSignup';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import SecureDeal from './pages/SecureDeal';
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import { SalonDeals } from './components/salon/SalonDeals';
import { supabase } from '@/integrations/supabase/client';
import { CookieConsent } from './components/cookie/CookieConsent';

function App() {
  // Logga auth-status när appen laddas, men försök inte automatiskt logga in
  useEffect(() => {
    // Passiv kontroll av auth-status, utan automatisk inloggning
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Initial auth check:", data.session ? "User is logged in" : "No session found");
      
      if (data.session) {
        console.log("Auth: User signed in, session expires at:", new Date(data.session.expires_at || 0).toISOString());
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed in App.tsx: ${event}`, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_OUT') {
        console.log("Auth: User signed out, clearing session");
      } else if (session) {
        console.log("Auth: Session updated, expires at:", new Date(session.expires_at || 0).toISOString());
      }
    });
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="auth" element={<Navigate to="/salon/login" replace />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="deals/:id" element={<ProductDetails />} />
            <Route path="deal/:id" element={<ProductDetails />} />
            <Route path="secure-deal/:id" element={<SecureDeal />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="partner" element={<PartnerPage />} />
            <Route path="partner/signup" element={<PartnerSignup />} />
            <Route path="bli-partner" element={<PartnerPage />} />
            <Route path="salons/:id" element={<SalonDetails />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            
            <Route path="/admin/*" element={<Admin />} />
            
            <Route path="/salon/login" element={<SalonLogin />} />
            <Route path="/salon/update-password" element={<UpdatePassword />} />
            <Route path="/salon/dashboard" element={<SalonDashboard />} />
            <Route path="/salon/deal" element={<SalonDeals />} />
            <Route path="/salon/deals" element={<SalonDeals />} />
            <Route path="/salon/customers" element={<SalonDashboard />} />
            <Route path="/salon/settings" element={<SalonDashboard />} />
          </Route>
        </Routes>
      </Router>
      <CookieConsent />
    </>
  );
}

export default App;
