import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { getUserRole } from "@/utils/auth";

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    console.error('Complete auth error:', {
      message: error.message,
      status: error.status,
      name: error.name,
      code: error.code
    });
    
    if (error.status === 400) {
      return "Kontrollera dina inloggningsuppgifter och försök igen";
    }
    
    switch (error.message) {
      case 'Invalid login credentials':
        return "Felaktigt användarnamn eller lösenord";
      case 'Email not confirmed':
        return "Vänligen bekräfta din e-postadress först";
      case 'Invalid email or password':
        return "Ogiltig e-postadress eller lösenord";
      default:
        return `Ett fel uppstod: ${error.message}`;
    }
  }
  console.error('Unexpected error:', error);
  return "Ett oväntat fel inträffade. Vänligen försök igen";
};

export default function SalonLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingTestAccount, setCreatingTestAccount] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vänligen fyll i både e-post och lösenord");
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to sign in with:', { email });
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        console.log('Found existing session:', {
          user: currentSession.user.email,
          expires: currentSession.expires_at
        });
        await supabase.auth.signOut();
        console.log('Signed out existing session');
      }

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error details:', signInError);
        toast.error(getErrorMessage(signInError));
        return;
      }

      if (!authData.user) {
        console.error('No user data returned');
        toast.error("Ingen användare hittades");
        return;
      }

      console.log('Successfully signed in as:', authData.user.email);

      // Check user role
      const userRole = await getUserRole();
      console.log('User role:', userRole);

      if (!userRole) {
        console.error('No role found for user');
        toast.error("Ingen behörighet hittades för användaren");
        await supabase.auth.signOut();
        return;
      }

      if (userRole === 'admin') {
        console.log('Admin user detected, proceeding to dashboard');
        navigate("/salon/dashboard");
        return;
      }

      // For salon users, check salon data
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (salonError) {
        console.error('Salon data error:', salonError);
        toast.error('Kunde inte hämta salongsdata: ' + salonError.message);
        return;
      }

      if (!salonData && userRole === 'salon') {
        console.error('No salon data found for user:', authData.user.id);
        toast.error('Ingen salongsdata hittades för denna användare');
        return;
      }

      console.log('Successfully retrieved salon data:', salonData);
      navigate("/salon/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : "Ett oväntat fel inträffade vid inloggning");
    } finally {
      setLoading(false);
    }
  };

  const createTestAccount = async () => {
    setCreatingTestAccount(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-salon');
      
      if (error) {
        console.error('Error creating test account:', error);
        toast.error("Kunde inte skapa testkonto: " + error.message);
        return;
      }

      if (!data || !data.email || !data.password) {
        throw new Error('Ogiltig respons från servern');
      }

      setEmail(data.email);
      setPassword(data.password);
      toast.success("Testkonto skapat! Använd de ifyllda uppgifterna för att logga in.");
    } catch (error) {
      console.error('Error creating test account:', error);
      toast.error("Kunde inte skapa testkonto: " + (error instanceof Error ? error.message : 'Okänt fel'));
    } finally {
      setCreatingTestAccount(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Salongsportal</h1>
          <p className="text-muted-foreground">
            Logga in för att hantera din salong
          </p>
          <p className="text-sm text-muted-foreground">
            Använd admin@example.com och password för att logga in som admin
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || creatingTestAccount}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || creatingTestAccount}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading || creatingTestAccount}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loggar in...
              </>
            ) : (
              "Logga in"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Eller</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={createTestAccount}
          disabled={loading || creatingTestAccount}
        >
          {creatingTestAccount ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Skapar testkonto...
            </>
          ) : (
            "Skapa testkonto"
          )}
        </Button>
      </Card>
    </div>
  );
}