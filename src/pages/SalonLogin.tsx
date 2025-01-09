import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

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
      // Steg 1: Autentisering
      const authResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authResponse.error) {
        console.error("Auth error:", authResponse.error);
        if (authResponse.error.message.includes('Invalid login credentials')) {
          toast.error("Felaktigt användarnamn eller lösenord");
        } else {
          toast.error(`Inloggningen misslyckades: ${authResponse.error.message}`);
        }
        return;
      }

      const user = authResponse.data.user;
      if (!user) {
        toast.error("Ingen användare hittades");
        return;
      }

      // Steg 2: Hämta salongsdata
      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .select()
        .eq('user_id', user.id)
        .single();

      if (salonError) {
        console.error("Salon data error:", salonError);
        toast.error('Kunde inte hämta salongsdata');
        return;
      }

      if (!salon) {
        toast.error('Ingen salongsdata hittades för denna användare');
        return;
      }

      // Steg 3: Navigera till dashboard
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