
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';
import TopBar from './TopBar';
import { SalonAuthGuard } from '@/components/salon/SalonAuthGuard';

const Layout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Kontrollera om vi är på en sida som kräver salon autentisering
  const requiresSalonAuth = path.startsWith('/salon') && 
                          path !== '/salon/login' && 
                          !path.startsWith('/salon/deal/');
  
  // Kontrollera om vi är på admin sidan
  const isAdmin = path.startsWith('/admin');

  const content = (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <NavigationBar />
      <main className="flex-1 pt-36"> {/* Öka padding-top för att undvika överlappning */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );

  // Använd SalonAuthGuard för sidor som kräver autentisering
  if (requiresSalonAuth) {
    return <SalonAuthGuard>{content}</SalonAuthGuard>;
  }
  
  // För admin sidor används AdminAuthCheck i Admin.tsx
  return content;
};

export default Layout;
