
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { FormValues } from "@/components/deal-form/schema";
import { useCallback } from "react";

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

  // Använd useCallback för att förhindra onödiga re-renders
  const handleDelete = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Erbjudandet har tagits bort");
      refetch();
      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
      return false;
    }
  }, [refetch]);

  const handleUpdate = useCallback(async (values: FormValues, id: number) => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      
      // Calculate days remaining and time remaining text
      const today = new Date();
      const expirationDate = values.expirationDate;
      const daysRemaining = differenceInDays(expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Updating deal with values:', {
        ...values,
        originalPrice,
        expirationDate: expirationDate
      });
      
      // Först uppdatera grundläggande information och andra fält än pris via normal uppdatering
      const { error: basicUpdateError } = await supabase
        .from('deals')
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          category: values.category,
          city: values.city,
          time_remaining: timeRemaining,
          expiration_date: expirationDate.toISOString(),
          featured: values.featured,
          salon_id: values.salon_id,
          is_active: values.is_active,
          quantity_left: parseInt(values.quantity) || 10,
        })
        .eq('id', id);

      if (basicUpdateError) {
        console.error('Database error during basic update:', basicUpdateError);
        throw basicUpdateError;
      }
      
      // Sedan använd RPC-funktionen för att uppdatera erbjudandets frihetsstatus
      // Detta hjälper oss att kringgå eventuella begränsningar i databasen
      const { error: freeUpdateError } = await supabase
        .rpc('update_deal_to_free', { 
          deal_id: id,
          deal_status: 'approved' 
        });

      if (freeUpdateError) {
        console.error('Error updating deal to free:', freeUpdateError);
        throw freeUpdateError;
      }
      
      toast.success("Erbjudandet har uppdaterats");
      await refetch();
      return true;
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    }
  }, [refetch]);

  const handleCreate = useCallback(async (values: FormValues) => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      
      // Calculate days remaining and time remaining text
      const today = new Date();
      const expirationDate = values.expirationDate;
      const daysRemaining = differenceInDays(expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Creating deal with values:', {
        ...values,
        originalPrice,
        expirationDate: expirationDate
      });
      
      // Skapa ett nytt erbjudande med discounted_price = 1 för att undvika begränsningar
      const { error, data } = await supabase
        .from('deals')
        .insert([{
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: 1, // Set to 1 to avoid constraints
          category: values.category,
          city: values.city,
          time_remaining: timeRemaining,
          expiration_date: expirationDate.toISOString(),
          featured: values.featured,
          salon_id: values.salon_id,
          status: 'approved', // Direktgodkänd
          is_free: true, // All deals are free now
          is_active: values.is_active !== undefined ? values.is_active : true,
          quantity_left: parseInt(values.quantity) || 10,
        }])
        .select();

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      toast.success("Erbjudandet har skapats");
      await refetch();
      return true;
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
      return false;
    }
  }, [refetch]);

  const handleToggleActive = useCallback(async (deal: Deal) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ is_active: !deal.is_active })
        .eq('id', deal.id);

      if (error) throw error;
      
      toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktiverat' : 'inaktiverat'}`);
      await refetch();
      return true;
    } catch (error) {
      console.error('Error toggling deal active status:', error);
      toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
      return false;
    }
  }, [refetch]);

  // Filtrera erbjudanden efter aktiva/inaktiva
  const activeDeals = deals.filter(deal => deal.is_active);
  const inactiveDeals = deals.filter(deal => !deal.is_active);

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
