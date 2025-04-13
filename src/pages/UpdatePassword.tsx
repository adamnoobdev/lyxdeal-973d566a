
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/salon/UpdatePasswordForm';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a token in the URL and handle it
    const handleAuthParameters = async () => {
      try {
        console.log("UpdatePassword page loaded:", location.pathname);
        setIsLoading(true);
        
        // Get the hash fragment (everything after #)
        const hashFragment = window.location.hash.substring(1);
        console.log("Hash fragment:", hashFragment ? "Present" : "Missing");
        
        if (hashFragment && hashFragment.includes('access_token')) {
          try {
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
              console.log("Found recovery token in hash, attempting to log in user");
              
              // Set session data manually
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error("Could not set session:", error);
                setError("Ett fel uppstod vid verifiering av återställningslänken");
                toast.error("Ett fel uppstod vid verifiering av återställningslänken");
                return;
              }
              
              console.log("Recovery token processed successfully", data.session ? "Session set" : "No session");
              
              // Clear hash from URL without reloading page
              window.history.replaceState(null, '', window.location.pathname);
            } else if (type) {
              console.warn("Hash fragment contained wrong type:", type);
              setError("Ogiltig återställningslänk. Begär en ny återställningslänk.");
            }
          } catch (err) {
            console.error("Error handling URL hash:", err);
            setError("Ett fel uppstod vid behandling av återställningslänken");
          }
        } else {
          // Check if we have an active session
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            console.warn("No session found and no token in URL");
            setError("Ingen giltig återställningslänk hittades. Vänligen begär en ny återställningslänk.");
          } else {
            console.log("Active session exists, user can update password");
          }
        }
      } catch (err) {
        console.error("Error handling URL parameters:", err);
        setError("Ett fel uppstod. Vänligen försök igen eller begär en ny återställningslänk.");
      } finally {
        setIsLoading(false);
      }
    };
    
    handleAuthParameters();
  }, [location]);

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
