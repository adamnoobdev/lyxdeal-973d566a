
export async function updatePartnerRequestStatus(supabaseAdmin: any, email: string) {
  console.log("Updating partner request status for:", email);
  const { error: updateError } = await supabaseAdmin
    .from("partner_requests")
    .update({ status: "approved" })
    .eq("email", email);

  if (updateError) {
    console.error("Error updating partner request:", updateError);
    // Non-blocking error - log but don't throw
  }
}
