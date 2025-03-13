
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { FormValues } from "@/components/deal-form/schema";

export const useDealsAdmin = () => {
  const { data: deals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deal[];
    }
  });

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetch();
      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      return false;
    }
  };

  const handleUpdate = async (values: FormValues, id: number): Promise<boolean> => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      
      // Always set discounted_price to at least 1 to satisfy database constraint
      // Even for free deals, we'll use the is_free flag to determine display logic
      const discountedPrice = values.is_free ? 1 : (parseInt(values.discountedPrice) || 1);
      
      // Calculate days remaining and time remaining text
      const today = new Date();
      const expirationDate = values.expirationDate;
      const daysRemaining = differenceInDays(expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Updating deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free,
        is_active: values.is_active,
        expirationDate: expirationDate
      });
      
      const { error } = await supabase
        .from('deals')
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: discountedPrice, // Always minimum 1
          category: values.category,
          city: values.city,
          time_remaining: timeRemaining,
          expiration_date: expirationDate.toISOString(),
          featured: values.featured,
          salon_id: values.salon_id,
          is_free: values.is_free || false,
          is_active: values.is_active,
          quantity_left: parseInt(values.quantity) || 10,
        })
        .eq('id', id);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      refetch();
      return true;
    } catch (error) {
      console.error('Error updating deal:', error);
      return false;
    }
  };

  const handleCreate = async (values: FormValues): Promise<boolean> => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      
      // Always set discounted_price to at least 1 to satisfy database constraint
      // Even for free deals, we'll use the is_free flag to determine display logic
      const discountedPrice = values.is_free ? 1 : (parseInt(values.discountedPrice) || 1);
      
      // Calculate days remaining and time remaining text
      const today = new Date();
      const expirationDate = values.expirationDate;
      const daysRemaining = differenceInDays(expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Creating deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free,
        is_active: values.is_active !== undefined ? values.is_active : true,
        expirationDate: expirationDate
      });
      
      const { error } = await supabase
        .from('deals')
        .insert([{
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: discountedPrice, // Always minimum 1
          category: values.category,
          city: values.city,
          time_remaining: timeRemaining,
          expiration_date: expirationDate.toISOString(),
          featured: values.featured,
          salon_id: values.salon_id,
          status: 'pending',
          is_free: values.is_free || false,
          is_active: values.is_active !== undefined ? values.is_active : true,
          quantity_left: parseInt(values.quantity) || 10,
        }]);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      refetch();
      return true;
    } catch (error) {
      console.error('Error creating deal:', error);
      return false;
    }
  };

  const handleToggleActive = async (deal: Deal): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ is_active: !deal.is_active })
        .eq('id', deal.id);

      if (error) throw error;
      
      refetch();
      return true;
    } catch (error) {
      console.error('Error toggling deal active status:', error);
      toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
      return false;
    }
  };

  // Filtrera erbjudanden efter aktiva/inaktiva
  const activeDeals = deals.filter(deal => deal.is_active && deal.status === 'approved');
  const inactiveDeals = deals.filter(deal => !deal.is_active && deal.status === 'approved');

  return {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
    handleCreate,
    handleToggleActive,
    refetch
  };
};
