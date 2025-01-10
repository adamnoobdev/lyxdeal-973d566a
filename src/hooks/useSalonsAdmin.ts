import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Salon } from "@/components/admin/types";
import { toast } from "sonner";

type UpdateSalonData = {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export const useSalonsAdmin = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    return !!roles;
  };

  const fetchSalons = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isAdmin = await checkAdminAccess();
      if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }

      const { data, error: fetchError } = await supabase
        .from("salons")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setSalons(data || []);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch salons";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const isAdmin = await checkAdminAccess();
      if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }

      const { error: deleteError } = await supabase
        .from("salons")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      toast.success("Salongen har tagits bort");
      await fetchSalons();
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Ett fel uppstod när salongen skulle tas bort";
      toast.error(errorMessage);
      console.error("Error:", err);
      return false;
    }
  };

  const handleCreate = async (values: UpdateSalonData) => {
    try {
      const isAdmin = await checkAdminAccess();
      if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }

      const { error: createError } = await supabase
        .from("salons")
        .insert([values]);

      if (createError) throw createError;

      toast.success("Salongen har skapats");
      await fetchSalons();
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Ett fel uppstod när salongen skulle skapas";
      toast.error(errorMessage);
      console.error("Error:", err);
      return false;
    }
  };

  const handleUpdate = async (values: UpdateSalonData, id: number) => {
    try {
      const isAdmin = await checkAdminAccess();
      if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }

      const { error: updateError } = await supabase
        .from("salons")
        .update(values)
        .eq("id", id);

      if (updateError) throw updateError;

      toast.success("Salongen har uppdaterats");
      await fetchSalons();
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Ett fel uppstod när salongen skulle uppdateras";
      toast.error(errorMessage);
      console.error("Error:", err);
      return false;
    }
  };

  return {
    salons,
    isLoading,
    error,
    fetchSalons,
    handleDelete,
    handleCreate,
    handleUpdate,
  };
};