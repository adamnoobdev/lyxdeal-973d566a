
import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { DealsListContainer } from '@/components/admin/deals/DealsListContainer';
import { SalonsList } from '@/components/admin/salons/SalonsList';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { DebugPanel } from '@/components/admin/debug/DebugPanel';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const [forceRedirect, setForceRedirect] = useState(false);
  
  // Lyssna på auth-ändringar för att hantera utloggning bättre
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`Admin component auth event: ${event}`, 
        currentSession ? "Session exists" : "No session");
      
      if (event === 'SIGNED_OUT') {
        console.log("Admin detected SIGNED_OUT event, redirecting");
        setForceRedirect(true);
        
        // Säkerställ omdirigering även på auth-event
        setTimeout(() => {
          window.location.href = '/salon/login';
        }, 100);
      }
    });
    
    // Rensa prenumerationen när komponenten avmonteras
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Kontrollera autentiseringsstatus med förbättrad loggning
  useEffect(() => {
    console.log("Admin component auth check - Session status:", 
      session ? "Active session detected" : "No session detected", 
      "Loading:", isLoading
    );
    
    if (!isLoading && !session) {
      console.log("No active session detected in Admin component, redirecting to login");
      toast.info("Du måste logga in för att accessa admin-panelen");
      navigate('/salon/login', { replace: true });
    }
  }, [session, isLoading, navigate]);
  
  // Kontrollera om vi ska visa debug-panelen baserat på query-parametrar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    setShowDebugPanel(debug === 'true');
  }, []);
  
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
      </AdminLayout>
    </AdminAuthCheck>
  );
};

export default Admin;
