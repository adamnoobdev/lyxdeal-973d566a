
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";

export const createDeal = async (values: FormValues, salonId: number | undefined): Promise<boolean> => {
  try {
    console.log("[createDeal] Starting deal creation with values:", values);
    console.log("[createDeal] Provided salon ID:", salonId);
    
    // Validate salon ID
    if (!salonId && !values.salon_id) {
      console.error("[createDeal] No salon ID available");
      toast.error("Kunde inte identifiera salongen.");
      return false;
    }
    
    // Use either provided salon ID or the one from values
    const finalSalonId = salonId || values.salon_id;
    console.log("[createDeal] Using salon ID:", finalSalonId);

    // Check salon subscription plan and status
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('subscription_plan, status')
      .eq('id', finalSalonId)
      .single();
    
    if (salonError) {
      console.error("[createDeal] Error fetching salon data:", salonError);
      toast.error("Kunde inte hämta salonginformation.");
      return false;
    }
    
    // Verify subscription is active
    if (salonData?.status !== 'active') {
      console.error("[createDeal] Salon status is not active:", salonData?.status);
      toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
      return false;
    }
    
    const isBasicPlan = salonData?.subscription_plan === 'Baspaket';
    console.log("[createDeal] Salon subscription plan:", salonData?.subscription_plan, "isBasicPlan:", isBasicPlan);
    
    // Check number of active deals for this salon
    const { data: activeDeals, error: countError } = await supabase
      .from('deals')
      .select('id', { count: 'exact' })
      .eq('salon_id', finalSalonId)
      .eq('is_active', true)
      .not('status', 'eq', 'rejected');
    
    if (countError) {
      console.error('[createDeal] Error counting active deals:', countError);
      toast.error("Kunde inte kontrollera antal aktiva erbjudanden.");
      return false;
    }
    
    const activeDealsCount = activeDeals?.length || 0;
    const maxDealsAllowed = isBasicPlan ? 1 : 3;
    
    console.log('[createDeal] Active deals count:', activeDealsCount, 'Max allowed:', maxDealsAllowed);
    
    if (activeDealsCount >= maxDealsAllowed) {
      console.error('[createDeal] Deal limit reached:', activeDealsCount, 'of', maxDealsAllowed);
      toast.error(`Du har redan nått maxgränsen på ${maxDealsAllowed} aktiva erbjudanden för din prenumerationsnivå.`);
      return false;
    }
    
    // Force direct booking for basic plan
    let requiresDiscountCode = values.requires_discount_code ?? false;
    if (isBasicPlan) {
      console.log("[createDeal] Basic plan detected. Forcing direct booking.");
      requiresDiscountCode = false;
    }

    // Validate and prepare data for database
    const originalPrice = parseInt(values.originalPrice) || 0;
    const discountedPriceVal = parseInt(values.discountedPrice) || 0;
    const isFree = discountedPriceVal === 0;
    const quantity = requiresDiscountCode ? parseInt(values.quantity) || 10 : 0;
    
    // For free deals, set discounted_price to 1 to avoid database constraint
    const discountedPrice = isFree ? 1 : discountedPriceVal;
    
    // Check that booking URL is provided for direct booking
    if (!requiresDiscountCode && !values.booking_url) {
      console.error("[createDeal] Missing booking URL for direct booking");
      toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder.");
      return false;
    }
    
    // Calculate days remaining and time remaining text
    const today = new Date();
    const expirationDate = values.expirationDate;
    const daysRemaining = differenceInDays(expirationDate, today);
    const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
    
    // Log the final deal data structure
    console.log('[createDeal] Creating salon deal with values:', {
      ...values,
      originalPrice,
      discountedPrice,
      is_free: isFree,
      expirationDate: expirationDate,
      quantity,
      requiresDiscountCode,
      salonPlan: salonData?.subscription_plan
    });
    
    // Create deal in database
    const dealData = {
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
      salon_id: finalSalonId,
      status: 'approved', // Auto-approve salon created deals
      is_free: isFree, // Set is_free flag for free deals
      quantity_left: quantity,
      booking_url: values.booking_url || null,
      requires_discount_code: requiresDiscountCode,
      is_active: values.is_active !== undefined ? values.is_active : true,
    };
    
    console.log('[createDeal] Final deal data structure:', dealData);
    
    // Insert deal record
    const { data: newDeal, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select();

    if (error) {
      console.error('[createDeal] Database error details:', error);
      toast.error(`Ett fel uppstod när erbjudandet skulle skapas: ${error.message}`);
      return false;
    }
    
    // If the offer requires discount codes, generate them automatically
    if (newDeal && newDeal.length > 0 && requiresDiscountCode) {
      const dealId = newDeal[0].id;
      console.log(`[createDeal] Automatically generating ${quantity} discount codes for new salon deal ID: ${dealId}`);
      
      try {
        // Generate discount codes in the background
        setTimeout(async () => {
          try {
            await generateDiscountCodes(dealId, quantity);
            console.log(`[createDeal] Successfully generated ${quantity} discount codes for salon deal ID: ${dealId}`);
          } catch (genError) {
            console.error(`[createDeal] Error generating discount codes for salon deal ID: ${dealId}:`, genError);
          }
        }, 500);
      } catch (genError) {
        console.error('[createDeal] Error starting discount code generation:', genError);
        // Continue without blocking since the offer was successfully created
      }
    }
    
    toast.success("Erbjudande skapat! Det visas nu på sidan.");
    return true;
  } catch (error) {
    console.error("[createDeal] Error creating deal:", error);
    toast.error("Ett fel uppstod när erbjudandet skulle skapas. Kontrollera din internetanslutning och försök igen.");
    return false;
  }
};
