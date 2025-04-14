
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

export const updateDeal = async (values: FormValues, dealId: number): Promise<boolean> => {
  try {
    console.log("[updateDeal] Updating deal:", dealId, "with values:", values);
    
    const originalPrice = parseInt(values.originalPrice);
    let discountedPrice = parseInt(values.discountedPrice);

    // If is_free is true, set discountedPrice to 1 for database constraints
    // but maintain the is_free flag
    if (values.is_free) {
      discountedPrice = 1;
    }
    
    // Calculate time remaining
    const today = new Date();
    let expirationDate = values.expirationDate || new Date();
    if (typeof expirationDate === 'string') {
      expirationDate = new Date(expirationDate);
    }
    
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    // Prepare the update data
    const updateData: any = {
      title: values.title,
      description: values.description,
      original_price: originalPrice,
      discounted_price: discountedPrice,
      category: values.category,
      city: values.city,
      is_free: !!values.is_free,
      time_remaining: timeRemaining,
      expiration_date: expirationDate.toISOString(),
      is_active: values.is_active !== undefined ? values.is_active : true,
      featured: values.featured || false,
      requires_discount_code: values.requires_discount_code || false,
      booking_url: values.booking_url || null,
    };
    
    // Only update image URL if it's provided
    if (values.imageUrl) {
      updateData.image_url = values.imageUrl;
    }
    
    // Update status if provided
    if (values.status) {
      updateData.status = values.status;
    }
    
    const { error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', dealId);
      
    if (error) {
      console.error('[updateDeal] Error updating deal:', error);
      toast.error('Ett fel uppstod när erbjudandet skulle uppdateras.');
      return false;
    }
    
    toast.success('Erbjudandet har uppdaterats!');
    return true;
  } catch (error) {
    console.error('[updateDeal] Unexpected error:', error);
    toast.error('Ett fel uppstod när erbjudandet skulle uppdateras.');
    return false;
  }
};
