
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoginHeader } from '@/components/salon/login/LoginHeader';
import { LoginCard } from '@/components/salon/login/LoginCard';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function SalonLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error parameter
    const errorParam = searchParams.get('error');
    if (errorParam) {
      console.log("Error parameter detected:", errorParam);
      setAuthError(decodeURIComponent(errorParam));
    }
    
    // Check if there's a hash with an error
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashError = hashParams.get('error_description');
    if (hashError) {
      console.log("Error in hash detected:", hashError);
      setAuthError(decodeURIComponent(hashError));
    }
    
    // Kontrollera om användaren redan är inloggad
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Fel vid sessionskontroll:", error);
        }
        
        if (data?.session?.user) {
          // Om användaren är inloggad, hämta salongsrollen
          const { data: salonData } = await supabase
            .from('salons')
            .select('role')
            .eq('user_id', data.session.user.id)
            .maybeSingle();
            
          if (salonData) {
            // Omdirigera baserat på användarens roll
            if (salonData.role === 'admin') {
              navigate("/admin", { replace: true });
            } else {
              navigate("/salon/dashboard", { replace: true });
            }
            return;
          }
        }
      } catch (err) {
        console.error("Autentiseringskontrollsfel:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate, searchParams]);

  // Determine if we should show the reset form based on the error message
  const shouldShowResetForm = authError?.includes('utgången') || 
                              authError?.includes('invalid') || 
                              authError?.includes('expired');

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Kontrollerar inloggningsstatus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till startsidan
        </Button>

        <div className="max-w-md mx-auto">
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                {authError.includes('utgången') || authError.includes('expired') ? 
                  "Återställningslänken har gått ut. Vänligen begär en ny." : 
                  authError
                }
              </AlertDescription>
            </Alert>
          )}
          <LoginHeader />
          <LoginCard showResetForm={shouldShowResetForm} />
        </div>
      </div>
    </div>
  );
}
