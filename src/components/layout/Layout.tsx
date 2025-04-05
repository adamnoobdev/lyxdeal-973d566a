
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import TopBar from '@/components/layout/TopBar';
import { Footer } from '@/components/Footer';
import { SalonAuthGuard } from '@/components/salon/SalonAuthGuard';
import { useSession } from '@/hooks/useSession';

const Layout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { session } = useSession();
  const isLoggedIn = !!session?.user;
  
  // Kontrollera om vi är på en sida som kräver salon autentisering
  const requiresSalonAuth = path.startsWith('/salon') && 
                          path !== '/salon/login' && 
                          !path.startsWith('/salon/deal/');
  
  // Kontrollera om vi är på admin sidan
  const isAdmin = path.startsWith('/admin');

  // Använd ingen top-padding på söksidan för att breadcrumbs ska ligga direkt under navbar
  const isSearchPage = path.startsWith('/search');
  
  // Huvudinnehåll får padding-top för att kompensera för den sticky navbaren
  // Minskat lite för söksidan så breadcrumbs får plats fint
  const mainPaddingClass = isSearchPage ? 'pt-2' : 'pt-6';

  // Adjust top margin based on whether the user is logged in or not
  const topMargin = isLoggedIn ? 'mt-[56px]' : 'mt-[96px]';

  const content = (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <NavigationBar userRole={isAdmin ? 'admin' : undefined} />
      <main className={`flex-1 ${mainPaddingClass} ${topMargin}`}>
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
