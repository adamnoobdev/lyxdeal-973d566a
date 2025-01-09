import { createClient } from 'https://esm.sh/@supabase-js@2'

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
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating test user...')

    // Generate a random email to avoid conflicts
    const randomId = Math.random().toString(36).substring(7)
    const email = `testsalong${randomId}@example.com`
    const password = 'password123'

    // Create the user with auto-confirm
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (userError) {
      console.error('Error creating user:', userError)
      throw userError
    }

    if (!userData.user) {
      throw new Error('No user was created')
    }

    console.log('User created successfully:', userData.user.id)

    // Create the salon
    const { error: salonError } = await supabaseAdmin
      .from('salons')
      .insert([
        {
          name: 'Test Salong',
          email: email,
          user_id: userData.user.id
        }
      ])

    if (salonError) {
      console.error('Error creating salon:', salonError)
      throw salonError
    }

    console.log('Salon created successfully')

    return new Response(
      JSON.stringify({
        email,
        password
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Complete error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})