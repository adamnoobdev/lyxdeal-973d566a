import { supabase } from "@/integrations/supabase/client";

export const checkAdminRole = async (userId: string) => {
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError) {
    console.error("Role check error:", roleError);
    throw new Error("Kunde inte verifiera admin-behörighet");
  }

  if (!roleData) {
    throw new Error("Du har inte behörighet att hantera erbjudanden");
  }

  return roleData;
};

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