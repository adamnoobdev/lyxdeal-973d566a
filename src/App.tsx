
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { CookieConsent } from './components/cookie/CookieConsent';
import { ScrollToTop } from './components/navigation/ScrollToTop';
import { SitemapRenderer } from './components/sitemap/SitemapRenderer';
import { RobotsRenderer } from './components/seo/RobotsRenderer';

// Lazy load components to improve initial load time
const Index = lazy(() => import('./pages/Index'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const SalonDetails = lazy(() => import('./pages/SalonDetails'));
const SalonDealPage = lazy(() => import('./pages/SalonDealPage'));
const SalonLogin = lazy(() => import('./pages/SalonLogin'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const SecureDeal = lazy(() => import('./pages/SecureDeal'));

// These pages are less frequently accessed, so lazy loading makes more sense
const Admin = lazy(() => import('./pages/Admin'));
const SalonDashboard = lazy(() => import('./pages/SalonDashboard'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));
const PartnerSignup = lazy(() => import('./pages/PartnerSignup'));
const CreatorPage = lazy(() => import('./pages/CreatorPage'));
const CreatorSignup = lazy(() => import('./pages/CreatorSignup'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const CreateAdmin = lazy(() => import('./pages/CreateAdmin'));
const AdminCollaborations = lazy(() => import('./pages/AdminCollaborations'));
const AdminCreators = lazy(() => import('./pages/AdminCreators'));
const CustomersTable = lazy(() => import('./components/salon/CustomersTable').then(module => ({ default: module.CustomersTable })));
const SalonSettings = lazy(() => import('./components/salon/SalonSettings').then(module => ({ default: module.SalonSettings })));

// Loading component for Suspense fallbacks
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Initial auth check:", data.session ? "User is logged in" : "No session found");
      
      if (data.session) {
        console.log("Auth: User signed in, session expires at:", new Date(data.session.expires_at || 0).toISOString());
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed in App.tsx: ${event}`, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_OUT') {
        console.log("Auth: User signed out, clearing session");
      } else if (session) {
        console.log("Auth: Session updated, expires at:", new Date(session.expires_at || 0).toISOString());
      }
    });
    
    const handleRecoveryHash = () => {
      const hash = window.location.hash;
      if (hash) {
        console.log("Hash detected in URL:", hash.substring(0, 20) + "...");
        
        if (hash.includes('type=recovery')) {
          console.log("Recovery token detected in URL hash");
          
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/update-password') && !currentPath.includes('/salon/update-password')) {
            console.log("Redirecting to update password page with hash");
            window.location.href = '/salon/update-password' + hash;
          }
        } else if (hash.includes('error=')) {
          console.error("Error in auth hash:", hash);
          
          const errorParams = new URLSearchParams(hash.substring(1));
          const errorCode = errorParams.get('error_code');
          const errorDesc = errorParams.get('error_description');
          
          console.error(`Auth error: ${errorCode} - ${errorDesc}`);
          
          if (!window.location.pathname.includes('/salon/login')) {
            window.location.href = '/salon/login?error=' + encodeURIComponent(errorDesc || 'Unknown error');
          }
        }
      }
    };
    
    handleRecoveryHash();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* SEO related routes */}
            <Route path="/sitemap.xml" element={<SitemapRenderer />} />
            <Route path="/robots.txt" element={<RobotsRenderer />} />
            
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
              <Route path="/admin/collaborations" element={<AdminCollaborations />} />
              <Route path="/admin/creators" element={<AdminCreators />} />
              <Route path="/create-admin" element={<CreateAdmin />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <CookieConsent />
    </>
  );
}

export default App;
