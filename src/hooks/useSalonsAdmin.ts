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

  try {
    const response = await fetch("/api/create-salon-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Ett fel uppstod när salongen skulle skapas");
    }

    toast.success(
      `Salong skapad! Temporärt lösenord: ${data.temporaryPassword}`,
      {
        duration: 10000,
      }
    );

    return data.salon;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
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
  const [error, setError] = useState<Error | string | null>(null);

  const fetchSalons = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchSalonsData();
      setSalons(data || []);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err : String(err);
      setError(errorMessage);
      toast.error(errorMessage instanceof Error ? errorMessage.message : errorMessage);
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(errorMessage);
      console.error("Error:", err);
      return false;
    }
  };

  const handleCreate = async (values: UpdateSalonData) => {
    try {
      await createSalonData(values);
      await fetchSalons();
      return true;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
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
      const errorMessage = err instanceof Error ? err.message : String(err);
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