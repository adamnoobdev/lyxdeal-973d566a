
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

/**
 * Skapar ett nytt erbjudande för en salong
 */
export const createDeal = async (
  values: FormValues, 
  salonId: string | undefined, 
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>, 
  isCreatingDeal: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<boolean> => {
  if (!salonId || isCreatingDeal.current || !isMountedRef.current) {
    console.error("Cannot create deal: No salon ID, already creating, or component unmounted");
    return false;
  }
  
  try {
    console.log("[dealOperations] Creating deal with salon ID:", salonId);
    isCreatingDeal.current = true;
    
    // Konvertera salonId till nummer
    const salonIdNumber = parseInt(salonId);
    if (isNaN(salonIdNumber)) {
      throw new Error("Ogiltigt salong-ID");
    }
    
    // Kontrollera salongens prenumerationsplan för rabattkoder
    const { data: salonData, error: salonError } = await supabase
      .from("salons")
      .select("subscription_plan, status")
      .eq("id", salonIdNumber)
      .single();
      
    if (salonError) {
      console.error("Fel vid hämtning av salongsinformation:", salonError);
      toast.error("Kunde inte hämta salongsinformation");
      return false;
    }
    
    if (salonData?.status !== 'active') {
      toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
      return false;
    }
    
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    console.log("Salong prenumerationsplan:", salonData?.subscription_plan, "isBasicPlan:", isBasicPlan);
    
    // Kontrollera antal aktiva erbjudanden för denna salong
    const { data: activeDeals, error: countError } = await supabase
      .from("deals")
      .select("id", { count: "exact" })
      .eq("salon_id", salonIdNumber)
      .eq("is_active", true)
      .not("status", "eq", "rejected");
      
    if (countError) {
      console.error("Fel vid räkning av aktiva erbjudanden:", countError);
      toast.error("Kunde inte kontrollera antal aktiva erbjudanden");
      return false;
    }
    
    const activeDealsCount = activeDeals?.length || 0;
    const maxDealsAllowed = isBasicPlan ? 1 : 3;
    
    if (activeDealsCount >= maxDealsAllowed) {
      toast.error(`Du har redan nått maxgränsen på ${maxDealsAllowed} aktiva erbjudanden för din prenumerationsnivå.`);
      return false;
    }
    
    // Tvinga direkt bokning för basic-paketet
    let requiresDiscountCode = values.requires_discount_code ?? false;
    if (isBasicPlan) {
      console.log("Basic plan detected. Forcing direct booking.");
      requiresDiscountCode = false;
    }
    
    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPriceVal = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPriceVal === 0;
    const quantity = requiresDiscountCode ? parseInt(values.quantity) || 10 : 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    const discountedPrice = isFree ? 1 : discountedPriceVal;
    
    // Kontrollera att bokningslänk finns för direkt bokning
    if (!requiresDiscountCode && !values.booking_url) {
      toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder.");
      return false;
    }
    
    // Calculate days remaining and time remaining text
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    console.log('Creating deal with values:', {
      ...values,
      originalPrice,
      discountedPrice,
      isFree,
      salonId: salonIdNumber,
      requiresDiscountCode,
      expirationDate: expirationDate.toISOString()
    });
    
    // Skapa det nya erbjudandet
    const { data: newDeal, error } = await supabase
      .from("deals")
      .insert([{
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        category: values.category,
        city: values.city,
        time_remaining: timeRemaining,
        expiration_date: expirationDate.toISOString(),
        featured: values.featured,
        salon_id: salonIdNumber, // Använd den konverterade salonId
        status: 'pending',
        is_free: isFree,
        quantity_left: quantity,
        booking_url: values.booking_url || null,
        requires_discount_code: requiresDiscountCode,
        is_active: values.is_active !== undefined ? values.is_active : true
      }])
      .select();

    if (error) {
      console.error('Database error details:', error);
      toast.error(`Ett fel uppstod när erbjudandet skulle skapas: ${error.message}`);
      return false;
    }
    
    if (newDeal && newDeal.length > 0) {
      console.log("Deal created successfully with ID:", newDeal[0].id);
      
      // Om vi behöver generera rabattkoder
      if (requiresDiscountCode && quantity > 0) {
        // Kod för att generera rabattkoder skulle vara här
        console.log(`Skulle generera ${quantity} rabattkoder för erbjudande ${newDeal[0].id}`);
      }
      
      toast.success("Erbjudandet har skapats! Det kommer att granskas innan publicering.");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error creating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    return false;
  } finally {
    if (isMountedRef.current) {
      isCreatingDeal.current = false;
    }
  }
};
