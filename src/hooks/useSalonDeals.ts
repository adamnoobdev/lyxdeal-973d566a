
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";
import { differenceInDays } from "date-fns";
import { generateDiscountCodes } from "@/utils/discount-codes";

export const useSalonDeals = (salonId: number | undefined) => {
  const { data: deals = [], refetch } = useQuery({
    queryKey: ['salon-deals', salonId],
    queryFn: async () => {
      if (!salonId) throw new Error("No salon ID available");

      const { data: deals, error } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            name
          )
        `)
        .eq('salon_id', salonId);

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      // Transform the data to include required properties and add default values
      const transformedDeals = deals.map(deal => ({
        ...deal,
        is_free: deal.is_free || deal.discounted_price === 0, // Ensure is_free is set correctly
        expiration_date: deal.expiration_date || new Date().toISOString()
      }));

      // Add type assertion to make TypeScript happy
      return transformedDeals as unknown as Deal[];
    },
    enabled: !!salonId,
  });

  const createDeal = async (values: FormValues) => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      const discountedPriceVal = parseInt(values.discountedPrice) || 0;
      const isFree = discountedPriceVal === 0;
      const quantity = parseInt(values.quantity) || 10;
      
      // For free deals, set discounted_price to 1 to avoid database constraint
      const discountedPrice = isFree ? 1 : discountedPriceVal;
      
      // Calculate days remaining and time remaining text
      const today = new Date();
      const expirationDate = values.expirationDate;
      const daysRemaining = differenceInDays(expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Creating salon deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: isFree,
        expirationDate: expirationDate,
        quantity
      });
      
      const { data: newDeal, error } = await supabase.from('deals').insert({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: originalPrice,
        discounted_price: discountedPrice, // Set to 1 for free deals
        category: values.category,
        city: values.city,
        time_remaining: timeRemaining,
        expiration_date: expirationDate.toISOString(),
        featured: values.featured,
        salon_id: salonId,
        status: 'pending',
        is_free: isFree, // Set is_free flag for free deals
        quantity_left: quantity,
      }).select();

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      // Om erbjudandet skapades, generera rabattkoder automatiskt
      if (newDeal && newDeal.length > 0) {
        const dealId = newDeal[0].id;
        console.log(`Automatically generating ${quantity} discount codes for new salon deal ID: ${dealId}`);
        
        try {
          // Generera rabattkoder i bakgrunden
          setTimeout(async () => {
            try {
              await generateDiscountCodes(dealId, quantity);
              console.log(`Successfully generated ${quantity} discount codes for salon deal ID: ${dealId}`);
            } catch (genError) {
              console.error(`Error generating discount codes for salon deal ID: ${dealId}:`, genError);
            }
          }, 500);
        } catch (genError) {
          console.error('Error starting discount code generation:', genError);
          // Fortsätt utan att blockera eftersom erbjudandet skapades korrekt
        }
      }
      
      toast.success("Erbjudande skapat! Det kommer att granskas av en administratör innan det publiceras.");
      refetch();
      return true;
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas.");
      return false;
    }
  };

  const updateDeal = async (values: FormValues, dealId: number) => {
    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      const discountedPriceVal = parseInt(values.discountedPrice) || 0;
      const isFree = discountedPriceVal === 0;
      
      // For free deals, set discounted_price to 1 to avoid database constraint
      const discountedPrice = isFree ? 1 : discountedPriceVal;
      
      // Calculate days remaining and time remaining text
      const today = new Date();
      const expirationDate = values.expirationDate;
      const daysRemaining = differenceInDays(expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Updating salon deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: isFree,
        expirationDate: expirationDate
      });
      
      const { error } = await supabase
        .from('deals')
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: discountedPrice, // Set to 1 for free deals
          category: values.category,
          city: values.city,
          time_remaining: timeRemaining,
          expiration_date: expirationDate.toISOString(),
          featured: values.featured,
          status: 'pending',
          is_free: isFree, // Set is_free flag for free deals
          quantity_left: parseInt(values.quantity) || 10,
        })
        .eq('id', dealId);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }
      
      toast.success("Erbjudande uppdaterat! Det kommer att granskas igen av en administratör.");
      refetch();
      return true;
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras.");
      return false;
    }
  };

  const deleteDeal = async (dealId: number) => {
    try {
      // Först tar vi bort alla rabattkoder kopplade till erbjudandet
      console.log(`Removing discount codes for deal ID: ${dealId}`);
      const { error: discountCodesError } = await supabase
        .from('discount_codes')
        .delete()
        .eq('deal_id', dealId);
        
      if (discountCodesError) {
        console.error('Error deleting discount codes:', discountCodesError);
        // Continue with deal deletion even if code deletion fails
      }
      
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;
      
      toast.success("Erbjudande borttaget!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
      return false;
    }
  };

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const approvedDeals = deals.filter(deal => deal.status === 'approved');
  const rejectedDeals = deals.filter(deal => deal.status === 'rejected');

  return {
    deals,
    pendingDeals,
    approvedDeals,
    rejectedDeals,
    createDeal,
    updateDeal,
    deleteDeal,
  };
};
