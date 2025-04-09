
import { supabase } from '@/integrations/supabase/client';
import { FormValues } from '@/components/deal-form/schema';
import { toast } from 'sonner';

export const createDeal = async (values: FormValues): Promise<boolean> => {
  try {
    console.log("[createDeal] Called with values:", values);
    
    // Validate required fields
    if (!values.salon_id) {
      console.error("[createDeal] Missing salon_id");
      toast.error("Kunde inte identifiera salongen");
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
    
    if (!values.title) {
      console.error("[createDeal] Missing title");
      toast.error("Titel är obligatoriskt");
      return false;
    }
    
    // Check subscription plan regardless of requires_discount_code value
    // This ensures we validate even if the frontend didn't prevent selection
    console.log("[createDeal] Checking subscription plan");
    
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan')
      .eq('id', values.salon_id)
      .single();
      
    if (salonError) {
      console.error("[createDeal] Error fetching salon:", salonError);
      toast.error("Kunde inte hämta information om din prenumerationsplan");
      return false;
    }
    
    // If basic plan, force requires_discount_code to false
    // This is critical to handle cases where the salon was created by an admin
    const isBasicPlan = salonData.subscription_plan === 'Baspaket';
    if (isBasicPlan) {
      console.log("[createDeal] Basic plan detected, forcing discount code to false");
      values.requires_discount_code = false;
    }
    
    // Double check after enforcing the plan restriction
    if (values.requires_discount_code === true && isBasicPlan) {
      console.error("[createDeal] Basic plan trying to use discount codes");
      toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för att få tillgång till rabattkoder.");
      return false;
    }
    
    // Validate booking URL for direct booking
    if (!values.requires_discount_code && !values.booking_url) {
      console.error("[createDeal] Missing booking URL for direct booking");
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
    
    // Insert deal
    console.log("[createDeal] Inserting deal:", dealData);
    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select('id')
      .single();
      
    if (error) {
      console.error("[createDeal] Insert error:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas: " + error.message);
      return false;
    }
    
    console.log("[createDeal] Deal created successfully with id:", data?.id);
    toast.success("Erbjudandet har skapats!");
    return true;
  } catch (error) {
    console.error("[createDeal] Unexpected error:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  }
};
