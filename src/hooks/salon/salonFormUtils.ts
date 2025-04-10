
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
  
  // Check if the subscription fields exist in the salon object
  // We use the below approach to ensure we get real values from the database,
  // not undefined or null values that would be replaced by defaults
  const hasPlan = 'subscription_plan' in salon && salon.subscription_plan !== null && salon.subscription_plan !== undefined;
  const hasType = 'subscription_type' in salon && salon.subscription_type !== null && salon.subscription_type !== undefined;
  
  // Get the subscription plan and type from the salon or use defaults
  const subscriptionPlan = hasPlan ? salon.subscription_plan : "Baspaket";
  const subscriptionType = hasType ? salon.subscription_type : "monthly";
  
  console.log("Final subscription values to use in form:", {
    plan: subscriptionPlan,
    type: subscriptionType,
    hasPlanField: hasPlan,
    hasTypeField: hasType
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

// Add a utility function to inspect a salon's raw database column values
export const inspectSalonDatabaseValues = async (id: number) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Execute a normal query instead of using a non-existent RPC function
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error inspecting salon:", error);
      return null;
    }
    
    console.log("Raw salon database values:", data);
    return data;
  } catch (error) {
    console.error("Error executing salon inspection:", error);
    return null;
  }
};
