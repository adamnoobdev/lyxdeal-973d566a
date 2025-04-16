
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
import SalonDealPage from './pages/SalonDealPage';
import PartnerPage from './pages/PartnerPage';
import PartnerSignup from './pages/PartnerSignup';
import CreatorPage from './pages/CreatorPage';
import CreatorSignup from './pages/CreatorSignup';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import SecureDeal from './pages/SecureDeal';
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import CreateAdmin from './pages/CreateAdmin';
import { CustomersTable } from './components/salon/CustomersTable';
import { SalonSettings } from './components/salon/SalonSettings';
import { supabase } from '@/integrations/supabase/client';
import { CookieConsent } from './components/cookie/CookieConsent';
import { ScrollToTop } from './components/navigation/ScrollToTop';

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
    
    // Handle recovery hash in URL on initial page load
    const handleRecoveryHash = () => {
      const hash = window.location.hash;
      if (hash) {
        console.log("Hash detected in URL:", hash.substring(0, 20) + "...");
        
        // Check if it's a recovery token
        if (hash.includes('type=recovery')) {
          console.log("Recovery token detected in URL hash");
          
          // Redirect to update password page without losing the hash
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/update-password') && !currentPath.includes('/salon/update-password')) {
            console.log("Redirecting to update password page with hash");
            window.location.href = '/salon/update-password' + hash;
          }
        } else if (hash.includes('error=')) {
          // Handle error cases
          console.error("Error in auth hash:", hash);
          
          // Extract error details
          const errorParams = new URLSearchParams(hash.substring(1));
          const errorCode = errorParams.get('error_code');
          const errorDesc = errorParams.get('error_description');
          
          console.error(`Auth error: ${errorCode} - ${errorDesc}`);
          
          // Redirect to login page with error
          if (!window.location.pathname.includes('/salon/login')) {
            window.location.href = '/salon/login?error=' + encodeURIComponent(errorDesc || 'Unknown error');
          }
        }
      }
    };
    
    handleRecoveryHash();
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Lösenordsåterställningsrutter utanför Layout för att undvika navigationselement */}
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/salon/update-password" element={<UpdatePassword />} />
          
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
            <Route path="creator" element={<CreatorPage />} />
            <Route path="creator/signup" element={<CreatorSignup />} />
            <Route path="bli-partner" element={<PartnerPage />} />
            <Route path="salons/:id" element={<SalonDetails />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/create-admin" element={<CreateAdmin />} />
            
            <Route path="/salon/login" element={<SalonLogin />} />
            <Route path="/salon/dashboard" element={<SalonDashboard />} />
            <Route path="/salon/deal" element={<SalonDealPage />} />
            <Route path="/salon/deals" element={<SalonDealPage />} />
            <Route path="/salon/customers" element={<CustomersTable />} />
            <Route path="/salon/settings" element={<SalonSettings />} />
          </Route>
        </Routes>
      </Router>
      <CookieConsent />
    </>
  );
}

export default App;
