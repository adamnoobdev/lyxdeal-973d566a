
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/salon/UpdatePasswordForm';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ErrorDisplay } from '@/components/subscription/ErrorDisplay';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a token in the URL and handle it
    const handleAuthParameters = async () => {
      try {
        console.log("UpdatePassword page loaded:", location.pathname);
        setIsLoading(true);
        
        // Check for error in query params (redirected from App.tsx)
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setIsLoading(false);
          return;
        }
        
        // Get the hash fragment (everything after #)
        const hashFragment = window.location.hash.substring(1);
        console.log("Hash fragment:", hashFragment ? "Present (length: " + hashFragment.length + ")" : "Missing");
        
        if (hashFragment) {
          try {
            if (hashFragment.includes('error=')) {
              // Extract error from hash
              const params = new URLSearchParams(hashFragment);
              const errorCode = params.get('error_code');
              const errorDesc = params.get('error_description');
              setError(errorDesc ? decodeURIComponent(errorDesc) : 'Ett okänt fel uppstod');
              console.error(`Auth hash error: ${errorCode} - ${errorDesc}`);
              setIsLoading(false);
              return;
            }
            
            // Extract the access token using URLSearchParams
            const params = new URLSearchParams(hashFragment);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');
            
            console.log("Hash fragment analyzed:", { 
              type, 
              hasAccessToken: !!accessToken, 
              hasRefreshToken: !!refreshToken 
            });
            
            // If we got a token and type from hash, and it's for password recovery
            if (accessToken && refreshToken && type === 'recovery') {
              console.log("Found recovery token in hash, attempting to set session");
              
              // Set session data manually
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error("Could not set session:", error);
                setError(`Ett fel uppstod vid verifiering av återställningslänken: ${error.message}`);
                toast.error("Ett fel uppstod vid verifiering av återställningslänken");
                setIsLoading(false);
                return;
              }
              
              console.log("Recovery token processed successfully", data.session ? "Session set" : "No session");
              
              // Clear hash from URL without reloading page
              window.history.replaceState(null, '', window.location.pathname);
              setIsLoading(false);
            } else if (type) {
              console.warn("Hash fragment contained wrong type:", type);
              setError("Ogiltig återställningslänk. Begär en ny återställningslänk.");
              setIsLoading(false);
            } else {
              // Check if we have an active session
              const { data } = await supabase.auth.getSession();
              if (!data.session) {
                console.warn("No session found and no valid token in URL");
                setError("Ingen giltig återställningslänk hittades. Vänligen begär en ny återställningslänk.");
              }
              setIsLoading(false);
            }
          } catch (err) {
            console.error("Error handling URL hash:", err);
            setError("Ett fel uppstod vid behandling av återställningslänken");
            setIsLoading(false);
          }
        } else {
          // Check if we have an active session
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            console.warn("No session found and no token in URL");
            setError("Ingen giltig återställningslänk hittades. Vänligen begär en ny återställningslänk.");
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error handling URL parameters:", err);
        setError("Ett fel uppstod. Vänligen försök igen eller begär en ny återställningslänk.");
        setIsLoading(false);
      }
    };
    
    handleAuthParameters();
  }, [location, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/salon/login")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till inloggningssidan
        </Button>

        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Uppdatera lösenord</h2>
            <p className="text-muted-foreground mt-2">Skapa ett nytt lösenord för att återfå åtkomst till ditt konto</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <UpdatePasswordForm initialError={error} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
