import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

export default function SalonLogin() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Lyssna på auth-statusändringar
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      // Kontrollera om användaren är kopplad till en salong
      const { data: salon } = await supabase
        .from("salons")
        .select("*")
        .eq("user_id", session?.user.id)
        .single();

      if (salon) {
        navigate("/salon/dashboard");
      } else {
        setError("Ditt konto är inte kopplat till någon salong. Kontakta administratören.");
        await supabase.auth.signOut();
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Salongsportal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Logga in för att hantera dina erbjudanden
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#666666',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'E-postadress',
                  password_label: 'Lösenord',
                  button_label: 'Logga in',
                },
                sign_up: {
                  email_label: 'E-postadress',
                  password_label: 'Lösenord',
                  button_label: 'Skapa konto',
                },
              },
            }}
            providers={[]}
          />
        </Card>
      </div>
    </div>
  );
}