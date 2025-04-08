
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/components/deal-form/schema';

export const useDealDialogForm = (
  initialValues: Partial<FormValues> = {},
  isBasicPlan: boolean
) => {
  const defaultRequiresDiscountCode = !isBasicPlan;
  
  console.log("useDealDialogForm initialized with isBasicPlan:", isBasicPlan);
  console.log("defaultRequiresDiscountCode set to:", defaultRequiresDiscountCode);
  
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
    requires_discount_code: defaultRequiresDiscountCode, // Default based on plan
    quantity: '10',
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    is_active: true,
    ...initialValues
  };
  
  console.log("Form default values:", defaultValues);

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
          console.log(`Setting initialValue for ${key}:`, value);
        }
      });
    }
  }, [initialValues, methods]);
  
  // Update requires_discount_code based on subscription
  useEffect(() => {
    // Only update if not explicitly set in initialValues
    if (initialValues?.requires_discount_code === undefined) {
      const newValue = !isBasicPlan;
      console.log(`Setting requires_discount_code to ${newValue} based on subscription`);
      methods.setValue('requires_discount_code', newValue);
    } else {
      console.log(`Keeping requires_discount_code as ${initialValues.requires_discount_code} from initialValues`);
    }
  }, [isBasicPlan, methods, initialValues]);

  return methods;
};
