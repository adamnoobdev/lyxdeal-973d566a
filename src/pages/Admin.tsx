
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { DealsListContainer } from '@/components/admin/deals/DealsListContainer';
import { SalonsList } from '@/components/admin/salons/SalonsList';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { DebugPanel } from '@/components/admin/debug/DebugPanel';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';

const Admin = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  
  // Check for auth status changes with improved logging
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
  
  // Check if we should show debug panel based on query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    setShowDebugPanel(debug === 'true');
  }, []);
  
  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If no session and not loading, the redirect will happen from the useEffect above
  // This is just an extra safety check
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
