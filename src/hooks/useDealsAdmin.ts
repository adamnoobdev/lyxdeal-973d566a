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
          salon_id: values.salon_id,
        })
        .eq('id', id);

      if (error) throw error;
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
      const { error } = await supabase
        .from('deals')
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
          salon_id: values.salon_id,
          status: 'pending'
        }]);

      if (error) throw error;
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