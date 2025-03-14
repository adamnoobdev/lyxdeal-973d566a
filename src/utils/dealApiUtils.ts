
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";

export interface DealUpdateValues {
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  city: string;
  featured: boolean;
  is_free: boolean;
  quantity: number;
  expirationDate: Date;
  salon_id?: number;
  is_active?: boolean;
}

/**
 * Formats a number as Swedish currency (kr)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE').format(amount);
};

/**
 * Fetches deals for a salon by ID
 */
export const fetchSalonDeals = async (salonId: string | undefined): Promise<Deal[]> => {
  if (!salonId) {
    throw new Error("No salon ID provided");
  }

  const salonIdNumber = parseInt(salonId);
  if (isNaN(salonIdNumber)) {
    throw new Error("Invalid salon ID");
  }

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("salon_id", salonIdNumber)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Transform data to include required properties
  const typedDeals = (data || []).map(deal => {
    // Default expiration_date if not present
    const defaultExpirationDate = new Date().toISOString();
    
    return {
      ...deal,
      status: deal.status as 'pending' | 'approved' | 'rejected',
      is_free: deal.is_free || false,
      is_active: deal.is_active ?? true,
      expiration_date: deal.expiration_date || defaultExpirationDate
    };
  }) as Deal[];

  return typedDeals;
};

/**
 * Deletes a deal by ID
 */
export const deleteSalonDeal = async (dealId: number): Promise<void> => {
  const { error } = await supabase
    .from("deals")
    .delete()
    .eq("id", dealId);

  if (error) throw error;
};

/**
 * Updates a deal with new values
 */
export const updateSalonDeal = async (dealId: number, values: DealUpdateValues): Promise<void> => {
  const originalPrice = values.originalPrice || 0;
  const discountedPrice = values.discountedPrice || 0;
  
  const updateData: any = {
    title: values.title,
    description: values.description,
    image_url: values.imageUrl,
    original_price: originalPrice,
    discounted_price: discountedPrice,
    category: values.category,
    city: values.city,
    featured: values.featured,
    is_free: values.is_free || false,
    quantity_left: values.quantity || 10,
    status: 'pending',
    expiration_date: values.expirationDate.toISOString()
  };

  // Only add is_active field if it's explicitly provided
  if (values.is_active !== undefined) {
    updateData.is_active = values.is_active;
  }

  const { error } = await supabase
    .from("deals")
    .update(updateData)
    .eq("id", dealId);

  if (error) {
    console.error('Database error details:', error);
    throw error;
  }
};

/**
 * Toggles a deal's active status
 */
export const toggleDealActiveStatus = async (dealId: number, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from("deals")
    .update({ is_active: isActive })
    .eq("id", dealId);

  if (error) {
    console.error('Database error details:', error);
    throw error;
  }
};
