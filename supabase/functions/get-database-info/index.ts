
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
    
    // Hämta information om tabeller - använd en säkrare metod nu
    let tablesData = [];
    try {
      // Istället för att använda RPC, använd direkta SQL-frågor som är säkrare
      const { data, error } = await supabaseAdmin.from('_tables_temp_view')
        .select('*')
        .limit(100);
      
      if (error) {
        console.error('Error fetching tables via view:', error);
      } else {
        tablesData = data || [];
        console.log(`Fetched ${tablesData.length} tables via view`);
      }
    } catch (viewError) {
      console.error('Exception fetching tables via view:', viewError);
    }
    
    // Om view-metoden misslyckades, använd direkt SQL
    if (tablesData.length === 0) {
      try {
        // Skapa en tillfällig vy för att få tabell-information
        await supabaseAdmin.rpc('create_tables_temp_view');
        
        // Hämta data från den tillfälliga vyn
        const { data, error } = await supabaseAdmin.from('_tables_temp_view')
          .select('*')
          .limit(100);
          
        if (error) {
          console.error('Error fetching from temp view:', error);
        } else {
          tablesData = data || [];
          console.log(`Fetched ${tablesData.length} tables from temp view`);
        }
        
        // Ta bort den tillfälliga vyn
        await supabaseAdmin.rpc('drop_tables_temp_view');
      } catch (sqlError) {
        console.error('Error with direct SQL approach:', sqlError);
      }
    }
    
    // Manuell fallback för att få grundläggande tabellinformation
    if (tablesData.length === 0) {
      try {
        // Hämta lista över tabeller direkt från information_schema
        const { data, error } = await supabaseAdmin.from('information_schema.tables')
          .select('table_schema,table_name')
          .filter('table_schema', 'in', '(public,auth,storage,realtime,pgsodium,vault,pg_catalog)')
          .order('table_schema', { ascending: true })
          .order('table_name', { ascending: true });
          
        if (error) {
          console.error('Error fetching from information_schema:', error);
        } else {
          tablesData = (data || []).map(t => ({
            schema_name: t.table_schema,
            table_name: t.table_name,
            row_count: -1
          }));
          console.log(`Fetched ${tablesData.length} tables from information_schema`);
        }
      } catch (infoSchemaError) {
        console.error('Error with information_schema approach:', infoSchemaError);
      }
    }
    
    // Grundligare fallback 
    if (tablesData.length === 0) {
      try {
        // Enkel lista över tabeller i public schema
        const { data, error } = await supabaseAdmin
          .from('pg_catalog.pg_tables')
          .select('schemaname,tablename')
          .eq('schemaname', 'public');
          
        if (error) {
          console.error('Error fetching from pg_catalog:', error);
        } else {
          tablesData = (data || []).map(t => ({
            schema_name: t.schemaname,
            table_name: t.tablename,
            row_count: -1
          }));
          console.log(`Fetched ${tablesData.length} tables from pg_catalog`);
        }
      } catch (pgCatalogError) {
        console.error('Error with pg_catalog approach:', pgCatalogError);
      }
    }
    
    // Fallback: Om inga tabeller hittades med någon metod
    if (tablesData.length === 0) {
      tablesData = [
        { schema_name: 'public', table_name: 'deals', row_count: -1 },
        { schema_name: 'public', table_name: 'discount_codes', row_count: -1 },
        { schema_name: 'public', table_name: 'salons', row_count: -1 },
        { schema_name: 'public', table_name: 'purchases', row_count: -1 }
      ];
      console.log('Using fallback table list');
    }
    
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
        const typeSamples = discountCodes.map(code => ({
          code: code.code,
          deal_id: code.deal_id,
          deal_id_type: typeof code.deal_id
        }));
        
        console.log('Sample discount codes with types:', typeSamples);
        
        // Räkna förekomster av olika deal_id:n
        const dealIdCounts = {};
        discountCodes.forEach(code => {
          const dealId = code.deal_id;
          dealIdCounts[dealId] = (dealIdCounts[dealId] || 0) + 1;
        });
        
        console.log('Deal ID distribution:', dealIdCounts);
      }
    }

    return new Response(
      JSON.stringify({ 
        tables: tablesData,
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
