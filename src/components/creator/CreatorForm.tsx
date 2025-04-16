
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  phone: z.string().min(6, { message: "Telefonnummer måste vara minst 6 tecken." }),
  instagram: z.string().min(2, { message: "Instagram-användarnamn måste vara minst 2 tecken." }),
  followerCount: z.string().min(1, { message: "Ange ungefärligt antal följare." }),
  message: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste acceptera våra allmänna villkor"
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste acceptera vår integritetspolicy"
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const CreatorForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      instagram: "",
      followerCount: "",
      message: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Store creator request in Supabase
      const { error } = await supabase
        .from('creator_applications')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            instagram_handle: values.instagram,
            follower_count: values.followerCount,
            message: values.message || null,
            terms_accepted: values.termsAccepted,
            privacy_accepted: values.privacyAccepted
          }
        ]);

      if (error) {
        throw new Error(error.message);
      }
      
      // Show success message
      toast.success("Tack för din ansökan! Vi återkommer inom 48 timmar.");
      
      // Redirect back to creator page
      setTimeout(() => {
        navigate('/creator');
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting creator application:", error);
      toast.error("Ett fel uppstod när din ansökan skulle skickas. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Namn</FormLabel>
              <FormControl>
                <Input placeholder="Anna Andersson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-postadress</FormLabel>
              <FormControl>
                <Input type="email" placeholder="anna@exempel.se" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefonnummer</FormLabel>
              <FormControl>
                <Input placeholder="07X XXX XX XX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram-användarnamn</FormLabel>
              <FormControl>
                <Input placeholder="@annasstyle" {...field} />
              </FormControl>
              <FormDescription>
                Utan @ om du inte vill ha med det.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="followerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ungefärligt antal följare</FormLabel>
              <FormControl>
                <Input placeholder="2000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meddelande (frivilligt)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Berätta lite mer om din profil och varför du vill bli kreatör hos Lyxdeal..."
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Jag accepterar <a href="/terms" className="text-primary hover:underline" target="_blank">allmänna villkor</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="privacyAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Jag accepterar <a href="/privacy" className="text-primary hover:underline" target="_blank">integritetspolicyn</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Skickar..." : "Skicka ansökan"}
        </Button>
      </form>
    </Form>
  );
};
