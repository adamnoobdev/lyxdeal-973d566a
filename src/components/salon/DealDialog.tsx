
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
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/components/deal-form/schema';
import { useSubscriptionData } from './subscription/useSubscriptionData';
import { PriceFields } from '@/components/deal-form/PriceFields';
import { LocationFields } from '@/components/deal-form/LocationFields';
import { QuantityField } from '@/components/deal-form/QuantityField';
import { BookingUrlField } from '@/components/deal-form/BookingUrlField';
import { AdditionalFields } from '@/components/deal-form/AdditionalFields';
import { RequiresDiscountCodeField } from '@/components/deal-form/RequiresDiscountCodeField';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { endOfMonth } from "date-fns";

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: Partial<FormValues>;
}

export const DealDialog: React.FC<DealDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = {}
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { subscriptionInfo } = useSubscriptionData();
  const isBasicPlan = subscriptionInfo?.plan_title === 'Baspaket';
  
  // Detect mobile view for responsive dialog
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
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
    is_active: true,
    ...initialValues
  };

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Update the form when initial values change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined) {
          methods.setValue(key as keyof FormValues, value as any);
        }
      });
    }
  }, [initialValues, methods]);
  
  // Update requires_discount_code based on subscription when it loads
  useEffect(() => {
    if (subscriptionInfo && initialValues?.requires_discount_code === undefined) {
      methods.setValue('requires_discount_code', !isBasicPlan);
    }
  }, [subscriptionInfo, isBasicPlan, methods, initialValues]);

  // Controlled close to prevent state update issues
  const handleClose = () => {
    if (isSubmitting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      methods.reset(defaultValues);
    }, 200);
  };

  const handleSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Apply subscription-based restrictions
      if (isBasicPlan) {
        data.requires_discount_code = false;
      }
      
      // Validate booking URL for direct booking
      if (!data.requires_discount_code && !data.booking_url) {
        methods.setError("booking_url", { 
          message: "En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder"
        });
        setIsSubmitting(false);
        return;
      }
      
      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error("Error submitting deal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if the discount code field should be in read-only mode
  const isEditing = initialValues && Object.keys(initialValues).length > 0;
  const discountCodeFieldReadOnly = isBasicPlan || (isEditing && initialValues?.requires_discount_code === true);
  
  // Use Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet 
        open={isOpen && !isClosing} 
        onOpenChange={(open) => !open && handleClose()}
      >
        <SheetContent className="h-[90vh] overflow-y-auto pt-6 px-4" side="bottom">
          <SheetHeader className="mb-4">
            <SheetTitle>
              {isEditing ? "Redigera erbjudande" : "Skapa erbjudande"}
            </SheetTitle>
          </SheetHeader>
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
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
                readOnly={discountCodeFieldReadOnly}
              />
              
              <BookingUrlField form={methods} />
              
              <QuantityField 
                form={methods} 
                readOnly={isEditing && initialValues?.requires_discount_code === true}
              />
              
              <AdditionalFields form={methods} />
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Avbryt
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Sparar..." : (isEditing ? "Uppdatera" : "Skapa")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Redigera erbjudande" : "Skapa erbjudande"}
          </DialogTitle>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
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
                onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  );
};
