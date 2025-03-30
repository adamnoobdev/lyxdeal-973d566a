
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeal = (id: string | undefined) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error("No deal ID provided");
        }
        
        const dealId = parseInt(id);
        if (isNaN(dealId)) {
          throw new Error("Invalid deal ID");
        }

        console.log("Fetching deal with ID:", dealId);

        // Fetch the deal data first
        const { data: dealData, error: dealError } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .single();

        if (dealError) {
          console.error("Error fetching deal:", dealError);
          throw dealError;
        }
        
        if (!dealData) {
          throw new Error("Deal not found");
        }

        console.log("Raw deal data from DB:", dealData);
        console.log("Deal salon_id value:", dealData.salon_id, "Type:", typeof dealData.salon_id);

        // Initialize salon data with default values
        let salonData = {
          id: dealData.salon_id || null,
          name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
          address: dealData.city || null,
          phone: null
        };

        // Only attempt to fetch salon data if we have a salon_id
        if (dealData.salon_id) {
          console.log(`Attempting to fetch salon data for salon_id: ${dealData.salon_id}`);
          
          // First try with the exact salon_id
          const { data: exactSalon, error: exactError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", dealData.salon_id)
            .maybeSingle();
            
          if (exactSalon) {
            console.log("Salon data successfully retrieved with exact ID:", exactSalon);
            salonData = exactSalon;
          } else {
            console.log("No salon found with exact ID match, trying alternative approaches");
            
            // Get all salons to see what's available
            const { data: allSalons, error: allError } = await supabase
              .from("salons")
              .select("id, name");
              
            if (allError) {
              console.error("Error fetching all salons:", allError);
            } else {
              console.log("All available salons:", allSalons);
              
              // Check if any salon has an ID close to what we're looking for
              const numericId = typeof dealData.salon_id === 'string' 
                ? parseInt(dealData.salon_id) 
                : dealData.salon_id;
              
              // Try to find a salon with a similar ID
              const similarSalon = allSalons?.find(s => 
                s.id === numericId || 
                s.id === dealData.salon_id || 
                String(s.id) === String(dealData.salon_id)
              );
              
              if (similarSalon) {
                console.log("Found a salon with similar ID:", similarSalon);
                
                // Fetch the full salon data
                const { data: fullSalonData } = await supabase
                  .from("salons")
                  .select("id, name, address, phone")
                  .eq("id", similarSalon.id)
                  .single();
                  
                if (fullSalonData) {
                  console.log("Retrieved full salon data:", fullSalonData);
                  salonData = fullSalonData;
                }
              } else {
                // If we still haven't found a salon, use the first one as a fallback
                if (allSalons && allSalons.length > 0) {
                  console.log("Using first available salon as fallback");
                  
                  const { data: fallbackSalon } = await supabase
                    .from("salons")
                    .select("id, name, address, phone")
                    .eq("id", allSalons[0].id)
                    .single();
                    
                  if (fallbackSalon) {
                    salonData = fallbackSalon;
                    console.log("Using fallback salon:", fallbackSalon);
                  }
                } else {
                  console.log("No salons found in the database, using default data");
                }
              }
            }
          }
        } else {
          console.log("No salon_id provided in deal data, using default salon data");
        }
        
        // Calculate days remaining
        const calculateDaysRemaining = () => {
          if (!dealData.expiration_date) {
            // If no expiration date, parse days from time_remaining or default to 30
            if (dealData.time_remaining && dealData.time_remaining.includes("dag")) {
              const daysText = dealData.time_remaining.split(" ")[0];
              return parseInt(daysText) || 30;
            }
            return 30;
          }
          
          const expirationDate = new Date(dealData.expiration_date);
          const now = new Date();
          
          // Set both dates to midnight to avoid time differences
          expirationDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
          
          const diffTime = expirationDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays > 0 ? diffDays : 0;
        };

        const daysRemaining = calculateDaysRemaining();

        // Determine if the deal is free
        const isFree = dealData.is_free || dealData.discounted_price === 0;

        return {
          id: dealData.id,
          title: dealData.title,
          description: dealData.description,
          imageUrl: dealData.image_url,
          originalPrice: dealData.original_price,
          discountedPrice: dealData.discounted_price,
          daysRemaining,
          expirationDate: dealData.expiration_date || new Date().toISOString(),
          category: dealData.category,
          city: dealData.city,
          created_at: dealData.created_at,
          quantityLeft: dealData.quantity_left,
          isFree: isFree,
          salon: salonData,
          booking_url: dealData.booking_url,
        };
      } catch (error) {
        console.error("Error in useDeal hook:", error);
        if (error instanceof Error) {
          toast.error(error.message === 'No deal ID provided' ? "Inget erbjudande-ID angivet" :
                    error.message === 'Invalid deal ID' ? "Ogiltigt erbjudande-ID" : 
                    "Erbjudandet kunde inte hittas");
        } else {
          toast.error("Ett oväntat fel uppstod");
        }
        throw error;
      }
    },
    staleTime: 0, // Reduce cache time to ensure fresh data
    refetchOnWindowFocus: true, // Update when window gets focus
  });
};
