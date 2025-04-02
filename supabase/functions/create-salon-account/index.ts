
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateSalonRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  skipSubscription?: boolean; // Flag to indicate no subscription needed
  subscriptionPlan?: string;  // Added field for subscription plan
  subscriptionType?: string;  // Added field for subscription type (monthly/yearly)
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

    // Verify that the request is from an admin
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(authHeader);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify admin role
    const { data: adminCheck } = await supabaseClient
      .from("salons")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!adminCheck || adminCheck.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Admin only" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get request body
    const { name, email, phone, address, skipSubscription, subscriptionPlan, subscriptionType }: CreateSalonRequest = await req.json();
    
    console.log("Request body:", { name, email, phone, address, skipSubscription, subscriptionPlan, subscriptionType });

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
        JSON.stringify({ error: "En salong med denna e-postadress finns redan" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    // Create the user account
    console.log("Creating user with email:", email);
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

    // Create the salon record
    const salonData: Record<string, any> = {
      name,
      email,
      phone,
      address,
      user_id: userData.user.id,
      role: "salon_owner",
    };
    
    // If we're skipping subscription or adding a specific subscription plan directly
    if (skipSubscription) {
      // For skipped subscriptions, set as active with a far future end date
      Object.assign(salonData, {
        status: "active", 
        current_period_end: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years in the future
      });
    } else if (subscriptionPlan) {
      // For direct subscription assignment, set the subscription details
      Object.assign(salonData, {
        subscription_plan: subscriptionPlan,
        subscription_type: subscriptionType || "monthly",
        status: "active",
        current_period_end: new Date(Date.now() + (subscriptionType === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
      });
    }
    
    console.log("Creating salon with data:", salonData);
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

    console.log("Successfully created salon:", salon);
    return new Response(
      JSON.stringify({
        salon: salon,
        temporaryPassword: password,
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
