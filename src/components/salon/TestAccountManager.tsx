import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TestAccountManagerProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  loading: boolean;
}

export const TestAccountManager = ({ 
  setEmail, 
  setPassword,
  loading 
}: TestAccountManagerProps) => {
  const [creatingTestAccount, setCreatingTestAccount] = useState(false);

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
  );
};