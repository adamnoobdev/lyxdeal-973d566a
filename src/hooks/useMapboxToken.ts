
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMapboxToken = () => {
  const query = useQuery({
    queryKey: ["mapbox-token"],
    queryFn: async () => {
      try {
        console.log("Fetching Mapbox token from Edge Function");
        
        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        
        if (error) {
          console.error("Error fetching Mapbox token:", error);
          throw new Error(`Failed to fetch Mapbox token: ${error.message}`);
        }
        
        if (!data || !data.token) {
          console.error("No Mapbox token returned from Edge Function");
          throw new Error("No Mapbox token found");
        }
        
        console.log("Successfully retrieved Mapbox token");
        return data.token as string;
      } catch (err) {
        console.error("Unexpected error in useMapboxToken:", err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });

  return {
    mapboxToken: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
};
