
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";

export const createStripeProductForDeal = async (values: FormValues) => {
  try {
    // Get the newly created deal's ID
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (dealsError) {
      console.error('Error fetching new deal:', dealsError);
      throw dealsError;
    }

    const dealId = deals?.[0]?.id;
    if (!dealId) {
      throw new Error('Could not find newly created deal');
    }

    // Create Stripe product and price
    const { error } = await supabase.functions.invoke('create-stripe-product', {
      body: {
        title: values.title,
        description: values.description,
        discountedPrice: parseInt(values.discountedPrice),
        dealId: dealId,
      },
    });

    if (error) {
      console.error('Error creating Stripe product:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in createStripeProductForDeal:', error);
    toast.error("Kunde inte skapa Stripe-produkt för erbjudandet.");
    throw error;
  }
};

// Future functions for salon subscription plans will be added here
