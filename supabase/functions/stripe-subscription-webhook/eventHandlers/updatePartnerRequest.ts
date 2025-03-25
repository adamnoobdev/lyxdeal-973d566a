
export async function updatePartnerRequestStatus(supabaseAdmin: any, email: string) {
  if (!email) {
    console.error("Missing email for partner request update");
    return { success: false, error: "Missing email" };
  }

  try {
    console.log(`Updating partner request status for email: ${email}`);
    
    // Find the partner request with the matching email
    const { data: partnerRequests, error: findError } = await supabaseAdmin
      .from("partner_requests")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (findError) {
      console.error("Error finding partner request:", findError);
      console.error("Find error message:", findError.message);
      return { success: false, error: findError.message };
    }
    
    if (!partnerRequests || partnerRequests.length === 0) {
      console.warn(`No partner request found for email: ${email}`);
      
      // If no partner request exists, let's create one with approved status
      console.log("Creating a new approved partner request record");
      const { data: newPartnerRequest, error: createError } = await supabaseAdmin
        .from("partner_requests")
        .insert([{
          email: email,
          status: "approved",
          name: "Unknown", // We don't have all the details but need to satisfy not null constraints
          business_name: "Unknown", // We don't have all the details but need to satisfy not null constraints
          phone: "Unknown" // We don't have all the details but need to satisfy not null constraints
        }])
        .select();
        
      if (createError) {
        console.error("Error creating partner request:", createError);
        console.error("Create error message:", createError.message);
        return { success: false, error: createError.message };
      }
      
      console.log("Created new approved partner request:", newPartnerRequest);
      return { success: true, created: true };
    }
    
    console.log(`Found partner request ID: ${partnerRequests[0].id}`);
    
    // Update the partner request status to approved
    const { error: updateError } = await supabaseAdmin
      .from("partner_requests")
      .update({ status: "approved" })
      .eq("id", partnerRequests[0].id);
    
    if (updateError) {
      console.error("Error updating partner request:", updateError);
      console.error("Update error message:", updateError.message);
      return { success: false, error: updateError.message };
    }
    
    console.log(`Successfully updated partner request status to 'approved' for ID: ${partnerRequests[0].id}`);
    return { success: true, updated: true };
    
  } catch (error) {
    console.error("Exception in updatePartnerRequestStatus:", error);
    console.error("Error stack:", error.stack);
    return { success: false, error: error.message };
  }
}
