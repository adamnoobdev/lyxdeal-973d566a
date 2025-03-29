
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
          
          // För TypeScript-kompatibilitet: se till att vi alltid har en salon-struktur
          // Denna del är kritisk för att uppfylla TypeScript-kraven
          const salonData = {
            id: fallbackDealData.salon_id || null,
            name: fallbackDealData.city ? `Salong i ${fallbackDealData.city}` : 'Okänd salong',
            address: fallbackDealData.city || null,
            phone: null
          };
          
          // Kombinera deal-data med vår salon-struktur
          dealData = { 
            ...fallbackDealData,
            salon: salonData // Explicit sätt salon-strukturen
          };
          
          // Försök hämta salongsdata om vi har salon_id
          if (fallbackDealData.salon_id) {
            console.log("Fetching salon separately with ID:", fallbackDealData.salon_id);
            
            const { data: fetchedSalonData, error: salonError } = await supabase
              .from("salons")
              .select("id, name, address, phone")
              .eq("id", fallbackDealData.salon_id)
              .maybeSingle();
              
            if (!salonError && fetchedSalonData) {
              // Uppdatera med korrekt salongsdata
              dealData.salon = fetchedSalonData;
              console.log("Salon data retrieved separately:", fetchedSalonData);
            } else {
              console.log("Could not retrieve salon data separately:", salonError);
              // Vi behåller den fallback salon-struktur vi skapade ovan
            }
          }
        } else if (!dealData) {
          throw new Error("Deal not found");
        } else if (dealData && !dealData.salon) {
          // Om vi får deal-data men ingen salon, skapa en standard salon-struktur
          // Detta är viktigt för att hålla TypeScript-typen konsekvent
          dealData.salon = {
            id: dealData.salon_id || null,
            name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
            address: dealData.city || null,
            phone: null
          };
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

        // Hantera salongsinformation - förenkla och garantera att salon alltid finns
        console.log("Final processed salon data:", dealData.salon);

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
          salon: dealData.salon, // Detta är nu garanterat att finnas och ha rätt struktur
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
