import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { TestAccountButton } from "@/components/auth/TestAccountButton";
import { getErrorMessage } from "@/utils/auth/errorHandling";
import { getUserRole } from "@/utils/auth";
import { getRedirectPath } from "@/utils/auth/redirects";

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
      // Logga ut eventuell tidigare session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        await supabase.auth.signOut();
      }

      // Försök logga in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Inloggningsfel:", signInError);
        toast.error(getErrorMessage(signInError));
        return;
      }

      if (!authData.user) {
        toast.error("Ingen användare hittades");
        return;
      }

      // Hämta användarroll
      const userRole = await getUserRole();
      console.log("Användarroll:", userRole);

      if (!userRole) {
        toast.error("Ingen behörighet hittades för användaren");
        await supabase.auth.signOut();
        return;
      }

      // Kontrollera behörighet och redirect baserat på roll
      const redirectPath = getRedirectPath(userRole);
      
      if (userRole === "admin") {
        console.log("Admin-användare identifierad");
        toast.success("Välkommen admin!");
        navigate(redirectPath);
        return;
      }

      // För salongsanvändare, verifiera att salongsdata finns
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (salonError) {
        console.error("Fel vid hämtning av salongsdata:", salonError);
        toast.error('Kunde inte hämta salongsdata: ' + salonError.message);
        return;
      }

      if (!salonData && userRole === 'salon') {
        console.error("Ingen salongsdata hittades");
        toast.error('Ingen salongsdata hittades för denna användare');
        return;
      }

      navigate(redirectPath);
      toast.success("Välkommen tillbaka!");
    } catch (error) {
      console.error("Oväntat fel:", error);
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
        console.error("Fel vid skapande av testkonto:", error);
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
      console.error("Fel vid skapande av testkonto:", error);
      toast.error("Kunde inte skapa testkonto: " + (error instanceof Error ? error.message : 'Okänt fel'));
    } finally {
      setCreatingTestAccount(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md p-6 space-y-6">
        <LoginHeader />
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          creatingTestAccount={creatingTestAccount}
          onSubmit={handleSignIn}
        />
        <TestAccountButton 
          loading={loading}
          creatingTestAccount={creatingTestAccount}
          onCreateTestAccount={createTestAccount}
        />
      </Card>
    </div>
  );
}