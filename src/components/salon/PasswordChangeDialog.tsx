
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Enhanced password validation
const passwordSchema = z.object({
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken")
    .regex(/[A-Z]/, "Lösenordet måste innehålla minst en stor bokstav")
    .regex(/[a-z]/, "Lösenordet måste innehålla minst en liten bokstav")
    .regex(/[0-9]/, "Lösenordet måste innehålla minst en siffra")
    .regex(/[^A-Za-z0-9]/, "Lösenordet måste innehålla minst ett specialtecken"),
  confirmPassword: z.string().min(8, "Lösenordet måste vara minst 8 tecken"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeDialog = ({ isOpen, onClose }: PasswordChangeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue("password", e.target.value);
  };

  const handleSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      const userId = (await supabase.auth.getUser()).data.user?.id;
      
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
      onClose();
    } catch (error: any) {
      console.error("Fel vid uppdatering av lösenord:", error);
      toast.error(error.message || "Ett fel uppstod vid uppdatering av lösenordet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Uppdatera ditt lösenord</DialogTitle>
          <DialogDescription>
            Eftersom det här är din första inloggning behöver du uppdatera ditt temporära lösenord
            till ett nytt lösenord som du själv väljer. För säkerhets skull måste lösenordet uppfylla vissa krav.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nytt lösenord</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Ange nytt lösenord" 
                      {...field} 
                      onChange={handlePasswordChange} 
                    />
                  </FormControl>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="font-medium text-muted-foreground">Ditt lösenord måste innehålla:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="flex items-center">
                        {hasMinLength ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                        <span className={hasMinLength ? "text-green-700" : "text-muted-foreground"}>Minst 8 tecken</span>
                      </div>
                      <div className="flex items-center">
                        {hasUpperCase ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                        <span className={hasUpperCase ? "text-green-700" : "text-muted-foreground"}>Stor bokstav (A-Z)</span>
                      </div>
                      <div className="flex items-center">
                        {hasLowerCase ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                        <span className={hasLowerCase ? "text-green-700" : "text-muted-foreground"}>Liten bokstav (a-z)</span>
                      </div>
                      <div className="flex items-center">
                        {hasNumber ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                        <span className={hasNumber ? "text-green-700" : "text-muted-foreground"}>Minst en siffra</span>
                      </div>
                      <div className="flex items-center">
                        {hasSpecialChar ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
                        <span className={hasSpecialChar ? "text-green-700" : "text-muted-foreground"}>Specialtecken</span>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bekräfta lösenord</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Bekräfta lösenord" {...field} />
                  </FormControl>
                  <FormDescription>
                    Kontrollera att lösenorden matchar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sparar...
                  </>
                ) : (
                  "Uppdatera lösenord"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
