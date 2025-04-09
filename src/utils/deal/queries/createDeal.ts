
import { supabase } from '@/integrations/supabase/client';
import { FormValues } from '@/components/deal-form/schema';
import { toast } from 'sonner';

export const createDeal = async (values: FormValues): Promise<boolean> => {
  try {
    console.log("[createDeal] Called with values:", values);
    
    // Validate required fields
    if (!values.salon_id) {
      console.error("[createDeal] Missing salon_id");
      return false;
    }
    
    // Ensure required fields are present
    if (!values.category) {
      console.error("[createDeal] Missing category");
      toast.error("Kategori är obligatoriskt");
      return false;
    }
    
    if (!values.city) {
      console.error("[createDeal] Missing city");
      toast.error("Stad är obligatoriskt");
      return false;
    }
    
    if (!values.description) {
      console.error("[createDeal] Missing description");
      toast.error("Beskrivning är obligatoriskt");
      return false;
    }
    
    // Basic plan cannot use discount codes
    if (values.requires_discount_code === true) {
      console.log("[createDeal] Checking subscription plan for discount code usage");
      
      // Check salon's subscription plan
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('subscription_plan')
        .eq('id', values.salon_id)
        .single();
        
      if (salonError) {
        console.error("[createDeal] Error fetching salon:", salonError);
        return false;
      }
      
      if (salonData.subscription_plan === 'Baspaket') {
        console.error("[createDeal] Basic plan trying to use discount codes");
        toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
        return false;
      }
    }
    
    // Validate booking URL for direct booking
    if (!values.requires_discount_code && !values.booking_url) {
      console.error("[createDeal] Missing booking URL for direct booking");
      toast.error("När du inte använder rabattkoder måste du ange en bokningslänk för direkt bokning.");
      return false;
    }
    
    // Prepare data for insertion
    const { expirationDate, ...rest } = values;
    const dealData = {
      ...rest,
      expiration_date: expirationDate,
      original_price: parseFloat(values.originalPrice),
      discounted_price: parseFloat(values.discountedPrice),
      image_url: values.imageUrl,
      is_active: true,
      quantity_left: parseInt(values.quantity || '10', 10),
      created_at: new Date().toISOString(),
      // Add time_remaining field as it's required by the database schema
      time_remaining: '',
      // Ensure these fields are explicitly set and not optional
      category: values.category,
      city: values.city,
      description: values.description
    };
    
    // Insert deal
    console.log("[createDeal] Inserting deal:", dealData);
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select('id')
      .single();
      
    if (error) {
      console.error("[createDeal] Insert error:", error);
      return false;
    }
    
    console.log("[createDeal] Deal created successfully with id:", data?.id);
    return true;
  } catch (error) {
    console.error("[createDeal] Unexpected error:", error);
    return false;
  }
};
