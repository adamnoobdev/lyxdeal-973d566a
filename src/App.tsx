
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CookieConsent } from './components/cookie/CookieConsent';
import router from './routes';

function App() {
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Initial auth check:", data.session ? "User is logged in" : "No session found");
      
      if (data.session) {
        console.log("Auth: User signed in, session expires at:", new Date(data.session.expires_at || 0).toISOString());
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed in App.tsx: ${event}`, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_OUT') {
        console.log("Auth: User signed out, clearing session");
      } else if (session) {
        console.log("Auth: Session updated, expires at:", new Date(session.expires_at || 0).toISOString());
      }
    });
    
    const handleRecoveryHash = () => {
      const hash = window.location.hash;
      if (hash) {
        console.log("Hash detected in URL:", hash.substring(0, 20) + "...");
        
        if (hash.includes('type=recovery')) {
          console.log("Recovery token detected in URL hash");
          
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/update-password') && !currentPath.includes('/salon/update-password')) {
            console.log("Redirecting to update password page with hash");
            window.location.href = '/salon/update-password' + hash;
          }
        } else if (hash.includes('error=')) {
          console.error("Error in auth hash:", hash);
          
          const errorParams = new URLSearchParams(hash.substring(1));
          const errorCode = errorParams.get('error_code');
          const errorDesc = errorParams.get('error_description');
          
          console.error(`Auth error: ${errorCode} - ${errorDesc}`);
          
          if (!window.location.pathname.includes('/salon/login')) {
            window.location.href = '/salon/login?error=' + encodeURIComponent(errorDesc || 'Unknown error');
          }
        }
      }
    };
    
    handleRecoveryHash();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <CookieConsent />
    </>
  );
}

export default App;
