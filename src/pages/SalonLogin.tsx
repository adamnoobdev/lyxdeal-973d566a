import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function SalonLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (signInError instanceof AuthApiError && signInError.message === 'Invalid login credentials') {
          toast.error("Felaktigt användarnamn eller lösenord");
        } else {
          console.error("Sign in error:", signInError);
          toast.error("Ett fel uppstod vid inloggning. Kontrollera dina uppgifter och försök igen.");
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Ingen användare hittades");
        setLoading(false);
        return;
      }

      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (salonError) {
        console.error("Salon fetch error:", salonError);
        toast.error('Kunde inte hämta salongsdata');
        setLoading(false);
        return;
      }

      if (!salonData) {
        toast.error('Ingen salongsdata hittades för denna användare');
        setLoading(false);
        return;
      }

      navigate("/salon/dashboard");
    } catch (error) {
      console.error('Complete login error:', error);
      toast.error("Ett oväntat fel inträffade vid inloggning");
    } finally {
      setLoading(false);
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
        </div>

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
            {loading ? "Laddar..." : "Logga in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}