
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UpdatePasswordFormProps {
  initialError?: string | null;
}

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ initialError }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Update error if initialError changes
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  useEffect(() => {
    // Kontrollera om användaren kommit via en återställningslänk
    const checkRecoveryToken = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Session check på UpdatePasswordForm:", data.session ? "Har session" : "Ingen session");
        
        if (!data.session || !data.session.user) {
          setError("Ingen giltig återställningslänk hittades. Vänligen begär en ny återställningslänk.");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Fel vid sessionskontroll:", err);
        setError("Ett fel uppstod vid verifiering av din session.");
      }
    };

    checkRecoveryToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken");
      return;
    }

    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message);
        console.error("Fel vid lösenordsuppdatering:", updateError);
        return;
      }

      setSuccess(true);
      toast.success("Ditt lösenord har uppdaterats");

      // Automatisk omdirigering efter 3 sekunder
      setTimeout(() => {
        navigate("/salon/login");
      }, 3000);
    } catch (err) {
      console.error("Fel vid lösenordsuppdatering:", err);
      setError("Ett problem uppstod. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && error) {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h3 className="text-xl font-medium">Ogiltig eller utgången länk</h3>
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
          <p className="text-muted-foreground">
            Vänligen begär en ny återställningslänk från inloggningssidan.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/salon/login")} 
          className="w-full"
        >
          Gå till inloggning
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="text-xl font-medium">Lösenordet uppdaterat</h3>
          <p className="text-muted-foreground">
            Ditt lösenord har uppdaterats. Du kommer att omdirigeras till inloggningssidan...
          </p>
        </div>
        <Button 
          onClick={() => navigate("/salon/login")} 
          className="w-full"
        >
          Gå till inloggning
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Skapa nytt lösenord</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Ange ett nytt lösenord för ditt konto.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="password">Nytt lösenord</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minst 6 tecken"
            disabled={loading}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Bekräfta lösenord</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Upprepa lösenordet"
            disabled={loading}
            required
            className="w-full"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={loading || !isAuthenticated}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uppdaterar lösenord...
            </>
          ) : (
            "Uppdatera lösenord"
          )}
        </Button>
      </form>
    </div>
  );
};
