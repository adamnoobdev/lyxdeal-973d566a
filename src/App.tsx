import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { LandingPage } from './pages/LandingPage';
import { DealPage } from './pages/DealPage';
import { SalonPage } from './pages/SalonPage';
import { SearchPage } from './pages/SearchPage';
import { SalonAuthGuard } from './components/salon/SalonAuthGuard';
import Salon from './pages/Salon';
import SalonLogin from './pages/SalonLogin';
import SalonRegister from './pages/SalonRegister';
import Admin from './pages/Admin';
import { useSession } from './hooks/useSession';
import { Profile } from './pages/Profile';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Contact } from './pages/Contact';
import { Cookies } from './pages/Cookies';
import { useUserRole } from './hooks/useUserRole';
import AdminUsers from "./pages/AdminUsers";

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/deals/:dealId" element={<DealPage />} />
          <Route path="/salons/:salonId" element={<SalonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* Salon routes - only accessible if NOT logged in */}
          <Route path="/salon/login" element={session ? <Navigate to="/salon" replace /> : <SalonLogin />} />
          <Route path="/salon/register" element={session ? <Navigate to="/salon" replace /> : <SalonRegister />} />

          {/* Salon routes - only accessible if logged in as a salon */}
          <Route path="/salon" element={
            <SalonAuthGuard>
              <Salon />
            </SalonAuthGuard>
          } />

          {/* User profile - must be logged in */}
           <Route path="/profile" element={session ? <Profile /> : <Navigate to="/" replace />} />

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
