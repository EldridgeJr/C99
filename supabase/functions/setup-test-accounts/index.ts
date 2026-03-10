import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if law firm exists
    const { data: existingFirm } = await supabaseAdmin
      .from('law_firms')
      .select('id')
      .eq('contact_email', 'admin@lawfirm.com')
      .maybeSingle();

    let lawFirmId = existingFirm?.id;

    // Create law firm if it doesn't exist
    if (!lawFirmId) {
      const { data: newFirm, error: firmError } = await supabaseAdmin
        .from('law_firms')
        .insert({
          name: 'Smith & Partners Legal',
          contact_email: 'admin@lawfirm.com',
          contact_phone: '(555) 100-2000',
          address: '100 Legal Plaza, Suite 500, Boston, MA 02101',
          subscription_plan: 'professional',
          status: 'active',
          admin_code: 'SP2024',
        })
        .select('id')
        .single();

      if (firmError) throw firmError;
      lawFirmId = newFirm.id;
    }

    // Test accounts to create
    const accounts = [
      {
        email: 'admin@court99.com',
        password: 'Admin123!',
        profile: {
          full_name: 'Court99 Administrator',
          user_type: 'admin',
          law_firm_id: null,
        },
      },
      {
        email: 'admin@lawfirm.com',
        password: 'LawFirm123!',
        profile: {
          full_name: 'Sarah Smith',
          user_type: 'admin',
          law_firm_id: lawFirmId,
        },
      },
      {
        email: 'robin.vandenbosch@example.com',
        password: 'Client123!',
        profile: {
          full_name: 'Robin van den Bosch',
          user_type: 'client',
          law_firm_id: lawFirmId,
        },
      },
    ];

    const results = [];

    for (const account of accounts) {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUser?.users?.some((u) => u.email === account.email);

      if (!userExists) {
        // Create user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
        });

        if (authError) {
          results.push({ email: account.email, error: authError.message });
          continue;
        }

        // Create profile
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
          id: authData.user.id,
          email: account.email,
          ...account.profile,
        });

        if (profileError) {
          results.push({ email: account.email, error: profileError.message });
        } else {
          results.push({ email: account.email, success: true });
        }
      } else {
        results.push({ email: account.email, message: 'Already exists' });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});