
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveSalonData } from "@/utils/salon/salonDataUtils";
import { formatDealData, type RawDealData } from "@/utils/deal/dealDataUtils";
import { handleDealError } from "@/utils/deal/dealErrorHandler";
import { toast } from "sonner";

// Define a type for database deal data that includes requires_discount_code
type DatabaseDealData = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  time_remaining: string;
  expiration_date: string;
  category: string;
  city: string;
  created_at: string;
  updated_at: string;
  quantity_left: number;
  salon_id: number;
  is_free: boolean;
  booking_url: string;
  requires_discount_code?: boolean;
}

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

        // Cast the database response to our DatabaseDealData type
        const typedDealData = dealData as DatabaseDealData;

        console.log("[useDeal] Erbjudandedata från DB:", {
          id: typedDealData.id,
          title: typedDealData.title,
          salon_id: typedDealData.salon_id,
          city: typedDealData.city,
          requires_discount_code: typedDealData.requires_discount_code
        });
        
        // Hantera salongsdata, med förbättrad felhantering för 404-fel
        try {
          // Försök hämta salongsdata men hantera det explicit om den saknas
          console.log("[useDeal] Försöker hämta salongsdata för ID:", typedDealData.salon_id);
          const salonData = await resolveSalonData(typedDealData.salon_id, typedDealData.city);
          console.log("[useDeal] Salongsdata resultat:", salonData);
          
          // Cast dealData to RawDealData type to ensure type safety
          const rawDealData: RawDealData = {
            id: typedDealData.id,
            title: typedDealData.title,
            description: typedDealData.description,
            image_url: typedDealData.image_url,
            original_price: typedDealData.original_price,
            discounted_price: typedDealData.discounted_price,
            time_remaining: typedDealData.time_remaining,
            expiration_date: typedDealData.expiration_date,
            category: typedDealData.category,
            city: typedDealData.city,
            created_at: typedDealData.created_at,
            updated_at: typedDealData.updated_at,
            quantity_left: typedDealData.quantity_left,
            salon_id: typedDealData.salon_id,
            is_free: typedDealData.is_free,
            booking_url: typedDealData.booking_url,
            // Provide a default value if requires_discount_code is undefined
            requires_discount_code: typedDealData.requires_discount_code
          };
          
          // Formatera och returnera komplett erbjudandedata
          return formatDealData(rawDealData, salonData);
        } catch (salonError) {
          console.error("[useDeal] Fel vid hämtning av salongsdata:", salonError);
          console.log("[useDeal] Fortsätter med erbjudandet utan salongsdetaljer");
          
          // Skapa ett placeholder salon-objekt baserat på tillgänglig information
          const fallbackSalon = {
            id: typedDealData.salon_id,
            name: typedDealData.city ? `Salong i ${typedDealData.city}` : 'Okänd salong',
            address: typedDealData.city || null,
            phone: null
          };
          
          // Cast dealData to RawDealData type to ensure type safety
          const rawDealData: RawDealData = {
            id: typedDealData.id,
            title: typedDealData.title,
            description: typedDealData.description,
            image_url: typedDealData.image_url,
            original_price: typedDealData.original_price,
            discounted_price: typedDealData.discounted_price,
            time_remaining: typedDealData.time_remaining,
            expiration_date: typedDealData.expiration_date,
            category: typedDealData.category,
            city: typedDealData.city,
            created_at: typedDealData.created_at,
            updated_at: typedDealData.updated_at,
            quantity_left: typedDealData.quantity_left,
            salon_id: typedDealData.salon_id,
            is_free: typedDealData.is_free,
            booking_url: typedDealData.booking_url,
            // Provide a default value if requires_discount_code is undefined
            requires_discount_code: typedDealData.requires_discount_code
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
