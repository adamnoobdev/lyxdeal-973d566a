
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
    
    // Let's get table information using raw SQL instead of RPC to avoid type issues
    const { data: tablesRaw, error: tablesError } = await supabaseAdmin
      .rpc('get_tables');
      
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      
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

    // Transform the tables data to ensure proper types
    const tables = tablesRaw ? tablesRaw.map(table => ({
      schema_name: String(table.schema_name || ''),
      table_name: String(table.table_name || ''),
      row_count: Number(table.row_count || 0)
    })) : [];

    console.log(`Successfully retrieved ${tables.length} tables`);
    
    // Hämta exempel på rabattkoder
    const { data: discountCodes, error: codesError } = await supabaseAdmin
      .from('discount_codes')
      .select('*')
      .limit(10);
      
    if (codesError) {
      console.error('Error fetching discount codes:', codesError);
    } else {
      console.log(`Successfully retrieved ${discountCodes?.length || 0} discount codes`);
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
