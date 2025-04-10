
/**
 * Prepares salon data for editing in the form
 */
export const getInitialValuesForEdit = (salon: any) => {
  if (!salon) return {};
  
  return {
    name: salon.name || "",
    email: salon.email || "",
    phone: salon.phone || "",
    address: salon.address || "",
    termsAccepted: salon.terms_accepted ?? true,
    privacyAccepted: salon.privacy_accepted ?? true,
    
    // Add subscription fields for admin editing
    subscriptionPlan: salon.subscription_plan || "Baspaket",
    subscriptionType: salon.subscription_type || "monthly",
  };
};
