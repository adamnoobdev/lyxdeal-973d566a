
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";

export const useSalonDeals = (salonId: number | undefined) => {
  const { data: deals = [], refetch } = useQuery({
    queryKey: ['salon-deals', salonId],
    queryFn: async () => {
      if (!salonId) throw new Error("No salon ID available");

      const { data: deals, error } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            name
          )
        `)
        .eq('salon_id', salonId);

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      return deals as Deal[];
    },
    enabled: !!salonId,
  });

  const createDeal = async (values: FormValues) => {
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
      
      console.log('Creating salon deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free,
        expirationDate: expirationDate
      });
      
      const { error } = await supabase.from('deals').insert({
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
        salon_id: salonId,
        status: 'pending',
        is_free: values.is_free || false,
        quantity_left: parseInt(values.quantity) || 10,
      });

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      toast.success("Erbjudande skapat! Det kommer att granskas av en administratör innan det publiceras.");
      refetch();
      return true;
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas.");
      return false;
    }
  };

  const updateDeal = async (values: FormValues, dealId: number) => {
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
      
      console.log('Updating salon deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free,
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
          status: 'pending',
          is_free: values.is_free || false,
          quantity_left: parseInt(values.quantity) || 10,
        })
        .eq('id', dealId);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      toast.success("Erbjudande uppdaterat! Det kommer att granskas igen av en administratör.");
      refetch();
      return true;
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras.");
      return false;
    }
  };

  const deleteDeal = async (dealId: number) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;
      
      toast.success("Erbjudande borttaget!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
      return false;
    }
  };

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const approvedDeals = deals.filter(deal => deal.status === 'approved');
  const rejectedDeals = deals.filter(deal => deal.status === 'rejected');

  return {
    deals,
    pendingDeals,
    approvedDeals,
    rejectedDeals,
    createDeal,
    updateDeal,
    deleteDeal,
  };
};
