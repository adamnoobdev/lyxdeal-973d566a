import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

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

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const LoginForm = ({ 
  email, 
  password, 
  loading, 
  setEmail, 
  setPassword 
}: LoginFormProps) => {
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vänligen fyll i både e-post och lösenord");
      return;
    }

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.error(getErrorMessage(signInError));
        return;
      }

      if (!authData.user) {
        toast.error("Ingen användare hittades");
        return;
      }

      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', authData.user.id)
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
      console.error('Login error:', error);
      toast.error("Ett oväntat fel inträffade vid inloggning");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignIn}>
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
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