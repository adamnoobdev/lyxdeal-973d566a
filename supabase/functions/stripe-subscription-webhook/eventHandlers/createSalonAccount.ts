
export async function createSalonAccount(supabaseAdmin: any, session: any, password: string) {
  if (!password || password.length < 8) {
    console.error("Invalid password provided:", password ? password.length : 0);
    throw new Error("Invalid password: Password must be at least 8 characters");
  }

  if (!session?.metadata?.email) {
    console.error("Missing email in session metadata");
    throw new Error("Missing email in session metadata");
  }

  console.log("Creating user account for:", session.metadata.email);
  console.log("Password length:", password.length);
  
  try {
    // Check if user already exists to avoid duplicates
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(
      session.metadata.email
    );
    
    if (existingUser?.user) {
      console.log("User already exists with email:", session.metadata.email);
      return { user: existingUser.user };
    }
    
    // Create new user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: session.metadata.email,
      password,
      email_confirm: true,
      user_metadata: {
        business_name: session.metadata.business_name,
        plan_title: session.metadata.plan_title,
        plan_type: session.metadata.plan_type
      }
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
    
    // Create user status record for first login tracking
    const { error: statusError } = await supabaseAdmin
      .from("salon_user_status")
      .insert([{ 
        user_id: userData.user.id,
        first_login: true
      }]);
      
    if (statusError) {
      console.warn("Failed to create user status record:", statusError);
      // Non-blocking - continue with user creation
    }
    
    return userData;
  } catch (error) {
    console.error("Exception in createSalonAccount:", error);
    throw error;
  }
}
