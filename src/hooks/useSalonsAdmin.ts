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

  const fetchSalons = async () => {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to fetch salons");
      console.error("Error:", error);
    } else {
      setSalons(data);
    }
    
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("salons")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Ett fel uppstod när salongen skulle tas bort");
      console.error("Error:", error);
      return false;
    }

    toast.success("Salongen har tagits bort");
    await fetchSalons();
    return true;
  };

  const handleCreate = async (values: UpdateSalonData) => {
    const { error } = await supabase
      .from("salons")
      .insert([values]);

    if (error) {
      toast.error("Ett fel uppstod när salongen skulle skapas");
      console.error("Error:", error);
      return false;
    }

    toast.success("Salongen har skapats");
    await fetchSalons();
    return true;
  };

  const handleUpdate = async (values: UpdateSalonData, id: number) => {
    const { error } = await supabase
      .from("salons")
      .update(values)
      .eq("id", id);

    if (error) {
      toast.error("Ett fel uppstod när salongen skulle uppdateras");
      console.error("Error:", error);
      return false;
    }

    toast.success("Salongen har uppdaterats");
    await fetchSalons();
    return true;
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