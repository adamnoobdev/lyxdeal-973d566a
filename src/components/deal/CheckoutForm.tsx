
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutFormProps {
  dealId: number;
  onSuccess: (code: string) => void;
  onCancel: () => void;
  isFree?: boolean;
}

export const CheckoutForm = ({ dealId, onSuccess, onCancel, isFree = false }: CheckoutFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Vänligen fyll i namn och e-post");
      return;
    }

    try {
      setIsSubmitting(true);

      // För gratis erbjudanden hanterar vi allt direkt här
      if (isFree) {
        // Hämta en ledig rabattkod för det här erbjudandet
        const { data: codeData, error: codeError } = await supabase
          .from('discount_codes')
          .select('*')
          .eq('deal_id', dealId)
          .is('customer_email', null)
          .limit(1)
          .single();

        if (codeError || !codeData) {
          throw new Error("Kunde inte hitta en ledig rabattkod");
        }

        // Uppdatera rabattkoden med kundinformation
        const { error: updateError } = await supabase
          .from('discount_codes')
          .update({
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone || null
          })
          .eq('id', codeData.id);

        if (updateError) {
          throw updateError;
        }

        // Minska antalet tillgängliga erbjudanden
        await supabase.rpc('decrease_quantity', {
          price_id: 'free_deal'
        });

        toast.success("Du har säkrat erbjudandet! En rabattkod har skickats till din e-post.");
        onSuccess(codeData.code);
      } else {
        // För betalda erbjudanden, anropa vårt Stripe checkout API
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            dealId,
            customerInfo: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone || ''
            }
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Något gick fel vid betalning");
        }

        const data = await response.json();
        
        // Om det är gratis, hanterar servern det och returnerar koden direkt
        if (data.free && data.code) {
          toast.success("Du har säkrat erbjudandet! En rabattkod har skickats till din e-post.");
          onSuccess(data.code);
        } else if (data.url) {
          // Annars, omdirigera till Stripe checkout
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Något gick fel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-2">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {isFree ? "Säkra gratis erbjudande" : "Fyll i dina uppgifter"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isFree 
            ? "Fyll i dina uppgifter för att få din rabattkod direkt." 
            : "Fyll i dina uppgifter för att gå vidare till betalning."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Namn *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ditt namn"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-post *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Din e-post"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Ditt telefonnummer"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
          <Button 
            type="button" 
            onClick={onCancel}
            variant="outline" 
            className="w-full"
          >
            Avbryt
          </Button>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Bearbetar..." : isFree ? "Säkra erbjudande" : "Gå till betalning"}
          </Button>
        </div>
      </form>
    </div>
  );
};
