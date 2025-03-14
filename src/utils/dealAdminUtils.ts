
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { createDeal, updateDeal, deleteDeal } from "./dealsCrudUtils";

// Reexportera CRUD-funktioner för att bevara bakåtkompatibilitet
export { createDeal as createDealAdmin, updateDeal as updateDealAdmin, deleteDeal as deleteDealAdmin };

// Övriga admin-funktioner kan läggas till här vid behov

// Function to create a new deal in admin panel (historiskt behållen för bakåtkompatibilitet)
export const createDealAdminLegacy = async (values: any) => {
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
