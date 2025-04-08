
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/components/deal-form/schema';

export const useDealDialogForm = (
  initialValues: Partial<FormValues> = {},
  isBasicPlan: boolean
) => {
  // For Basic plan, always default to direct booking (no discount code)
  const defaultRequiresDiscountCode = !isBasicPlan;
  
  console.log("useDealDialogForm initialized with isBasicPlan:", isBasicPlan);
  console.log("defaultRequiresDiscountCode set to:", defaultRequiresDiscountCode);
  
  // Set initial requires_discount_code based on subscription plan
  const formValues = {
    ...initialValues, 
    requires_discount_code: initialValues.requires_discount_code !== undefined 
      ? initialValues.requires_discount_code 
      : defaultRequiresDiscountCode
  };
  
  console.log("Form default values:", formValues);

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
      ...formValues
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
  
  // Update requires_discount_code based on subscription
  useEffect(() => {
    if (isBasicPlan) {
      console.log(`Setting requires_discount_code to false for basic plan`);
      methods.setValue('requires_discount_code', false);
    } else if (initialValues?.requires_discount_code === undefined) {
      console.log(`Setting requires_discount_code to true for premium plan`);
      methods.setValue('requires_discount_code', true);
    }
  }, [isBasicPlan, methods, initialValues]);

  return methods;
};
