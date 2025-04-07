
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/components/deal-form/schema';
import { endOfMonth } from 'date-fns';

export const useDealDialogForm = (
  initialValues: Partial<FormValues> = {},
  isBasicPlan: boolean
) => {
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
  
  // Update requires_discount_code based on subscription
  useEffect(() => {
    if (initialValues?.requires_discount_code === undefined) {
      methods.setValue('requires_discount_code', !isBasicPlan);
    }
  }, [isBasicPlan, methods, initialValues]);

  return methods;
};
