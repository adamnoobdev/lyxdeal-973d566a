
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dealId, previousIP } = await req.json();
    
    // Grundläggande validering
    if (!dealId) {
      return new Response(
        JSON.stringify({ error: "Missing deal ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Hämta användarens nuvarande IP-adress
    const clientIP = req.headers.get('x-real-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';

    // Enkel kontroll för att se om detta är samma enhet
    const isSameDevice = previousIP && previousIP === clientIP;
    
    console.log(`IP check: Previous IP: ${previousIP}, Current IP: ${clientIP}, Match: ${isSameDevice}`);

    return new Response(
      JSON.stringify({ 
        isSameDevice,
        currentIP: clientIP 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
