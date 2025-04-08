
import React from 'react';
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { FormFields } from '@/components/deal-form/FormFields';
import { PriceFields } from '@/components/deal-form/PriceFields';
import { LocationFields } from '@/components/deal-form/LocationFields';
import { RequiresDiscountCodeField } from '@/components/deal-form/RequiresDiscountCodeField';
import { BookingUrlField } from '@/components/deal-form/BookingUrlField';
import { QuantityField } from '@/components/deal-form/QuantityField';
import { AdditionalFields } from '@/components/deal-form/AdditionalFields';
import { useDealDialogForm } from './useDealDialogForm';
import { FormValues } from '@/components/deal-form/schema';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DealDialogContentProps {
  isEditing: boolean;
  initialValues?: Partial<FormValues>;
  isSubmitting: boolean;
  isBasicPlan: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  onClose: () => void;
}

export const DealDialogContent: React.FC<DealDialogContentProps> = ({
  isEditing,
  initialValues = {},
  isSubmitting,
  isBasicPlan,
  onSubmit,
  onClose
}) => {
  const methods = useDealDialogForm(initialValues, isBasicPlan);
  const discountCodeFieldReadOnly = isBasicPlan || (isEditing && initialValues?.requires_discount_code === true);
  
  const handleSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    try {
      console.log("[DealDialogContent] Form submitted with data:", data);
      
      // Apply subscription-based restrictions - force direct booking for basic plan
      if (isBasicPlan) {
        console.log("[DealDialogContent] Setting requires_discount_code to false for basic plan");
        data.requires_discount_code = false;
      }
      
      // Validate booking URL for direct booking
      if (!data.requires_discount_code && !data.booking_url) {
        methods.setError("booking_url", { 
          message: "En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder"
        });
        return;
      }
      
      // Ensure salon_id is included
      if (!data.salon_id) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user?.id) {
            const { data: salonData } = await supabase
              .from('salons')
              .select('id')
              .eq('user_id', sessionData.session.user.id)
              .single();
              
            if (salonData?.id) {
              data.salon_id = salonData.id;
              console.log("[DealDialogContent] Set salon_id to:", salonData.id);
            }
          }
        } catch (error) {
          console.error("[DealDialogContent] Error fetching salon ID:", error);
        }
      }
      
      console.log("[DealDialogContent] Submitting form data:", data);
      await onSubmit(data);
    } catch (error) {
      console.error("[DealDialogContent] Error submitting deal:", error);
    }
  };

  return (
    <>
      <DialogHeader className="mb-4">
        <DialogTitle>
          {isEditing ? "Redigera erbjudande" : "Skapa erbjudande"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="max-h-[calc(80vh-10rem)] overflow-y-auto pr-2 -mr-2">
        <FormProvider {...methods}>
          <form id="deal-form" onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
            {isBasicPlan && (
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Baspaket</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Med Baspaket kan du endast använda direkt bokning, inte rabattkoder.
                  Uppgradera till ett premium-paket för att få tillgång till rabattkoder.
                </AlertDescription>
              </Alert>
            )}
            
            <FormFields 
              form={methods}
              handleImageSelected={(imageUrl) => methods.setValue('imageUrl', imageUrl)}
              initialImageUrl={initialValues?.imageUrl}
            />
            
            <PriceFields form={methods} />
            
            <LocationFields form={methods} />
            
            <RequiresDiscountCodeField 
              form={methods} 
              readOnly={discountCodeFieldReadOnly}
            />
            
            <BookingUrlField form={methods} />
            
            <QuantityField 
              form={methods} 
              readOnly={isEditing && initialValues?.requires_discount_code === true}
            />
            
            <AdditionalFields form={methods} />
          </form>
        </FormProvider>
      </div>
      
      <DialogFooter className="mt-6 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Avbryt
        </Button>
        <Button 
          type="submit" 
          form="deal-form"
          disabled={isSubmitting}
          onClick={methods.handleSubmit(handleSubmit)}
          className="ml-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Uppdaterar..." : "Skapar..."}
            </>
          ) : (
            isEditing ? "Uppdatera" : "Skapa"
          )}
        </Button>
      </DialogFooter>
    </>
  );
};
