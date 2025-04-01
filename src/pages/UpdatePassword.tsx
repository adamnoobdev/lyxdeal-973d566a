
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/salon/UpdatePasswordForm';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kontrollera om vi har ett access_token i URL:en (hash fragment)
    const handleHashParameters = async () => {
      // Get the hash fragment (everything after #)
      const hashFragment = window.location.hash.substring(1);
      
      if (hashFragment && hashFragment.includes('access_token')) {
        try {
          // Extract the access token using URLSearchParams
          const params = new URLSearchParams(hashFragment);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');
          
          // Om vi har fått token och typ från hash, och det är för lösenordsåterställning
          if (accessToken && refreshToken && type === 'recovery') {
            console.log("Hittade återställningstoken, försöker att logga in användaren");
            
            // Sätt sessiondata manuellt
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error("Kunde inte sätta session:", error);
              toast.error("Ett fel uppstod vid verifiering av återställningslänken");
              return;
            }
            
            console.log("Återställningstoken behandlades framgångsrikt");
            
            // Rensa hash från URL:en utan att ladda om sidan
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (err) {
          console.error("Fel vid hantering av URL hash:", err);
          toast.error("Ett fel uppstod vid behandling av återställningslänken");
        }
      }
    };
    
    handleHashParameters();
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
            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
