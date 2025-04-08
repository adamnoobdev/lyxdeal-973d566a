
import { supabase } from '@/integrations/supabase/client';
import { FormValues } from '@/components/deal-form/schema';
import { toast } from 'sonner';

export const createDeal = async (values: FormValues): Promise<boolean> => {
  try {
    console.log("[createDeal hook] Called with values:", values);
    
    // Validate required fields
    if (!values.salon_id) {
      console.error("[createDeal hook] Missing salon_id");
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
      time_remaining: ''
    };
    
    // Insert deal
    console.log("[createDeal hook] Inserting deal:", dealData);
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select('id')
      .single();
      
    if (error) {
      console.error("[createDeal hook] Insert error:", error);
      return false;
    }
    
    console.log("[createDeal hook] Deal created successfully with id:", data?.id);
    return true;
  } catch (error) {
    console.error("[createDeal hook] Unexpected error:", error);
    return false;
  }
};
