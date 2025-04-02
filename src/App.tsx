
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { useSession } from './hooks/useSession';
import { useUserRole } from './hooks/useUserRole';
import AdminUsers from "./pages/AdminUsers";
import Admin from './pages/Admin';

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
          {/* Public routes */}
          <Route path="/" element={<div>Landing Page</div>} />
          <Route path="/deals/:dealId" element={<div>Deal Page</div>} />
          <Route path="/salons/:salonId" element={<div>Salon Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
          <Route path="/terms" element={<div>Terms Page</div>} />
          <Route path="/privacy" element={<div>Privacy Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/cookies" element={<div>Cookies Page</div>} />

          {/* Salon routes - only accessible if NOT logged in */}
          <Route path="/salon/login" element={session ? <Navigate to="/salon" replace /> : <div>Salon Login</div>} />
          <Route path="/salon/register" element={session ? <Navigate to="/salon" replace /> : <div>Salon Register</div>} />

          {/* Salon routes - only accessible if logged in as a salon */}
          <Route path="/salon" element={
            session ? <div>Salon Dashboard</div> : <Navigate to="/salon/login" replace />
          } />

          {/* User profile - must be logged in */}
           <Route path="/profile" element={session ? <div>Profile Page</div> : <Navigate to="/" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/deals" element={<Admin />} />
          <Route path="/admin/salons" element={<Admin />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
        
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
