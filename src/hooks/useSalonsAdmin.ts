import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Salon } from "@/components/admin/types";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";

const fetchSalonsData = async () => {
  try {
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching salons:", error);
    throw error;
  }
};

const deleteSalonData = async (id: number) => {
  // First delete all deals associated with the salon
  const { error: dealsError } = await supabase
    .from("deals")
    .delete()
    .eq("salon_id", id);

  if (dealsError) throw dealsError;

  // Then delete the salon
  const { error } = await supabase
    .from("salons")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

const createSalonData = async (values: any) => {
  const { data, error } = await supabase
    .from("salons")
    .insert([values])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateSalonData = async (values: any, id: number) => {
  const { error } = await supabase
    .from("salons")
    .update(values)
    .eq("id", id);

  if (error) throw error;
};

export const useSalonsAdmin = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);
  const { session, isLoading: sessionLoading } = useSession();

  const fetchSalons = useCallback(async () => {
    if (sessionLoading) return;
    
    if (!session?.user) {
      setError("Du måste vara inloggad för att se salonger");
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchSalonsData();
      setSalons(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod vid hämtning av salonger";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, sessionLoading]);

  const handleDelete = async (id: number) => {
    try {
      await deleteSalonData(id);
      toast.success("Salongen och tillhörande erbjudanden har tagits bort");
      await fetchSalons();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte ta bort salongen";
      toast.error(errorMessage);
      return false;
    }
  };

  const handleCreate = async (values: any) => {
    try {
      await createSalonData(values);
      toast.success("Salongen har skapats");
      await fetchSalons();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte skapa salongen";
      toast.error(errorMessage);
      return false;
    }
  };

  const handleUpdate = async (values: any, id: number) => {
    try {
      await updateSalonData(values, id);
      toast.success("Salongen har uppdaterats");
      await fetchSalons();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte uppdatera salongen";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    salons,
    isLoading: isLoading || sessionLoading,
    error,
    fetchSalons,
    handleDelete,
    handleCreate,
    handleUpdate,
  };
};