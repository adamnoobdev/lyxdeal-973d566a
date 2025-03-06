
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function Auth() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: salon, error } = await supabase
            .from('salons')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error) throw error;

          if (salon) {
            if (salon.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/salon/dashboard');
            }
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/');
        }
      }
      
      if (event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setErrorMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Felaktigt email eller lösenord. Kontrollera dina uppgifter och försök igen.';
        case 'email_not_confirmed':
          return 'Vänligen verifiera din email innan du loggar in.';
        case 'user_not_found':
          return 'Ingen användare hittades med dessa uppgifter.';
        case 'invalid_grant':
          return 'Felaktiga inloggningsuppgifter.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-lg">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Välkommen till Lyxdeal
          </h1>
          <p className="text-muted-foreground">
            Logga in för att fortsätta
          </p>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#520053',
                  brandAccent: '#FEB4FF',
                  inputBackground: 'white',
                  inputBorder: '#E5E7EB',
                  inputBorderFocus: '#520053',
                  inputBorderHover: '#B944BA',
                  inputLabelText: '#6B7280',
                  inputText: '#374151',
                  messageText: '#520053',
                  anchorTextColor: '#520053',
                  anchorTextHoverColor: '#B944BA',
                }
              }
            },
            className: {
              button: 'bg-primary hover:bg-primary/90 text-white rounded',
              input: 'rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
              label: 'text-primary font-medium',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Lösenord',
                button_label: 'Logga in',
                loading_button_label: 'Loggar in...',
                social_provider_text: 'Logga in med {{provider}}',
                link_text: 'Har du redan ett konto? Logga in'
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Lösenord',
                button_label: 'Registrera',
                loading_button_label: 'Registrerar...',
                social_provider_text: 'Registrera med {{provider}}',
                link_text: 'Har du inget konto? Registrera'
              },
              forgotten_password: {
                email_label: 'Email',
                password_label: 'Lösenord',
                button_label: 'Återställ lösenord',
                loading_button_label: 'Skickar instruktioner...'
              },
            }
          }}
          providers={[]}
          showLinks={false}
        />
      </Card>
    </div>
  );
}
