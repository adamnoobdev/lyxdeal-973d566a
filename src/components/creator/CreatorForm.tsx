
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CITIES } from "@/constants/app-constants";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  phone: z.string().min(6, { message: "Telefonnummer måste vara minst 6 tecken." }),
  city: z.string().min(1, { message: "Vänligen välj din stad." }),
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
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
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError && !isAuthenticated) {
        // If no authenticated user, create an anonymous session for them
        toast.info("Du kommer att fortsätta som gäst. Logga in för att spåra din ansökan.");
      }
      
      // Store creator request in Supabase
      const { error } = await supabase
        .from('creator_applications')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            city: values.city,
            instagram_handle: values.instagram,
            follower_count: values.followerCount,
            message: values.message || null,
            terms_accepted: values.termsAccepted,
            privacy_accepted: values.privacyAccepted,
            user_id: userData?.user?.id || null // Include user_id if authenticated
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vilken stad är du baserad i?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj din stad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CITIES.filter(city => city !== "Alla Städer").map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Vi söker särskilt kreatörer i Stockholm, Göteborg och Malmö.
              </FormDescription>
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
        
        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            För att spåra din ansökan, vänligen <a href="/login" className="text-primary hover:underline">logga in</a> innan du skickar.
          </p>
        )}
      </form>
    </Form>
  );
};
