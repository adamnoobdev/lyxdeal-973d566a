import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create the user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'testsalong@example.com',
      password: 'password123',
      email_confirm: true
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('No user was created')
    }

    // Call the create_test_salon function to create the salon
    const { error: salonError } = await supabase.rpc('create_test_salon', {
      user_id: authData.user.id
    })

    if (salonError) {
      throw salonError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Test salon created successfully',
        email: 'testsalong@example.com',
        password: 'password123'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})