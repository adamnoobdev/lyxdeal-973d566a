
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verifiera att förfrågan kommer från en admin
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Ingen auktoriseringsheader" }),
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
        JSON.stringify({ error: "Obehörig" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verifiera admin-roll
    const { data: adminCheck } = await supabaseClient
      .from("salons")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!adminCheck || adminCheck.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Obehörig - endast admin" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Hämta inkommande data
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId är obligatoriskt" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Försöker ta bort användare: ${userId}`);

    // Steg 1: Ta bort relaterade poster i salon_user_status
    const { error: statusError } = await supabaseClient
      .from("salon_user_status")
      .delete()
      .eq("user_id", userId);
    
    if (statusError) {
      console.error("Fel vid borttagning av salon_user_status:", statusError);
    } else {
      console.log("Användares salon_user_status borttagen");
    }

    // Steg 2: Kontrollera om användaren har salonger
    const { data: salonData } = await supabaseClient
      .from("salons")
      .select("id")
      .eq("user_id", userId);
    
    if (salonData && salonData.length > 0) {
      console.log(`Användaren har ${salonData.length} salonger`);
      
      // För varje salong, ta bort relaterade erbjudanden
      for (const salon of salonData) {
        // Ta bort rabattkoder för erbjudanden kopplade till salongen
        const { data: dealData } = await supabaseClient
          .from("deals")
          .select("id")
          .eq("salon_id", salon.id);
          
        if (dealData && dealData.length > 0) {
          console.log(`Salong ${salon.id} har ${dealData.length} erbjudanden`);
          
          for (const deal of dealData) {
            // Ta bort rabattkoder
            const { error: codesError } = await supabaseClient
              .from("discount_codes")
              .delete()
              .eq("deal_id", deal.id);
              
            if (codesError) {
              console.error(`Fel vid borttagning av rabattkoder för erbjudande ${deal.id}:`, codesError);
            } else {
              console.log(`Rabattkoder för erbjudande ${deal.id} borttagna`);
            }
          }
          
          // Ta bort erbjudanden
          const { error: dealsError } = await supabaseClient
            .from("deals")
            .delete()
            .eq("salon_id", salon.id);
            
          if (dealsError) {
            console.error(`Fel vid borttagning av erbjudanden för salong ${salon.id}:`, dealsError);
          } else {
            console.log(`Erbjudanden för salong ${salon.id} borttagna`);
          }
        }
      }
      
      // Ta bort salonger
      const { error: salonsError } = await supabaseClient
        .from("salons")
        .delete()
        .eq("user_id", userId);
        
      if (salonsError) {
        console.error("Fel vid borttagning av salonger:", salonsError);
        throw salonsError;
      } else {
        console.log("Användarens salonger borttagna");
      }
    }

    // Steg 3: Ta bort användarkontot
    const { error: userError } = await supabaseClient.auth.admin.deleteUser(
      userId
    );

    if (userError) {
      console.error("Fel vid borttagning av användare:", userError);
      throw userError;
    }

    console.log("Användare borttagen framgångsrikt");

    return new Response(
      JSON.stringify({ message: "Användaren har tagits bort" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Fullständigt fel:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Ett fel uppstod vid borttagning av användaren",
        details: error
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
