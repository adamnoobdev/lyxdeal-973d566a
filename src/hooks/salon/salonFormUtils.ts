
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
  console.log("Source subscription data:", {
    plan: salon.subscription_plan || "Not set in DB (will default to Baspaket)",
    type: salon.subscription_type || "Not set in DB (will default to monthly)"
  });
  
  const subscriptionPlan = salon.subscription_plan || "Baspaket";
  const subscriptionType = salon.subscription_type || "monthly";
  
  console.log("Final subscription values to use in form:", {
    plan: subscriptionPlan,
    type: subscriptionType
  });
  
  // Always use these default values if the salon doesn't have subscription data
  return {
    name: salon.name || "",
    email: salon.email || "",
    phone: salon.phone || "",
    address: salon.address || "",
    termsAccepted: salon.terms_accepted ?? true,
    privacyAccepted: salon.privacy_accepted ?? true,
    subscriptionPlan,
    subscriptionType,
  };
};
