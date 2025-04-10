
import { Salon, SalonFormValues } from "@/components/admin/types";

/**
 * Prepares salon data for editing in the form
 */
export const getInitialValuesForEdit = (salon: Salon): SalonFormValues => {
  if (!salon) return {
    name: "",
    email: "",
    phone: "",
    address: "",
    termsAccepted: true,
    privacyAccepted: true,
    subscriptionPlan: "Baspaket",
    subscriptionType: "monthly"
  };
  
  console.log("Preparing salon for edit:", salon);
  
  // Always use these default values if the salon doesn't have subscription data
  // This handles edge cases where salons were created with skipSubscription=true
  return {
    name: salon.name || "",
    email: salon.email || "",
    phone: salon.phone || "",
    address: salon.address || "",
    termsAccepted: salon.terms_accepted ?? true,
    privacyAccepted: salon.privacy_accepted ?? true,
    subscriptionPlan: salon.subscription_plan || "Baspaket",
    subscriptionType: salon.subscription_type || "monthly",
  };
};
