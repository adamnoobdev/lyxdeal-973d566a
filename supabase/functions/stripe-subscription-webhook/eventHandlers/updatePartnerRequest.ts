
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
      return { success: false, error: findError.message };
    }
    
    if (!partnerRequests || partnerRequests.length === 0) {
      console.warn(`No partner request found for email: ${email}`);
      return { success: false, error: "No partner request found" };
    }
    
    console.log(`Found partner request ID: ${partnerRequests[0].id}`);
    
    // Update the partner request status to approved
    const { error: updateError } = await supabaseAdmin
      .from("partner_requests")
      .update({ status: "approved" })
      .eq("id", partnerRequests[0].id);
    
    if (updateError) {
      console.error("Error updating partner request:", updateError);
      return { success: false, error: updateError.message };
    }
    
    console.log(`Successfully updated partner request status to 'approved' for ID: ${partnerRequests[0].id}`);
    return { success: true };
    
  } catch (error) {
    console.error("Exception in updatePartnerRequestStatus:", error);
    return { success: false, error: error.message };
  }
}
