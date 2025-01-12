import { supabase } from "@/integrations/supabase/client";
import { DealFormValues } from "@/types/deal-form";
import { toast } from "sonner";

export const fetchSalonIdForUser = async (userId: string) => {
  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return salon;
};

export const createDealInDb = async (values: DealFormValues, salonId: number) => {
  const { error } = await supabase
    .from('deals')
    .insert([{ ...values, salon_id: salonId }]);

  if (error) throw error;
  return true;
};

export const updateDealInDb = async (values: DealFormValues, dealId: number) => {
  const { error } = await supabase
    .from('deals')
    .update({
      title: values.title,
      description: values.description,
      image_url: values.imageUrl,
      original_price: parseInt(values.originalPrice),
      discounted_price: parseInt(values.discountedPrice),
      category: values.category,
      city: values.city,
      time_remaining: values.timeRemaining,
      featured: values.featured,
    })
    .eq('id', dealId);

  if (error) throw error;
  return true;
};

export const deleteDealFromDb = async (id: number) => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};