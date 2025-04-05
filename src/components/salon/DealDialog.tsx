
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormFields } from '@/components/deal-form/FormFields';
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema as schema, FormValues } from '@/components/deal-form/schema';
import { useSubscriptionData } from './subscription/useSubscriptionData';
import { PriceFields } from '@/components/deal-form/PriceFields';
import { LocationFields } from '@/components/deal-form/LocationFields';
import { QuantityField } from '@/components/deal-form/QuantityField';
import { BookingUrlField } from '@/components/deal-form/BookingUrlField';
import { AdditionalFields } from '@/components/deal-form/AdditionalFields';
import { RequiresDiscountCodeField } from '@/components/deal-form/RequiresDiscountCodeField';

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  initialValues?: Partial<FormValues>;
}

export const DealDialog: React.FC<DealDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = {}
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subscriptionInfo } = useSubscriptionData();
  const isBasicPlan = subscriptionInfo?.plan_title === 'Baspaket';
  
  const defaultValues: Partial<FormValues> = {
    title: '',
    description: '',
    originalPrice: '0',
    discountedPrice: '0',
    category: '',
    city: '',
    featured: false,
    imageUrl: '',
    booking_url: '',
    requires_discount_code: !isBasicPlan, // Default based on plan
    quantity: '10',
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    ...initialValues
  };

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  // Update the form when initial values change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      Object.entries(initialValues).forEach(([key, value]) => {
        methods.setValue(key as keyof FormValues, value as any);
      });
    }
  }, [initialValues, methods]);
  
  // Update requires_discount_code based on subscription when it loads
  useEffect(() => {
    if (subscriptionInfo && !initialValues.requires_discount_code) {
      methods.setValue('requires_discount_code', !isBasicPlan);
    }
  }, [subscriptionInfo, isBasicPlan, methods, initialValues]);

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Apply subscription-based restrictions
      if (isBasicPlan) {
        data.requires_discount_code = false;
      }
      
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Erbjudande</DialogTitle>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
            {subscriptionInfo && isBasicPlan && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                <p className="text-sm text-blue-700">
                  <strong>OBS:</strong> Med Baspaket kan du endast använda direkt bokning, inte rabattkoder.
                </p>
              </div>
            )}
            
            <FormFields 
              form={methods}
              handleImageSelected={(imageUrl) => methods.setValue('imageUrl', imageUrl)}
              initialImageUrl={initialValues?.imageUrl}
              forceDirectBooking={isBasicPlan}
            />
            
            <PriceFields form={methods} />
            
            <LocationFields form={methods} />
            
            <RequiresDiscountCodeField 
              form={methods} 
              readOnly={isBasicPlan}
            />
            
            <BookingUrlField form={methods} />
            
            <QuantityField 
              form={methods} 
              readOnly={isBasicPlan || (initialValues && 'id' in initialValues)}
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
                {isSubmitting ? "Sparar..." : (initialValues && 'id' in initialValues ? "Uppdatera" : "Skapa")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
