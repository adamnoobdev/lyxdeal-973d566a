
import React from "react";
import { usePasswordReset } from "@/hooks/salon/usePasswordReset";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

interface PasswordResetFormProps {
  onBack: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack }) => {
  const { email, setEmail, loading, success, resetPassword } = usePasswordReset();

  if (success) {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="text-xl font-medium">Återställningslänk skickad</h3>
          <p className="text-muted-foreground">
            Vi har skickat instruktioner för återställning av lösenord till:
          </p>
          <p className="font-medium">{email}</p>
          <p className="text-sm text-muted-foreground mt-4">
            Kontrollera din inkorg och skräppost. Klicka på länken i e-postmeddelandet för att återställa ditt lösenord.
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till inloggning
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Återställ lösenord</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Ange din e-postadress så skickar vi instruktioner för att återställa ditt lösenord.
        </p>
      </div>
      
      <form className="space-y-4" onSubmit={resetPassword}>
        <div className="space-y-2">
          <Label htmlFor="reset-email">E-postadress</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="namn@exempel.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              Skickar instruktioner...
            </>
          ) : (
            "Skicka återställningsinstruktioner"
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full" 
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till inloggning
        </Button>
      </form>
    </div>
  );
};
