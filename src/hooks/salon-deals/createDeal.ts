
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
    
    // CRITICAL: Check salon's subscription plan regardless of how it was created
    console.log("[createDeal hook] Checking subscription plan for subscription plan & discount code usage");
    
    // Check salon's subscription plan
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan')
      .eq('id', values.salon_id)
      .single();
      
    if (salonError) {
      console.error("[createDeal hook] Error fetching salon:", salonError);
      return false;
    }
    
    console.log("[createDeal hook] Salon subscription plan:", salonData?.subscription_plan);
    
    // IMPORTANT: Enforce basic plan restrictions regardless of UI state or creation method
    // This is critical for admin-created salons or salons created via payment solution
    const isBasicPlan = !salonData.subscription_plan || salonData.subscription_plan === 'Baspaket'; 
    if (isBasicPlan) {
      // Force requires_discount_code to false for basic plan
      values.requires_discount_code = false;
      console.log("[createDeal hook] Basic plan detected, forcing discount code to false");
    }
    
    // Double-check after any potential changes to the values
    if (values.requires_discount_code === true && isBasicPlan) {
      console.error("[createDeal hook] Basic plan trying to use discount codes");
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // Validate booking URL for direct booking
    if (!values.requires_discount_code && !values.booking_url) {
      console.error("[createDeal hook] Missing booking URL for direct booking");
      toast.error("När du inte använder rabattkoder måste du ange en bokningslänk för direkt bokning.");
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
    
    // Final safety check before DB insert
    if (isBasicPlan && dealData.requires_discount_code === true) {
      console.error("[createDeal hook] CRITICAL ERROR: Basic plan attempting to create deal with discount codes");
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // Insert deal
    console.log("[createDeal hook] Inserting deal:", dealData);
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select('id')
      .single();
      
    if (error) {
      console.error("[createDeal hook] Insert error:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas: " + error.message);
      return false;
    }
    
    console.log("[createDeal hook] Deal created successfully with id:", data?.id);
    toast.success("Erbjudandet har skapats!");
    return true;
  } catch (error) {
    console.error("[createDeal hook] Unexpected error:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  }
};
