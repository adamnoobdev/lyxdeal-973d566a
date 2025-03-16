
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { DealsListContainer } from '@/components/admin/deals/DealsListContainer';
import { SalonsList } from '@/components/admin/salons/SalonsList';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { DebugPanel } from '@/components/admin/debug/DebugPanel';

const Admin = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  // Check if we should show debug panel based on query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    setShowDebugPanel(debug === 'true');
  }, []);
  
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
