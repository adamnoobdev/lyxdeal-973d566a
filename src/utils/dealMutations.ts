import { supabase } from "@/integrations/supabase/client";

export const deleteDeal = async (id: number) => {
  const { error } = await supabase
    .from("deals")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  return true;
};

export const updateDeal = async (values: any, id: number) => {
  const { error } = await supabase
    .from("deals")
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
      salon_id: values.salon_id,
    })
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const createDeal = async (values: any, salon_id: number) => {
  const { error } = await supabase
    .from("deals")
    .insert([{
      title: values.title,
      description: values.description,
      image_url: values.imageUrl,
      original_price: parseInt(values.originalPrice),
      discounted_price: parseInt(values.discountedPrice),
      category: values.category,
      city: values.city,
      time_remaining: values.timeRemaining,
      featured: values.featured,
      salon_id: salon_id,
    }]);

  if (error) throw error;
  return true;
};