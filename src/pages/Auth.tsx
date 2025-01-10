import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has a salon
        const { data: salon } = await supabase
          .from('salons')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (salon) {
          navigate("/salon/dashboard");
        } else {
          navigate("/");
        }
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Check if user has a salon after sign in
        const { data: salon } = await supabase
          .from('salons')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (salon) {
          toast.success("Välkommen tillbaka!");
          navigate("/salon/dashboard");
        } else {
          navigate("/");
        }
      }
      if (event === "SIGNED_OUT") {
        setErrorMessage("");
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const createTestSalon = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Du måste vara inloggad för att skapa en testsalong");
        return;
      }

      const { error } = await supabase.rpc('create_test_salon', {
        user_id: session.user.id
      });

      if (error) throw error;

      toast.success("Testsalong skapad! Du kommer att omdirigeras till salongsportalen.");
      navigate("/salon/dashboard");
    } catch (error) {
      console.error('Error creating test salon:', error);
      toast.error("Det gick inte att skapa testsalongen");
    }
  };

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        Välkommen till Lyxdeal
      </h1>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "E-postadress",
                password_label: "Lösenord",
                button_label: "Logga in",
                loading_button_label: "Loggar in...",
                social_provider_text: "Logga in med {{provider}}",
                link_text: "Har du redan ett konto? Logga in",
              },
              sign_up: {
                email_label: "E-postadress",
                password_label: "Lösenord",
                button_label: "Skapa konto",
                loading_button_label: "Skapar konto...",
                social_provider_text: "Skapa konto med {{provider}}",
                link_text: "Har du inget konto? Skapa ett",
              },
            },
          }}
          theme="light"
          providers={[]}
        />

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">Utvecklarverktyg:</p>
          <Button 
            onClick={createTestSalon}
            variant="outline"
            className="w-full"
          >
            Skapa testsalong
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;