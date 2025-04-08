
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
import { AlertCircle } from 'lucide-react';
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
      
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting deal:", error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Redigera erbjudande" : "Skapa erbjudande"}
        </DialogTitle>
      </DialogHeader>
      
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
          
          <DialogFooter>
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
              disabled={isSubmitting}
              className="ml-2"
            >
              {isSubmitting ? "Sparar..." : (isEditing ? "Uppdatera" : "Skapa")}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </>
  );
};
