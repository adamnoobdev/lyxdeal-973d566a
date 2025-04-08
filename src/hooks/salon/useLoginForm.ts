
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const MAX_LOGIN_ATTEMPTS = 5;

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.message) {
      case 'Invalid login credentials':
        return "Felaktigt användarnamn eller lösenord";
      case 'Email not confirmed':
        return "Vänligen bekräfta din e-postadress först";
      default:
        return `Ett fel uppstod vid inloggning: ${error.message}`;
    }
  }
  return "Ett oväntat fel inträffade";
};

export interface LoginFormState {
  email: string;
  password: string;
  loading: boolean;
  captchaToken: string | null;
  loginAttempts: number;
  showCaptcha: boolean;
  securityMessage: string | null;
}

export const useLoginForm = () => {
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
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        if (data.session) {
          console.log('User already has active session, redirecting...');
          handleRedirectAfterLogin(data.session.user.id);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };
    
    checkExistingSession();
  }, []);

  const handleRedirectAfterLogin = async (userId: string) => {
    try {
      console.log('Fetching salon data for user:', userId);
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (salonError) {
        console.error('Kunde inte hämta salongsdata:', salonError);
        toast.error('Kunde inte hämta salongsdata');
        return;
      }

      if (!salonData) {
        console.error('Ingen salongsdata hittades för denna användare');
        toast.error('Ingen salongsdata hittades för denna användare');
        return;
      }

      console.log('Salon role found:', salonData.role);
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
    console.log('CAPTCHA verification succeeded');
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
    setSecurityMessage(null);

    try {
      console.log('Attempting login for:', email);
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setLoginAttempts(prev => prev + 1);
        console.error('Login failed:', signInError.message);
        toast.error(getErrorMessage(signInError));
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setLoginAttempts(prev => prev + 1);
        console.error('No user returned from authentication');
        toast.error("Ingen användare hittades");
        setLoading(false);
        return;
      }

      // Reset login attempts on success
      toast.success('Inloggning lyckades!');
      console.log('Login successful, user ID:', authData.user.id);
      setLoginAttempts(0);
      setCaptchaToken(null);
      handleRedirectAfterLogin(authData.user.id);
      
    } catch (error) {
      console.error('Unexpected login error:', error);
      setLoginAttempts(prev => prev + 1);
      toast.error("Ett oväntat fel inträffade vid inloggning");
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    captchaToken,
    loginAttempts,
    showCaptcha,
    securityMessage,
    handleVerificationSuccess,
    handleSignIn
  };
};
