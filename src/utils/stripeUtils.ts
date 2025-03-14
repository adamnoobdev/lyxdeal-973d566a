
// This file is kept for backward compatibility but all Stripe functionality has been removed
import { toast } from "sonner";
import { FormValues } from "@/components/deal-form/schema";

// This function is maintained for backward compatibility
// but no longer does anything with Stripe
export const createStripeProductForDeal = async (values: FormValues) => {
  // Function maintained for compatibility but no longer does anything
  console.log("Stripe integration has been removed, no longer creating Stripe products");
  return true;
};
