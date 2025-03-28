
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import TopBar from './layout/TopBar';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
