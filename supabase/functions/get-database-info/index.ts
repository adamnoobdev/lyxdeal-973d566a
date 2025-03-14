
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

    // First check if we can connect to the database
    console.log("Testing database connection by querying discount_codes...");
    const { data: testConnection, error: connectionError } = await supabaseAdmin
      .from('discount_codes')
      .select('count')
      .limit(1);
      
    if (connectionError) {
      console.error('Error connecting to database:', connectionError);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to database', details: connectionError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }
    
    console.log("Connection successful, now querying table information...");
    
    // Fetch table information via RPC
    const { data: tablesData, error: tablesError } = await supabaseAdmin
      .rpc('get_tables');
      
    if (tablesError) {
      console.error('Error calling get_tables function:', tablesError);
      
      // Fallback: Try a direct SQL query to get at least some info about tables
      const { data: fallbackTables, error: fallbackError } = await supabaseAdmin
        .from('discount_codes')
        .select('id')
        .limit(1);
        
      if (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      } else {
        console.log('Fallback query successful, we can access discount_codes table');
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch database information', 
          details: tablesError,
          canAccessDiscountCodes: !fallbackError 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // Ensure tablesData is properly processed and format it consistently
    const tables = Array.isArray(tablesData) ? tablesData : [];
    
    console.log(`Successfully retrieved ${tables.length} tables`);
    console.log('First 3 tables:', tables.slice(0, 3));
    
    // Hämta exempel på alla rabattkoder för att hjälpa till vid felsökning
    const { data: discountCodes, error: codesError } = await supabaseAdmin
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (codesError) {
      console.error('Error fetching discount codes:', codesError);
    } else if (discountCodes) {
      console.log(`Successfully retrieved ${discountCodes.length} discount codes`);
      
      // Extra verifiering av deal_id typen för felsökning
      if (discountCodes.length > 0) {
        console.log('Sample discount code:', {
          code: discountCodes[0].code,
          deal_id: discountCodes[0].deal_id,
          deal_id_type: typeof discountCodes[0].deal_id
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        tables: tables,
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
