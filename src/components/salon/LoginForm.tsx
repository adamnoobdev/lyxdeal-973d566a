
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_LOGIN_ATTEMPTS = 5;
const CAPTCHA_SITE_KEY = "10000000-ffff-ffff-ffff-000000000001"; // Replace with your actual hCaptcha site key in production

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Show CAPTCHA after second attempt
  useEffect(() => {
    if (loginAttempts >= 2) {
      setShowCaptcha(true);
    }
  }, [loginAttempts]);

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

  const handleVerificationSuccess = (token: string) => {
    setCaptchaToken(token);
    setSecurityMessage("Verifiering lyckades. Du kan nu logga in.");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vänligen fyll i både e-post och lösenord");
      return;
    }

    // If many login attempts, require CAPTCHA
    if (loginAttempts >= 2 && !captchaToken) {
      setSecurityMessage("Vänligen verifiera att du inte är en robot");
      return;
    }

    // Too many attempts
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      setSecurityMessage("För många inloggningsförsök. Vänta en stund och försök igen.");
      setTimeout(() => {
        setLoginAttempts(0);
        setSecurityMessage(null);
      }, 30000); // Reset after 30 seconds
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setLoginAttempts(prev => prev + 1);
        toast.error(getErrorMessage(signInError));
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setLoginAttempts(prev => prev + 1);
        toast.error("Ingen användare hittades");
        setLoading(false);
        return;
      }

      // Reset login attempts on success
      setLoginAttempts(0);
      setCaptchaToken(null);
      handleRedirectAfterLogin(authData.user.id);
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginAttempts(prev => prev + 1);
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
          autoComplete="current-password"
        />
      </div>
      
      {showCaptcha && (
        <div className="py-3">
          <HCaptcha
            sitekey={CAPTCHA_SITE_KEY}
            onVerify={handleVerificationSuccess}
          />
        </div>
      )}

      {securityMessage && (
        <Alert variant={captchaToken ? "default" : "destructive"} className="my-2">
          <AlertDescription className="flex items-center gap-2">
            {captchaToken ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
            {securityMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading || (loginAttempts >= MAX_LOGIN_ATTEMPTS)}
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
