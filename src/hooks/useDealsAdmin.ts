import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { toast } from "sonner";

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

  const handleDelete = async (id: number) => {
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
  };

  const handleUpdate = async (values: any, id: number) => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      const discountedPrice = values.is_free ? 0 : parseInt(values.discountedPrice) || 0;
      
      console.log('Updating deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free
      });
      
      const { error } = await supabase
        .from('deals')
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: discountedPrice,
          category: values.category,
          city: values.city,
          time_remaining: values.timeRemaining,
          featured: values.featured,
          salon_id: values.salon_id,
          is_free: values.is_free || false,
          quantity_left: parseInt(values.quantity) || 10,
        })
        .eq('id', id);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      toast.success("Erbjudandet har uppdaterats");
      refetch();
      return true;
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      const discountedPrice = values.is_free ? 0 : parseInt(values.discountedPrice) || 0;
      
      console.log('Creating deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free
      });
      
      const { error } = await supabase
        .from('deals')
        .insert([{
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: discountedPrice,
          category: values.category,
          city: values.city,
          time_remaining: values.timeRemaining,
          featured: values.featured,
          salon_id: values.salon_id,
          status: 'pending',
          is_free: values.is_free || false,
          quantity_left: parseInt(values.quantity) || 10,
        }]);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      toast.success("Erbjudandet har skapats");
      refetch();
      return true;
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
      return false;
    }
  };

  return {
    deals,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
    handleCreate,
    refetch
  };
};
