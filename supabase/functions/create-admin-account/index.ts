
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateAdminRequest {
  email: string;
  password: string;
  name?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get request body
    const { email, password, name = "Admin" }: CreateAdminRequest = await req.json();
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email och lösenord krävs" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Attempting to create admin account with email: ${email}`);

    // Check if a user with this email already exists
    const { data: existingUsers, error: existingUserError } = await supabaseClient
      .from("salons")
      .select("email")
      .eq("email", email)
      .limit(1);
      
    if (existingUserError) {
      console.error("Error checking existing users:", existingUserError);
    }
    
    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ error: "Ett konto med denna e-postadress finns redan" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the user account
    console.log("Creating admin user with email:", email);
    const { data: userData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the salon record with admin role
    const salonData = {
      name,
      email,
      user_id: userData.user.id,
      role: "admin",
      status: "active", // Always active
      current_period_end: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years in the future
    };
    
    console.log("Creating admin salon with data:", salonData);
    const { data: salon, error: createSalonError } = await supabaseClient
      .from("salons")
      .insert([salonData])
      .select()
      .single();

    if (createSalonError) {
      console.error("Error creating salon:", createSalonError);
      return new Response(
        JSON.stringify({ error: createSalonError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create user status record for first login tracking
    await supabaseClient
      .from("salon_user_status")
      .insert([
        {
          user_id: userData.user.id,
          first_login: true
        },
      ]);

    console.log("Successfully created admin account:", salon);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin-konto skapat framgångsrikt.",
        user: {
          id: userData.user.id,
          email: userData.user.email
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
