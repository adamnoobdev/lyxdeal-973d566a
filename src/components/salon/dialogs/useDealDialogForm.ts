
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/components/deal-form/schema';

export const useDealDialogForm = (
  initialValues: Partial<FormValues> = {},
  isBasicPlan: boolean
) => {
  // Basic plan always uses direct booking (no discount codes)
  // För basic plan måste vi sätta defaultRequiresDiscountCode till false
  const defaultRequiresDiscountCode = isBasicPlan ? false : !isBasicPlan;
  
  console.log("useDealDialogForm initialized with isBasicPlan:", isBasicPlan);
  console.log("defaultRequiresDiscountCode set to:", defaultRequiresDiscountCode);
  
  // Create form methods with proper defaults based on subscription plan
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      originalPrice: '0',
      discountedPrice: '0',
      category: '',
      city: '',
      featured: false,
      imageUrl: '',
      booking_url: '',
      requires_discount_code: defaultRequiresDiscountCode,
      quantity: '10',
      expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      is_active: true,
      ...initialValues
    }
  });

  // Update the form when initial values change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined) {
          methods.setValue(key as keyof FormValues, value as any);
          console.log(`Setting initialValue for ${key}:`, value);
        }
      });
    }
  }, [initialValues, methods]);
  
  // Force direct booking for basic plan
  useEffect(() => {
    if (isBasicPlan) {
      console.log(`Setting requires_discount_code to false for basic plan`);
      methods.setValue('requires_discount_code', false);
      
      // Trigger validation
      methods.trigger();
    }
  }, [isBasicPlan, methods]);

  return methods;
};
