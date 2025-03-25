
export async function createSalonAccount(supabaseAdmin: any, session: any, password: string) {
  if (!session.metadata || !session.metadata.email) {
    console.error("Missing email in session metadata");
    throw new Error("Email is required for account creation");
  }

  try {
    console.log(`Creating salon account for email: ${session.metadata.email}`);
    
    // First check if the user already exists
    const { data: existingUsers, error: findError } = await supabaseAdmin.auth.admin
      .listUsers({
        filter: {
          email: session.metadata.email
        }
      });
      
    if (findError) {
      console.error("Error checking for existing account:", findError);
      throw new Error(`Failed to check existing account: ${findError.message}`);
    }
    
    // If user already exists, return it
    if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
      console.log(`User already exists with email ${session.metadata.email}, id: ${existingUsers.users[0].id}`);
      
      // Update the user's password for security
      try {
        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin
          .updateUserById(existingUsers.users[0].id, {
            password: password,
            email_confirm: true
          });
          
        if (updateError) {
          console.error("Error updating existing user password:", updateError);
        } else {
          console.log("Updated existing user password successfully");
        }
      } catch (passwordError) {
        console.error("Exception updating existing user password:", passwordError);
      }
      
      return { user: existingUsers.users[0], isExisting: true };
    }
    
    // Create a new user
    console.log(`Creating new user for email: ${session.metadata.email}`);
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: session.metadata.email,
      password: password,
      email_confirm: true, // Skip email verification
      app_metadata: {
        role: 'salon_owner'
      },
      user_metadata: {
        business_name: session.metadata.business_name,
        subscription_plan: session.metadata.plan_title || "Standard"
      }
    });
    
    if (error) {
      console.error("Error creating user:", error);
      console.error("Error message:", error.message);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    if (!data || !data.user) {
      console.error("No user data returned from createUser");
      throw new Error("Failed to create user: No user data returned");
    }
    
    console.log(`Successfully created user with id: ${data.user.id}`);
    
    return data;
  } catch (error) {
    console.error("Exception in createSalonAccount:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
