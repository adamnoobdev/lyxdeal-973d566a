
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { DebugPanel } from '@/components/admin/debug/DebugPanel';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Lazy-loaded components för att minska initial laddningstid
const DealsListContainer = lazy(() => import('@/components/admin/deals/DealsListContainer').then(module => ({
  default: module.DealsListContainer
})));

const SalonsList = lazy(() => import('@/components/admin/salons/SalonsList').then(module => ({
  default: module.SalonsList
})));

// Loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const Admin = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const [forceRedirect, setForceRedirect] = useState(false);
  const location = useLocation();
  
  // Optimerad auth state change lyssning
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`Admin component auth event: ${event}`);
      
      if (event === 'SIGNED_OUT') {
        console.log("Admin detected SIGNED_OUT event, redirecting");
        setForceRedirect(true);
        
        // Säkerställ omdirigering
        setTimeout(() => {
          window.location.href = '/salon/login';
        }, 100);
      }
    });
    
    // Rensa prenumerationen när komponenten avmonteras
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Memoized check för authentication status
  const checkAuth = useCallback(() => {
    if (!isLoading && !session) {
      console.log("No active session detected in Admin component");
      toast.info("Du måste logga in för att accessa admin-panelen");
      navigate('/salon/login', { replace: true });
    }
  }, [session, isLoading, navigate]);
  
  // Använd den optimerade auth-checken
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Optimerad debug panel check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    setShowDebugPanel(debug === 'true');
  }, [location.search]);
  
  // Om omdirigering är nödvändig, visa inget
  if (forceRedirect) {
    return <Navigate to="/salon/login" replace />;
  }
  
  // Om fortfarande laddar, visa en laddningsindikator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Om ingen session och inte laddar, kommer omdirigeringen att ske från useEffect ovan
  if (!session && !isLoading) {
    return null;
  }
  
  return (
    <AdminAuthCheck>
      <AdminLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route index element={
              <>
                <Dashboard />
                {showDebugPanel && <div className="mt-6"><DebugPanel /></div>}
              </>
            } />
            <Route path="deals/*" element={<DealsListContainer />} />
            <Route path="salons/*" element={<SalonsList />} />
            <Route path="debug" element={<DebugPanel />} />
          </Routes>
        </Suspense>
      </AdminLayout>
    </AdminAuthCheck>
  );
};

export default Admin;
