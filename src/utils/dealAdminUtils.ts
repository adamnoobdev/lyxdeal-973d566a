
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

// Function to create a new deal in admin panel
export const createDealAdmin = async (values: any) => {
  try {
    const originalPrice = parseInt(values.originalPrice) || 0;
    
    // Calculate days remaining
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    // Skapa erbjudandet med discounted_price = 1 för att undvika begränsningar
    const { data, error } = await supabase
      .from("deals")
      .insert({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: 1, // Använder 1 för att undvika DB-begränsningar
        category: values.category,
        city: values.city,
        featured: values.featured,
        salon_id: values.salon_id,
        is_free: true, // Alla erbjudanden är gratis
        status: 'approved',
        time_remaining: timeRemaining,
        quantity_left: parseInt(values.quantity) || 10,
        expiration_date: expirationDate.toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  }
};

// Function to update an existing deal in admin panel
export const updateDealAdmin = async (values: any, dealId: number) => {
  try {
    const originalPrice = parseInt(values.originalPrice) || 0;
    
    // Calculate days remaining
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    // Först uppdatera grundläggande information
    const { error: basicError } = await supabase
      .from("deals")
      .update({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        category: values.category,
        city: values.city,
        featured: values.featured,
        salon_id: values.salon_id,
        time_remaining: timeRemaining,
        quantity_left: parseInt(values.quantity) || 10,
        expiration_date: expirationDate.toISOString(),
      })
      .eq("id", dealId);

    if (basicError) throw basicError;
    
    // Använd RPC för att sätta is_free och discounted_price på rätt sätt
    const { error: freeError } = await supabase
      .rpc('update_deal_to_free', { 
        deal_id: dealId,
        deal_status: 'approved' 
      });
      
    if (freeError) throw freeError;
    
    return true;
  } catch (error) {
    console.error("Error updating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    return false;
  }
};

// Function to delete a deal
export const deleteDealAdmin = async (dealId: number) => {
  try {
    const { error } = await supabase
      .from("deals")
      .delete()
      .eq("id", dealId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    return false;
  }
};
