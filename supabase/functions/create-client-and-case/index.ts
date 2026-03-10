import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ContentAssignment {
  content_type: string;
  content_id: string;
}

interface CreateClientRequest {
  client_email: string;
  client_password: string;
  case_number: string;
  law_firm_id: string;
  content_assignments?: ContentAssignment[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { client_email, client_password, case_number, law_firm_id, content_assignments }: CreateClientRequest = await req.json();

    if (!client_email || !client_password || !case_number || !law_firm_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: client_email,
      password: client_password,
      email_confirm: true,
    });

    if (authError) {
      return new Response(
        JSON.stringify({ error: `Failed to create user: ${authError.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const fullName = client_email.split('@')[0];

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: authData.user.id,
        full_name: fullName,
        email: client_email,
        password: client_password,
        user_type: 'client',
        law_firm_id: law_firm_id,
      }]);

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: `Failed to create profile: ${profileError.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: caseError } = await supabaseAdmin
      .from('cases')
      .insert([{
        case_number: case_number,
        case_type: 'general',
        description: `Case ${case_number}`,
        client_id: authData.user.id,
        law_firm_id: law_firm_id,
        status: 'open',
      }]);

    if (caseError) {
      await supabaseAdmin.from('profiles').delete().eq('id', authData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: `Failed to create case: ${caseError.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (content_assignments && content_assignments.length > 0) {
      const assignmentsToInsert = content_assignments.map(assignment => ({
        client_id: authData.user.id,
        content_type: assignment.content_type,
        content_id: assignment.content_id,
        assigned_by: user.id,
        is_active: true,
      }));

      const { error: assignmentError } = await supabaseAdmin
        .from('client_content_assignments')
        .insert(assignmentsToInsert);

      if (assignmentError) {
        console.error('Failed to create content assignments:', assignmentError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Client and case created successfully',
        client_id: authData.user.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});