
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
      .select('email')
      .eq('email', session.metadata.email)
      .limit(1);
      
    if (findError) {
      console.error("Error checking for existing account:", findError);
      throw new Error(`Failed to check existing account: ${findError.message}`);
    }
    
    // Om användaren redan finns, skapa en dummy-användare för att fortsätta flödet
    if (existingUsers && existingUsers.length > 0) {
      console.log(`User already exists with email ${session.metadata.email}`);
      
      return { 
        user: { 
          id: "existing-user", 
          email: session.metadata.email 
        }, 
        isExisting: true 
      };
    }
    
    // Vi kan inte skapa auth.users här, så vi skapar direkt ett salongskonto
    console.log(`Creating new user record for: ${session.metadata.email}`);
    
    const { data, error } = await supabaseAdmin
      .from('salons')
      .insert([{
        email: session.metadata.email,
        name: session.metadata.business_name,
        // Ta bort fälten subscription_plan och role om de inte finns i tabellen
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
    
    // Returnera en simulerad user-objekt
    console.log(`Successfully created salon with id: ${data[0].id}`);
    
    return { 
      user: { 
        id: data[0].id.toString(), 
        email: session.metadata.email 
      }
    };
  } catch (error) {
    console.error("Exception in createSalonAccount:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
