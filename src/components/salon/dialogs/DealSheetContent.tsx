
import React from 'react';
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button';

interface DealSheetContentProps {
  isEditing: boolean;
  initialValues?: Partial<FormValues>;
  isSubmitting: boolean;
  isBasicPlan: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  onClose: () => void;
}

export const DealSheetContent: React.FC<DealSheetContentProps> = ({
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
      // Apply subscription-based restrictions - force direct booking for basic plan
      if (isBasicPlan) {
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
              console.log("Retrieved salon_id:", salonData.id);
            }
          }
        } catch (error) {
          console.error("Error fetching salon ID:", error);
        }
      }
      
      console.log("Submitting form data from sheet:", data);
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting deal from sheet:", error);
    }
  };

  return (
    <>
      <SheetHeader className="mb-4">
        <SheetTitle>
          {isEditing ? "Redigera erbjudande" : "Skapa erbjudande"}
        </SheetTitle>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto pb-20">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
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
            
            <div className="fixed bottom-0 left-0 right-0 flex flex-col-reverse sm:flex-row justify-end gap-2 p-4 bg-background border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Avbryt
              </Button>
              <LoadingButton 
                type="submit" 
                loading={isSubmitting}
                onClick={methods.handleSubmit(handleSubmit)}
                className="w-full sm:w-auto mb-2 sm:mb-0"
              >
                {isEditing ? "Uppdatera" : "Skapa"}
              </LoadingButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};
