
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveSalonData } from "@/utils/salon/salonDataUtils";
import { formatDealData, type RawDealData } from "@/utils/deal/dealDataUtils";
import { handleDealError } from "@/utils/deal/dealErrorHandler";
import { toast } from "sonner";

export const useDeal = (id: string | undefined) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      try {
        if (!id) {
          console.error("[useDeal] Inget erbjudande-ID tillhandahållet");
          throw new Error("Inget erbjudande-ID tillhandahållet");
        }
        
        const dealId = parseInt(id);
        if (isNaN(dealId)) {
          console.error("[useDeal] Ogiltigt erbjudande-ID:", id);
          throw new Error("Ogiltigt erbjudande-ID");
        }

        console.log("[useDeal] Hämtar erbjudande med ID:", dealId);

        // Hämta erbjudandedata med förbättrad felhantering
        const { data: dealData, error: dealError, status } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .single();
        
        console.log("[useDeal] Erbjudandeförfrågans status:", status);

        if (dealError) {
          console.error("[useDeal] Fel vid hämtning av erbjudande:", dealError);
          throw dealError;
        }
        
        if (!dealData) {
          console.error("[useDeal] Erbjudande hittades inte med ID:", dealId);
          throw new Error("Erbjudande hittades inte");
        }

        console.log("[useDeal] Erbjudandedata från DB:", {
          id: dealData.id,
          title: dealData.title,
          salon_id: dealData.salon_id,
          city: dealData.city,
          requires_discount_code: dealData.requires_discount_code
        });
        
        // Hantera salongsdata, med förbättrad felhantering för 404-fel
        try {
          // Försök hämta salongsdata men hantera det explicit om den saknas
          console.log("[useDeal] Försöker hämta salongsdata för ID:", dealData.salon_id);
          const salonData = await resolveSalonData(dealData.salon_id, dealData.city);
          console.log("[useDeal] Salongsdata resultat:", salonData);
          
          // Cast dealData to RawDealData type to ensure type safety
          const rawDealData: RawDealData = {
            id: dealData.id,
            title: dealData.title,
            description: dealData.description,
            image_url: dealData.image_url,
            original_price: dealData.original_price,
            discounted_price: dealData.discounted_price,
            time_remaining: dealData.time_remaining,
            expiration_date: dealData.expiration_date,
            category: dealData.category,
            city: dealData.city,
            created_at: dealData.created_at,
            updated_at: dealData.updated_at,
            quantity_left: dealData.quantity_left,
            salon_id: dealData.salon_id,
            is_free: dealData.is_free,
            booking_url: dealData.booking_url,
            // Provide a default value if requires_discount_code is undefined
            requires_discount_code: dealData.requires_discount_code !== false
          };
          
          // Formatera och returnera komplett erbjudandedata
          return formatDealData(rawDealData, salonData);
        } catch (salonError) {
          console.error("[useDeal] Fel vid hämtning av salongsdata:", salonError);
          console.log("[useDeal] Fortsätter med erbjudandet utan salongsdetaljer");
          
          // Skapa ett placeholder salon-objekt baserat på tillgänglig information
          const fallbackSalon = {
            id: dealData.salon_id,
            name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
            address: dealData.city || null,
            phone: null
          };
          
          // Cast dealData to RawDealData type to ensure type safety
          const rawDealData: RawDealData = {
            id: dealData.id,
            title: dealData.title,
            description: dealData.description,
            image_url: dealData.image_url,
            original_price: dealData.original_price,
            discounted_price: dealData.discounted_price,
            time_remaining: dealData.time_remaining,
            expiration_date: dealData.expiration_date,
            category: dealData.category,
            city: dealData.city,
            created_at: dealData.created_at,
            updated_at: dealData.updated_at,
            quantity_left: dealData.quantity_left,
            salon_id: dealData.salon_id,
            is_free: dealData.is_free,
            booking_url: dealData.booking_url,
            // Provide a default value if requires_discount_code is undefined
            requires_discount_code: dealData.requires_discount_code !== false
          };
          
          console.log("[useDeal] Använder fallback-salongsdata:", fallbackSalon);
          return formatDealData(rawDealData, fallbackSalon);
        }
      } catch (error) {
        // Om error är ett 404-fel, hantera det särskilt
        if (error instanceof Error && error.message.includes("404")) {
          console.error("[useDeal] 404-fel vid hämtning av data:", error);
          toast.error("Kunde inte hitta resursen");
        } else {
          handleDealError(error);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minut caching
    refetchOnWindowFocus: true, 
    refetchOnMount: 'always',
    retry: 2, // Minska antalet försök för att undvika onödiga förfrågningar
  });
};
