
import { Salon, SalonFormValues } from "@/components/admin/types";

/**
 * Parse address field for editing
 */
export const getInitialValuesForEdit = (salon: Salon): SalonFormValues => {
  const initialValues: SalonFormValues = {
    name: salon.name,
    email: salon.email || "",
    phone: salon.phone || "",
    address: salon.address || "",
    termsAccepted: salon.terms_accepted !== false,
    privacyAccepted: salon.privacy_accepted !== false,
  };

  console.log("[salonFormUtils] Preparing initial values for salon:", salon.name, "address:", salon.address);
  
  return initialValues;
};
