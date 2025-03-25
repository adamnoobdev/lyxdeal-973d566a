
export async function createSalonRecord(supabaseAdmin: any, session: any, userData: any, subscriptionData: any) {
  try {
    console.log("Creating salon record for:", session.metadata.business_name);
    console.log("Salon data to insert:", {
      name: session.metadata.business_name,
      email: session.metadata.email,
      role: "salon_owner",
      user_id: userData.user.id,
      subscription_plan: session.metadata.plan_title,
      ...subscriptionData
    });
    
    const { data: salonData, error: salonError } = await supabaseAdmin
      .from("salons")
      .insert([
        {
          name: session.metadata.business_name,
          email: session.metadata.email,
          role: "salon_owner",
          user_id: userData.user.id,
          subscription_plan: session.metadata.plan_title || "Standard",
          subscription_type: session.metadata.plan_type || "monthly",
          stripe_customer_id: session.customer,
          ...subscriptionData
        }
      ])
      .select();

    if (salonError) {
      console.error("Error creating salon:", salonError);
      console.error("Salon error message:", salonError.message);
      console.error("Salon error details:", salonError.details);
      throw new Error(`Failed to create salon record: ${salonError.message}`);
    }
    
    if (!salonData || salonData.length === 0) {
      console.error("No salon data returned after creation");
      throw new Error("Failed to create salon record: No data returned");
    }
    
    console.log("Salon record created successfully:", salonData[0].id);
    return salonData[0];
  } catch (error) {
    console.error("Exception during salon creation:", error);
    console.error("Salon creation error stack:", error.stack);
    throw error;
  }
}

export async function setupFirstLoginTracking(supabaseAdmin: any, userId: string) {
  try {
    console.log("Setting up first login tracking for user:", userId);
    const { error: firstLoginError } = await supabaseAdmin
      .from("salon_user_status")
      .insert([{ user_id: userId, first_login: true }]);
      
    if (firstLoginError) {
      console.error("Error setting first login status:", firstLoginError);
      return { success: false, error: firstLoginError };
    } else {
      console.log("First login status set successfully");
      return { success: true };
    }
  } catch (firstLoginError) {
    console.error("Exception setting first login status:", firstLoginError);
    return { success: false, error: firstLoginError };
  }
}
