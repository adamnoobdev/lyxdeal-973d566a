
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
    // Kontrollera om vi har ett access_token i URL:en (hash fragment eller query param)
    const handleTokenParameters = async () => {
      try {
        console.log("Söker efter återställningstoken på sidan:", window.location.href);
        
        // Check hash fragment first (Supabase auth default redirect format)
        const hashFragment = window.location.hash.substring(1);
        console.log("Hash fragment:", hashFragment ? "Finns" : "Saknas");
        
        if (hashFragment && hashFragment.includes('access_token')) {
          try {
            // Extract the access token using URLSearchParams
            const params = new URLSearchParams(hashFragment);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');
            
            console.log("Hash fragment analyserad:", { 
              type, 
              hasAccessToken: !!accessToken, 
              hasRefreshToken: !!refreshToken 
            });
            
            // Om vi har fått token och typ från hash, och det är för lösenordsåterställning
            if (accessToken && refreshToken && type === 'recovery') {
              console.log("Hittade återställningstoken i hash, försöker att använda den");
              
              // Sätt sessiondata manuellt
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error("Kunde inte sätta session från hash:", error);
                setTokenError("Ett fel uppstod vid verifiering av återställningslänken. Vänligen begär en ny.");
                setIsProcessingToken(false);
                return;
              }
              
              console.log("Återställningstoken från hash behandlades framgångsrikt", data.session ? "Session satt" : "Ingen session");
              
              // Rensa hash från URL:en utan att ladda om sidan
              window.history.replaceState(null, '', window.location.pathname);
              setIsProcessingToken(false);
              return;
            }
          } catch (err) {
            console.error("Fel vid hantering av URL hash:", err);
            setTokenError("Ett fel uppstod vid behandling av återställningslänken från hash");
          }
        }
        
        // Check query parameters if no hash token found (our edge function format)
        if (location.search && location.search.includes('token=')) {
          console.log("Hittade token i query parameter");
          const params = new URLSearchParams(location.search);
          const token = params.get('token');
          
          if (token) {
            try {
              console.log("Försöker använda token från query parameter");
              
              // Försök använda token för att verifiera
              const { error } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'recovery'
              });
              
              if (error) {
                console.error("Kunde inte verifiera token från query:", error);
                setTokenError("Ogiltig eller utgången återställningslänk. Vänligen begär en ny.");
                setIsProcessingToken(false);
                return;
              }
              
              console.log("Token från query verifierad framgångsrikt");
              
              // Rensa URL:en
              window.history.replaceState(null, '', window.location.pathname);
            } catch (err) {
              console.error("Fel vid hantering av token från query:", err);
              setTokenError("Ett fel uppstod vid behandling av återställningslänken från query");
              setIsProcessingToken(false);
              return;
            }
          }
        }
        
        // If we've got here with no token found anywhere, check if we have a session already
        console.log("Kontrollerar om det finns en aktiv session");
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Aktiv session hittad vid lösenordsåterställning");
        } else {
          console.log("Ingen session eller token hittades, användaren bör skickas tillbaka");
          setTokenError("Ingen giltig återställningslänk hittades. Vänligen begär en ny återställningslänk.");
        }
        
        setIsProcessingToken(false);
      } catch (err) {
        console.error("Fel vid hantering av URL-parametrar:", err);
        setTokenError("Ett fel uppstod vid hantering av återställningslänken");
        setIsProcessingToken(false);
      }
    };
    
    handleTokenParameters();
  }, [location]);

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
