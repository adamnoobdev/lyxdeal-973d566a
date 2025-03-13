
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Admin-sidor hanteras separat med egen layout
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return <Outlet />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
