
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
