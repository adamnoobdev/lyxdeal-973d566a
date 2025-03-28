
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

const checkSalonHasDeals = async (id: number) => {
  const { data, error } = await supabase
    .from("deals")
    .select("id")
    .eq("salon_id", id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
};

const deleteSalonData = async (id: number) => {
  const { error } = await supabase
    .from("salons")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

const createSalonData = async (values: any) => {
  try {
    // Rensa upp och hantera adressfält innan de skickas
    const { street, postalCode, city, ...otherValues } = values;
    
    // Kombinera adressfälten till fullständig adress om de finns
    if (street || postalCode || city) {
      let fullAddress = '';
      if (street) fullAddress += street;
      if (postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += postalCode;
      }
      if (city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += city;
      }
      
      values = {
        ...otherValues,
        address: fullAddress || undefined
      };
    }
    
    console.log("Creating salon with values:", values);
    const { data, error } = await supabase.functions.invoke("create-salon-account", {
      body: {
        ...values,
        skipSubscription: values.skipSubscription || false
      },
    });

    if (error) {
      console.error("Error from edge function:", error);
      throw error;
    }
    
    if (data.error) {
      console.error("Error response from edge function:", data.error);
      throw new Error(data.error);
    }
    
    console.log("Response from edge function:", data);
    
    return data;
  } catch (error) {
    console.error("Error creating salon:", error);
    throw error;
  }
};

const updateSalonData = async (values: any, id: number) => {
  try {
    // Rensa upp och hantera adressfält innan de skickas
    const { street, postalCode, city, password, ...otherValues } = values;
    
    // Kombinera adressfälten till fullständig adress om de finns
    if (street || postalCode || city) {
      let fullAddress = '';
      if (street) fullAddress += street;
      if (postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += postalCode;
      }
      if (city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += city;
      }
      
      otherValues.address = fullAddress || undefined;
    }
    
    // If a new password is provided, update it via auth admin API
    if (password) {
      const { data: salon } = await supabase
        .from("salons")
        .select("user_id")
        .eq("id", id)
        .single();

      if (salon?.user_id) {
        const { error: passwordError } = await supabase.functions.invoke("update-salon-password", {
          body: { 
            userId: salon.user_id,
            newPassword: password
          }
        });

        if (passwordError) throw passwordError;
      }
    }

    const { error } = await supabase
      .from("salons")
      .update(otherValues)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating salon:", error);
    throw error;
  }
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
      const hasDeals = await checkSalonHasDeals(id);
      if (hasDeals) {
        toast.error("Kan inte ta bort salongen eftersom den har aktiva erbjudanden");
        return false;
      }

      await deleteSalonData(id);
      toast.success("Salongen har tagits bort");
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
      console.log("Handling create salon with values:", values);
      const response = await createSalonData(values);
      toast.success("Salongen har skapats");
      await fetchSalons();
      return response;
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
