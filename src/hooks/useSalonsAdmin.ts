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

const fetchSalonsData = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Du måste vara inloggad för att hantera salonger");
  }

  const { data, error } = await supabase
    .from("salons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const deleteSalonData = async (id: number) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Du måste vara inloggad för att ta bort salonger");
  }

  const { error } = await supabase
    .from("salons")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

const createSalonData = async (values: UpdateSalonData) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Du måste vara inloggad för att skapa salonger");
  }

  const { error } = await supabase
    .from("salons")
    .insert([values]);

  if (error) throw error;
};

const updateSalonData = async (values: UpdateSalonData, id: number) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("Du måste vara inloggad för att uppdatera salonger");
  }

  const { error } = await supabase
    .from("salons")
    .update(values)
    .eq("id", id);

  if (error) throw error;
};

export const useSalonsAdmin = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalons = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchSalonsData();
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
      await deleteSalonData(id);
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
      await createSalonData(values);
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
      await updateSalonData(values, id);
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