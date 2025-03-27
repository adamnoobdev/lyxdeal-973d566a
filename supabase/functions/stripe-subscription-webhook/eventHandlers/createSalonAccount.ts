
export async function createSalonAccount(supabaseAdmin: any, session: any, password: string) {
  if (!session.metadata || !session.metadata.email) {
    console.error("Missing email in session metadata");
    throw new Error("Email is required for account creation");
  }

  try {
    console.log(`Creating salon account for email: ${session.metadata.email}`);
    
    // First check if the user already exists
    const { data: existingUsers, error: findError } = await supabaseAdmin
      .from('salons')
      .select('id, email, user_id')
      .eq('email', session.metadata.email)
      .limit(1);
      
    if (findError) {
      console.error("Error checking for existing account:", findError);
      throw new Error(`Failed to check existing account: ${findError.message}`);
    }
    
    // If the user already exists, create a new auth user and link it
    if (existingUsers && existingUsers.length > 0) {
      console.log(`Salon already exists with email ${session.metadata.email}. Checking auth user...`);
      
      // Check if there's already a user_id linked
      if (existingUsers[0].user_id) {
        console.log(`Salon already has linked user_id: ${existingUsers[0].user_id}`);
        return { 
          user: { 
            id: existingUsers[0].user_id, 
            email: session.metadata.email 
          }, 
          isExisting: true 
        };
      }
      
      // No user_id linked, create an auth user and link it
      try {
        console.log(`Creating new auth user for existing salon: ${session.metadata.email}`);
        const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
          email: session.metadata.email,
          password: password,
          email_confirm: true,
        });
        
        if (createUserError) {
          console.error("Error creating auth user:", createUserError);
          return { 
            user: { 
              id: "existing-user", 
              email: session.metadata.email 
            }, 
            isExisting: true 
          };
        }
        
        // Link the new auth user to the existing salon
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('salons')
          .update({ user_id: newUser.user.id })
          .eq('id', existingUsers[0].id)
          .select();
          
        if (updateError) {
          console.error("Error linking auth user to salon:", updateError);
        } else {
          console.log(`Successfully linked auth user ${newUser.user.id} to salon ${existingUsers[0].id}`);
        }
        
        return { 
          user: newUser.user,
          isExisting: true 
        };
      } catch (authError) {
        console.error("Error in auth user creation:", authError);
        return { 
          user: { 
            id: "existing-user", 
            email: session.metadata.email 
          }, 
          isExisting: true 
        };
      }
    }
    
    // Create a new auth user
    console.log(`Creating new auth user for: ${session.metadata.email}`);
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: session.metadata.email,
      password: password,
      email_confirm: true,
    });
    
    if (createUserError) {
      console.error("Error creating auth user:", createUserError);
      
      // Try to create salon record anyway for tracking purposes
      const { data, error } = await supabaseAdmin
        .from('salons')
        .insert([{
          email: session.metadata.email,
          name: session.metadata.business_name,
          role: 'salon_owner'
        }])
        .select();
      
      if (error) {
        console.error("Error creating salon record:", error);
      } else {
        console.log(`Created salon record (without auth user) with id: ${data[0].id}`);
      }
      
      throw new Error(`Failed to create auth user: ${createUserError.message}`);
    }
    
    // Create a salon record
    const { data, error } = await supabaseAdmin
      .from('salons')
      .insert([{
        email: session.metadata.email,
        name: session.metadata.business_name,
        user_id: authData.user.id,
        role: 'salon_owner'
      }])
      .select();
    
    if (error) {
      console.error("Error creating salon record:", error);
      throw new Error(`Failed to create salon record: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error("No salon data returned from insert");
      throw new Error("Failed to create salon record: No data returned");
    }
    
    // Successfully created both auth user and salon record
    console.log(`Successfully created salon with id: ${data[0].id} linked to auth user: ${authData.user.id}`);
    
    return { 
      user: authData.user
    };
  } catch (error) {
    console.error("Exception in createSalonAccount:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
