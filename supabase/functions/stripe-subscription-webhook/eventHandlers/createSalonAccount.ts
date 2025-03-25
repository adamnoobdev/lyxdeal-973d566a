
export async function createSalonAccount(supabaseAdmin: any, session: any, password: string) {
  if (!password || password.length < 8) {
    console.error("Invalid password provided:", password ? password.length : 0);
    throw new Error("Invalid password: Password must be at least 8 characters");
  }

  console.log("Creating user account for:", session.metadata.email);
  console.log("Password length:", password.length);
  
  try {
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: session.metadata.email,
      password,
      email_confirm: true,
    });

    if (userError) {
      console.error("Error creating user:", userError);
      throw new Error(`Failed to create user account: ${userError.message}`);
    }
    
    if (!userData || !userData.user) {
      console.error("No user data returned after account creation");
      throw new Error("Failed to create user: No user data returned");
    }
    
    console.log("User created successfully with ID:", userData.user.id);
    return userData;
  } catch (error) {
    console.error("Exception in createSalonAccount:", error);
    throw error;
  }
}
