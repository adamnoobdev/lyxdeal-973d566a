
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/salon/UpdatePasswordForm';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdatePasswordProps {
  redirectTo?: string;
}

export default function UpdatePassword({ redirectTo = "/salon/login" }: UpdatePasswordProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const handleTokenParameters = async () => {
      try {
        console.log("Checking for reset token on page:", window.location.href);
        
        // First check for hash fragment (Supabase auth default format)
        const hashFragment = window.location.hash.substring(1);
        console.log("Hash fragment present:", !!hashFragment);
        
        if (hashFragment && hashFragment.includes('access_token')) {
          try {
            console.log("Found access token in hash fragment");
            
            // Parse the hash parameters
            const params = new URLSearchParams(hashFragment);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');
            
            console.log("Token type:", type);
            
            // If we have token and type from hash, and it's for recovery
            if (accessToken && refreshToken && type === 'recovery') {
              console.log("Valid recovery token found, setting session");
              
              // Set session data manually
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error("Failed to set session from hash:", error);
                setTokenError("Ett fel uppstod vid verifiering av återställningslänken. Vänligen begär en ny.");
                setIsProcessingToken(false);
                return;
              }
              
              console.log("Successfully set session from hash token");
              console.log("Session exists:", !!data.session);
              
              // Clear hash from URL without reloading page
              window.history.replaceState(null, '', window.location.pathname);
              setIsProcessingToken(false);
              return;
            }
          } catch (err) {
            console.error("Error processing URL hash:", err);
          }
        }
        
        // Check query parameters if no hash token found
        if (location.search) {
          console.log("Query params present:", location.search);
          const params = new URLSearchParams(location.search);
          const token = params.get('token');
          
          if (token) {
            console.log("Found token in query params, verifying");
            
            try {
              // Try to verify the token
              const { error } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'recovery'
              });
              
              if (error) {
                console.error("Failed to verify token from query:", error);
                setTokenError("Ogiltig eller utgången återställningslänk. Vänligen begär en ny.");
                setIsProcessingToken(false);
                return;
              }
              
              console.log("Successfully verified token from query");
              
              // Clear URL parameters
              window.history.replaceState(null, '', window.location.pathname);
              setIsProcessingToken(false);
              return;
            } catch (err) {
              console.error("Error verifying token from query:", err);
              setTokenError("Ett fel uppstod vid verifiering av återställningslänken.");
              setIsProcessingToken(false);
              return;
            }
          }
        }
        
        // If no token found anywhere, check if we have an existing session
        console.log("No token found, checking if session exists");
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("No session found, user should request a new reset link");
          setTokenError("Ingen giltig återställningslänk hittades. Vänligen begär en ny återställningslänk.");
        } else {
          console.log("Found existing session for password reset");
        }
        
        setIsProcessingToken(false);
      } catch (err) {
        console.error("Error processing URL parameters:", err);
        setTokenError("Ett fel uppstod vid hantering av återställningslänken");
        setIsProcessingToken(false);
      }
    };
    
    handleTokenParameters();
  }, [location]);

  // Show loading state while processing token
  if (isProcessingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verifierar återställningslänk...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(redirectTo)}
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
            <UpdatePasswordForm error={tokenError} redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </div>
  );
}
