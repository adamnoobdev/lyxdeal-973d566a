
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // För att hämta alla tabeller i databasen använder vi en SQL-fråga istället för RPC
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');
      
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch database information' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // Hämta exempel på rabattkoder
    const { data: discountCodes, error: codesError } = await supabaseAdmin
      .from('discount_codes')
      .select('*')
      .limit(10);
      
    if (codesError) {
      console.error('Error fetching discount codes:', codesError);
    }

    return new Response(
      JSON.stringify({ 
        tables: tables || [],
        discountCodesCount: discountCodes ? discountCodes.length : 0,
        discountCodeSamples: discountCodes ? discountCodes.slice(0, 5) : []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in database info fetch:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
