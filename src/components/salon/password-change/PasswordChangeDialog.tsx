
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordChangeForm, PasswordFormValues } from "./PasswordChangeForm";
import { PasswordUpdateSuccess } from "./PasswordUpdateSuccess";
import { useSession } from "@/hooks/useSession";

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstLogin?: boolean;
}

export const PasswordChangeDialog = ({ isOpen, onClose, isFirstLogin = false }: PasswordChangeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const { session } = useSession();
  
  useEffect(() => {
    // Reset state when dialog opens/closes
    if (!isOpen) {
      setPasswordUpdated(false);
    }
  }, [isOpen]);

  const handleSubmit = async (values: PasswordFormValues) => {
    if (!session) {
      toast.error("Du måste vara inloggad för att uppdatera lösenord");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      const userId = session.user.id;
      
      if (!userId) {
        throw new Error("Kunde inte hitta användar-ID");
      }

      // Uppdatera first_login-status 
      const { error: updateError } = await supabase
        .from("salon_user_status")
        .update({ first_login: false })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      // Spara även i localStorage för att undvika upprepade dialoger i samma session
      localStorage.setItem(`salon_first_login_${userId}`, 'false');

      toast.success("Lösenordet har uppdaterats framgångsrikt!");
      setPasswordUpdated(true);
    } catch (error: any) {
      console.error("Fel vid uppdatering av lösenord:", error);
      toast.error(error.message || "Ett fel uppstod vid uppdatering av lösenordet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hantera stängning av dialogen
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Om det är första inloggning och lösenordet inte har uppdaterats, förhindra stängning
      if (isFirstLogin && !passwordUpdated) {
        return;
      }
      // Annars tillåt stängning och återställ state
      onClose();
    }
  };

  // Hantera explicit klick på stäng-knappen i framgångsvyn
  const handleSuccessClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleDialogClose}
    >
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={
          (isFirstLogin && !passwordUpdated) ? 
            (e) => e.preventDefault() : 
            undefined
        }
      >
        <DialogHeader>
          <DialogTitle>Uppdatera ditt lösenord</DialogTitle>
          <DialogDescription>
            {isFirstLogin 
              ? "Eftersom det här är din första inloggning måste du uppdatera ditt temporära lösenord till ett nytt lösenord som du själv väljer. För säkerhets skull måste lösenordet uppfylla vissa krav."
              : "Uppdatera ditt lösenord till ett nytt lösenord som du själv väljer. För säkerhets skull måste lösenordet uppfylla vissa krav."
            }
          </DialogDescription>
        </DialogHeader>

        {passwordUpdated ? (
          <PasswordUpdateSuccess onClose={handleSuccessClose} />
        ) : (
          <PasswordChangeForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
