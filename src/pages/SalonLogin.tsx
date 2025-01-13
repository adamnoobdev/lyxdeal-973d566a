import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CreateSalonDialog } from "@/components/admin/salons/CreateSalonDialog";
import { LoginForm } from "@/components/salon/LoginForm";
import { TestAccountManager } from "@/components/salon/TestAccountManager";

export default function SalonLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateSalon = async (values: any) => {
    try {
      const temporaryPassword = Math.random().toString(36).slice(-8);

      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: temporaryPassword,
      });

      if (authError) throw authError;

      if (!user) {
        throw new Error('No user returned from signup');
      }

      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (salonError) throw salonError;

      toast.success("Salong skapad! Kontrollera din e-post för att verifiera kontot.");
      setIsCreateDialogOpen(false);

      return {
        salon,
        temporaryPassword,
      };
    } catch (error) {
      console.error('Error creating salon:', error);
      toast.error("Kunde inte skapa salong: " + (error instanceof Error ? error.message : 'Okänt fel'));
      throw error;
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

        <LoginForm 
          email={email}
          password={password}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Eller</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Skapa ny salong
          </Button>

          <TestAccountManager 
            setEmail={setEmail}
            setPassword={setPassword}
            loading={loading}
          />
        </div>
      </Card>

      <CreateSalonDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSalon}
      />
    </div>
  );
}