
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
  
  // Ensure subscription fields have default values if null
  const subscriptionPlan = salon.subscription_plan || "Baspaket";
  const subscriptionType = salon.subscription_type || "monthly";
  
  console.log("Using subscription values:", { 
    subscriptionPlan, 
    subscriptionType 
  });
  
  return {
    name: salon.name || "",
    email: salon.email || "",
    phone: salon.phone || "",
    address: salon.address || "",
    termsAccepted: salon.terms_accepted ?? true,
    privacyAccepted: salon.privacy_accepted ?? true,
    subscriptionPlan: subscriptionPlan,
    subscriptionType: subscriptionType,
  };
};
