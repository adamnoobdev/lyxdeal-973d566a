
export async function createSalonRecord(supabaseAdmin: any, session: any, userData: any, subscriptionData: any) {
  try {
    console.log("Creating salon record for:", session.metadata.business_name);
    
    // Om userData redan innehåller en användare som existerar i "salons" tabellen
    if (userData.isExisting) {
      console.log("Salon already exists for this user, updating subscription details");
      
      // Skapa en uppdateringsobjekt som endast innehåller fält som faktiskt finns i databasen
      const updateData = {
        // Vi använder inte subscription_plan eller plan_title eftersom de inte finns i tabellen
        stripe_customer_id: session.customer,
        // Lägg till andra fält från subscriptionData som verkligen existerar i tabellen
        stripe_subscription_id: subscriptionData.stripe_subscription_id,
        status: subscriptionData.status,
        current_period_end: subscriptionData.current_period_end,
        cancel_at_period_end: subscriptionData.cancel_at_period_end
      };

      const { data: salonData, error: salonError } = await supabaseAdmin
        .from("salons")
        .update(updateData)
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
    console.log("Updating newly created salon with subscription details");
    console.log("User data object:", JSON.stringify(userData, null, 2));
    
    // VIKTIGT: Kontrollera att vi inte försöker använda user.id som ett bigint
    if (userData.user && userData.user.id) {
      console.log("User ID type:", typeof userData.user.id);
      console.log("User ID value:", userData.user.id);
      
      // Vi måste hitta salon-ID baserat på email istället för user-ID
      if (session.metadata && session.metadata.email) {
        console.log("Looking up salon by email:", session.metadata.email);
        
        const { data: existingSalon, error: lookupError } = await supabaseAdmin
          .from("salons")
          .select("id")
          .eq("email", session.metadata.email)
          .limit(1);
        
        if (lookupError) {
          console.error("Error looking up salon by email:", lookupError);
          throw new Error(`Failed to lookup salon: ${lookupError.message}`);
        }
        
        if (existingSalon && existingSalon.length > 0) {
          console.log("Found existing salon with ID:", existingSalon[0].id);
          
          // Skapa ett uppdateringsobjekt som endast innehåller fält som faktiskt finns i databasen
          const updateData = {
            // Vi använder inte subscription_plan eller plan_title eftersom de inte finns i tabellen
            stripe_customer_id: session.customer,
            // Lägg till andra fält från subscriptionData som verkligen existerar i tabellen
            stripe_subscription_id: subscriptionData.stripe_subscription_id,
            status: subscriptionData.status,
            current_period_end: subscriptionData.current_period_end,
            cancel_at_period_end: subscriptionData.cancel_at_period_end,
            user_id: userData.user.id // Detta är en UUID, vilket är korrekt för user_id
          };

          const { data: salonData, error: salonError } = await supabaseAdmin
            .from("salons")
            .update(updateData)
            .eq("id", existingSalon[0].id)
            .select();

          if (salonError) {
            console.error("Error updating salon with subscription details:", salonError);
            throw new Error(`Failed to update salon with subscription details: ${salonError.message}`);
          }
          
          console.log("Salon record updated with subscription details successfully");
          return salonData && salonData.length > 0 ? salonData[0] : { id: existingSalon[0].id };
        } else {
          console.error("No salon found with email:", session.metadata.email);
          throw new Error(`No salon found with email: ${session.metadata.email}`);
        }
      } else {
        console.error("No email in session metadata:", session.metadata);
        throw new Error("Missing email in session metadata");
      }
    } else {
      console.error("Missing user data or user ID:", userData);
      throw new Error("Missing user data required for salon creation");
    }
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
