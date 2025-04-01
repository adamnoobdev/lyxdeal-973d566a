
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateAdminRequest {
  email: string;
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

    // Här behöver vi inte verifiera att anropet kommer från en admin
    // eftersom detta är en engångsanvändning för att skapa den första admin-användaren

    // Hämta data från request body
    const { email, name = "Admin User" }: CreateAdminRequest = await req.json();
    
    console.log("Skapar admin med email:", email);

    // Kontrollera om en användare med denna e-post redan finns
    const { data: existingUsers, error: existingUserError } = await supabaseClient
      .from("salons")
      .select("email")
      .eq("email", email)
      .limit(1);
      
    if (existingUserError) {
      console.error("Fel vid kontroll av befintliga användare:", existingUserError);
    }
    
    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ error: "En användare med denna e-postadress finns redan" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generera ett slumpmässigt lösenord
    const password = Math.random().toString(36).slice(-8);

    // Skapa användarkontot
    const { data: userData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      console.error("Fel vid skapande av användare:", createUserError);
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Skapa salong-posten med admin-roll
    const salonData = {
      name,
      email,
      user_id: userData.user.id,
      role: "admin",
      status: "active",
      current_period_end: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 år framåt
    };
    
    console.log("Skapar admin-användare med data:", salonData);
    const { data: salon, error: createSalonError } = await supabaseClient
      .from("salons")
      .insert([salonData])
      .select()
      .single();

    if (createSalonError) {
      console.error("Fel vid skapande av admin:", createSalonError);
      return new Response(
        JSON.stringify({ error: createSalonError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Skapa user status för spårning av första inloggning
    await supabaseClient
      .from("salon_user_status")
      .insert([
        {
          user_id: userData.user.id,
          first_login: true
        },
      ]);

    console.log("Framgångsrik skapande av admin:", salon);
    return new Response(
      JSON.stringify({
        admin: salon,
        temporaryPassword: password,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Oväntat fel:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
