import { supabase } from "@/integrations/supabase/client";

export const fetchDeals = async () => {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Deals fetch error:", error);
    throw error;
  }

  return data.map((deal) => ({
    id: deal.id,
    title: deal.title,
    description: deal.description,
    originalPrice: deal.original_price,
    discountedPrice: deal.discounted_price,
    category: deal.category,
    city: deal.city,
    timeRemaining: deal.time_remaining,
    imageUrl: deal.image_url,
    featured: deal.featured,
    created_at: deal.created_at,
    updated_at: deal.updated_at
  }));
};