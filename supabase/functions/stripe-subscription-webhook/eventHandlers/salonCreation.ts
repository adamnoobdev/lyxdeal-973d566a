
export async function createSalonRecord(supabaseAdmin: any, session: any, userData: any, subscriptionData: any) {
  try {
    console.log("Creating salon record for:", session.metadata.business_name);
    
    // Om userData redan innehåller en användare som existerar i "salons" tabellen
    if (userData.isExisting) {
      console.log("Salon already exists for this user, updating subscription details");
      
      const { data: salonData, error: salonError } = await supabaseAdmin
        .from("salons")
        .update({
          subscription_plan: session.metadata.plan_title || "Standard",
          subscription_type: session.metadata.plan_type || "monthly",
          stripe_customer_id: session.customer,
          ...subscriptionData
        })
        .eq("email", session.metadata.email)
        .select();

      if (salonError) {
        console.error("Error updating salon:", salonError);
        throw new Error(`Failed to update salon record: ${salonError.message}`);
      }
      
      console.log("Salon record updated successfully");
      // Returnera befintlig salongsdata eller hämta den aktuella
      return salonData && salonData.length > 0 ? salonData[0] : { id: "existing-salon" };
    }
    
    // Om userData innehåller ett nyskapat salon-objekt
    // behöver vi bara uppdatera det skapade salongsobjektet med Stripe-information
    console.log("Updating newly created salon with subscription details:", {
      subscription_plan: session.metadata.plan_title,
      subscription_type: session.metadata.plan_type,
      stripe_customer_id: session.customer,
      ...subscriptionData
    });
    
    const { data: salonData, error: salonError } = await supabaseAdmin
      .from("salons")
      .update({
        subscription_plan: session.metadata.plan_title || "Standard",
        subscription_type: session.metadata.plan_type || "monthly",
        stripe_customer_id: session.customer,
        ...subscriptionData
      })
      .eq("id", userData.user.id)
      .select();

    if (salonError) {
      console.error("Error updating salon with subscription details:", salonError);
      throw new Error(`Failed to update salon with subscription details: ${salonError.message}`);
    }
    
    console.log("Salon record updated with subscription details successfully");
    return salonData && salonData.length > 0 ? salonData[0] : { id: userData.user.id };
    
  } catch (error) {
    console.error("Exception during salon creation/update:", error);
    console.error("Salon creation error stack:", error.stack);
    throw error;
  }
}

export async function setupFirstLoginTracking(supabaseAdmin: any, userId: string) {
  try {
    // Här behöver vi inte göra något eftersom vi inte har user_id från auth
    console.log("First login tracking is skipped in simplified implementation");
    return { success: true };
  } catch (firstLoginError) {
    console.error("Exception setting first login status:", firstLoginError);
    return { success: false, error: firstLoginError };
  }
}
