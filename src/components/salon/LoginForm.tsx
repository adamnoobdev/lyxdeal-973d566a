
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.message) {
      case 'Invalid login credentials':
        return "Felaktigt användarnamn eller lösenord";
      case 'Email not confirmed':
        return "Vänligen bekräfta din e-postadress först";
      default:
        return "Ett fel uppstod vid inloggning";
    }
  }
  return "Ett oväntat fel inträffade";
};

export const SalonLoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in, and redirect if needed
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        handleRedirectAfterLogin(data.session.user.id);
      }
    };
    
    checkExistingSession();
  }, []);

  const handleRedirectAfterLogin = async (userId: string) => {
    try {
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (salonError) {
        toast.error('Kunde inte hämta salongsdata');
        return;
      }

      if (!salonData) {
        toast.error('Ingen salongsdata hittades för denna användare');
        return;
      }

      if (salonData.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/salon/dashboard");
      }
    } catch (error) {
      console.error('Redirect error:', error);
      navigate("/");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vänligen fyll i både e-post och lösenord");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.error(getErrorMessage(signInError));
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Ingen användare hittades");
        setLoading(false);
        return;
      }

      handleRedirectAfterLogin(authData.user.id);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Ett oväntat fel inträffade vid inloggning");
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSignIn}>
      <div className="space-y-2">
        <Label htmlFor="email">E-postadress</Label>
        <Input
          id="email"
          type="email"
          placeholder="namn@exempel.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          className="w-full"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
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
  );
};
