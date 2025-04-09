
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
    
    // Ensure required fields are present
    if (!values.category) {
      console.error("[createDeal hook] Missing category");
      return false;
    }
    
    if (!values.city) {
      console.error("[createDeal hook] Missing city");
      return false;
    }
    
    if (!values.description) {
      console.error("[createDeal hook] Missing description");
      return false;
    }
    
    if (!values.title) {
      console.error("[createDeal hook] Missing title");
      return false;
    }
    
    // Prepare data for insertion - VIKTIGT: Säkerställ att namnen matchar databasens kolumnnamn
    const { expirationDate, ...rest } = values;
    
    // Convert Date to ISO string for database
    const expirationDateString = expirationDate ? expirationDate.toISOString() : null;
    
    // Skapa korrekt mappat data för databasen (camelCase till snake_case)
    const dealData = {
      title: values.title,
      description: values.description,
      salon_id: values.salon_id,
      category: values.category,
      city: values.city,
      original_price: parseFloat(values.originalPrice),
      discounted_price: parseFloat(values.discountedPrice),
      image_url: values.imageUrl,
      booking_url: values.booking_url || '',
      requires_discount_code: values.requires_discount_code,
      is_active: values.is_active ?? true,
      is_free: values.is_free ?? false,
      featured: values.featured ?? false,
      expiration_date: expirationDateString,
      quantity_left: parseInt(values.quantity || '10', 10),
      created_at: new Date().toISOString(),
      // Add time_remaining field as it's required by the database schema
      time_remaining: '',
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
