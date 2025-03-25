
export async function createSalonAccount(supabaseAdmin: any, session: any, password: string) {
  if (!password || password.length < 8) {
    console.error("Invalid password provided:", password ? password.length : 0);
    throw new Error("Invalid password: Password must be at least 8 characters");
  }

  if (!session?.metadata?.email) {
    console.error("Missing email in session metadata:", session?.metadata);
    throw new Error("Missing email in session metadata");
  }

  console.log("Creating user account for:", session.metadata.email);
  console.log("Password length:", password.length);
  
  try {
    // Check if user already exists to avoid duplicates
    console.log("Checking if user already exists...");
    const { data: existingUser, error: userCheckError } = await supabaseAdmin.auth.admin.getUserByEmail(
      session.metadata.email
    );
    
    if (userCheckError) {
      console.error("Error checking for existing user:", userCheckError);
      console.error("Error message:", userCheckError.message);
      throw new Error(`Error checking for existing user: ${userCheckError.message}`);
    }
    
    if (existingUser?.user) {
      console.log("User already exists with email:", session.metadata.email);
      console.log("User ID:", existingUser.user.id);
      return { user: existingUser.user };
    }
    
    // Create new user - with improved error handling
    console.log("No existing user found, creating new user account");
    console.log("Account details:", {
      email: session.metadata.email,
      passwordLength: password.length,
      metadata: {
        business_name: session.metadata.business_name,
        plan_title: session.metadata.plan_title,
        plan_type: session.metadata.plan_type
      }
    });
    
    try {
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
        console.error("Error message:", userError.message);
        console.error("Error status:", userError.status);
        throw new Error(`Failed to create user account: ${userError.message}`);
      }
      
      if (!userData || !userData.user) {
        console.error("No user data returned after account creation");
        throw new Error("Failed to create user: No user data returned");
      }
      
      console.log("User created successfully with ID:", userData.user.id);
      
      // Create user status record for first login tracking
      console.log("Creating user status record for first login tracking");
      const { error: statusError } = await supabaseAdmin
        .from("salon_user_status")
        .insert([{ 
          user_id: userData.user.id,
          first_login: true
        }]);
        
      if (statusError) {
        console.warn("Failed to create user status record:", statusError);
        console.warn("Status error message:", statusError.message);
        // Non-blocking - continue with user creation
      } else {
        console.log("User status record created successfully");
      }
      
      return userData;
    } catch (createError) {
      console.error("Exception in createUser call:", createError);
      console.error("Create user error stack:", createError.stack);
      throw createError;
    }
  } catch (error) {
    console.error("Exception in createSalonAccount:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
