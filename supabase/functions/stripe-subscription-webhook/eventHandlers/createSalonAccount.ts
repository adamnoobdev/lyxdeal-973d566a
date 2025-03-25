
export async function createSalonAccount(supabaseAdmin: any, session: any, password: string) {
  console.log("Creating user account for:", session.metadata.email);
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: session.metadata.email,
    password,
    email_confirm: true,
  });

  if (userError) {
    console.error("Error creating user:", userError);
    throw new Error("Failed to create user account");
  }
  
  return userData;
}
