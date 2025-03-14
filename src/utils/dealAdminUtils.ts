
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, format } from "date-fns";
import { toast } from "sonner";

// Function to create a new deal in admin panel
export const createDealAdmin = async (values: any) => {
  try {
    const originalPrice = parseInt(values.originalPrice) || 0;
    // Always set discounted price to 0 for free deals, not 1
    const discountedPrice = values.is_free ? 0 : (parseInt(values.discountedPrice) || 0);
    
    // Calculate days remaining
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    const { error } = await supabase
      .from("deals")
      .insert({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        category: values.category,
        city: values.city,
        featured: values.featured,
        salon_id: values.salon_id,
        is_free: values.is_free,
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
    // Always set discounted price to 0 for free deals, not 1
    const discountedPrice = values.is_free ? 0 : (parseInt(values.discountedPrice) || 0);
    
    // Calculate days remaining
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    const { error } = await supabase
      .from("deals")
      .update({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        category: values.category,
        city: values.city,
        featured: values.featured,
        salon_id: values.salon_id,
        is_free: values.is_free,
        time_remaining: timeRemaining,
        quantity_left: parseInt(values.quantity) || 10,
        expiration_date: expirationDate.toISOString(),
      })
      .eq("id", dealId);

    if (error) throw error;
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
