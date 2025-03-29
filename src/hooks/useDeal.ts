
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

        // Först, hämta erbjudandet med JOIN på salongs-tabellen
        let { data: dealData, error: dealError } = await supabase
          .from("deals")
          .select(`
            *,
            salon:salons(id, name, address, phone)
          `)
          .eq("id", dealId)
          .single();

        if (dealError) {
          console.error("Error fetching deal with JOIN:", dealError);
          
          // Fallback: försök hämta bara deal-datan om JOIN misslyckas
          const { data: fallbackDealData, error: fallbackError } = await supabase
            .from("deals")
            .select("*")
            .eq("id", dealId)
            .single();
            
          if (fallbackError) {
            console.error("Error fetching deal (fallback):", fallbackError);
            throw fallbackError;
          }
          
          if (!fallbackDealData) {
            throw new Error("Deal not found");
          }
          
          // Om deal-data hittades men salongen saknas, försök hämta salong separat om salon_id finns
          dealData = fallbackDealData;
          dealData.salon = null;
          
          if (dealData.salon_id) {
            console.log("Fetching salon separately with ID:", dealData.salon_id);
            
            const { data: salonData, error: salonError } = await supabase
              .from("salons")
              .select("id, name, address, phone")
              .eq("id", dealData.salon_id)
              .maybeSingle(); // Använd maybeSingle() istället för single() för att undvika fel
              
            if (!salonError && salonData) {
              dealData.salon = salonData;
              console.log("Salon data retrieved separately:", salonData);
            } else {
              console.log("Could not retrieve salon data separately:", salonError);
              // Fallback till att använda staden för salongsnamn
              dealData.salon = {
                id: dealData.salon_id,
                name: `Salong i ${dealData.city}`,
                address: dealData.city || null,
                phone: null,
              };
            }
          }
        }

        if (!dealData) {
          throw new Error("Deal not found");
        }

        console.log("Raw deal data from DB:", dealData);
        
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

        // Hantera salonginformation
        let salon = null;
        
        // Först, kontrollera om vi fick salongen från JOINen
        if (dealData.salon) {
          salon = dealData.salon;
          console.log("Salon data retrieved from join query:", salon);
        } 
        // Om vi redan har hämtat salong i fallback-scenariot ovan, använd den datan
        else if (dealData.salon_id) {
          // Vi bör redan ha hämtat salongsdata i fallback-fallet ovan
          if (!salon) {
            console.log("Using fallback salon data with city");
            salon = {
              id: dealData.salon_id,
              name: `Salong i ${dealData.city}`,
              address: dealData.city || null,
              phone: null,
            };
          }
        } else {
          // Fallback om vi inte har salon_id
          salon = {
            id: null,
            name: `Salong i ${dealData.city}`,
            address: dealData.city || null,
            phone: null,
          };
        }

        console.log("Final processed salon data:", salon);

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
          salon: salon,
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
    staleTime: 0, // Minska cache-tiden för att säkerställa färsk data
    refetchOnWindowFocus: true, // Uppdatera när fönstret får fokus
  });
};
