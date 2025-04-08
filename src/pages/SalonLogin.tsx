
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoginHeader } from '@/components/salon/login/LoginHeader';
import { LoginCard } from '@/components/salon/login/LoginCard';
import { supabase } from '@/integrations/supabase/client';

export default function SalonLogin() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
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
  }, [navigate]);

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
          <LoginHeader />
          <LoginCard />
        </div>
      </div>
    </div>
  );
}
