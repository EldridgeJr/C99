import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  clientEmail: string;
  clientName: string;
  password: string;
  adminEmail: string;
  lawFirmName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { clientEmail, clientName, password, adminEmail, lawFirmName }: RequestBody = await req.json();

    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #000;">Welcome to Legal Prep Platform</h2>
        <p>Hello ${clientName},</p>
        <p>Your account has been created by ${lawFirmName}. Here are your login credentials:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Email:</strong> ${clientEmail}</p>
          <p style="margin: 10px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        <p>You can access the platform at: ${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", "")}</p>
        <p>Best regards,<br>${lawFirmName}</p>
      </div>
    `;

    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #000;">New Client Account Created</h2>
        <p>A new client account has been successfully created:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Client Name:</strong> ${clientName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${clientEmail}</p>
          <p style="margin: 10px 0;"><strong>Temporary Password:</strong> ${password}</p>
        </div>
        <p>These credentials have been sent to the client at ${clientEmail}.</p>
        <p>The client should change their password after the first login.</p>
      </div>
    `;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured. Credentials:");
      console.log(`Client: ${clientEmail} / ${password}`);
      console.log(`Admin: ${adminEmail}`);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email service not configured. Please configure RESEND_API_KEY.",
          credentials: {
            email: clientEmail,
            password: password
          }
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const sendEmailToClient = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Legal Prep Platform <noreply@yourdomain.com>",
        to: [clientEmail],
        subject: "Your Legal Prep Platform Account",
        html: clientEmailContent,
      }),
    });

    const sendEmailToAdmin = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Legal Prep Platform <noreply@yourdomain.com>",
        to: [adminEmail],
        subject: "New Client Account Created",
        html: adminEmailContent,
      }),
    });

    const [clientResponse, adminResponse] = await Promise.all([sendEmailToClient, sendEmailToAdmin]);

    if (!clientResponse.ok || !adminResponse.ok) {
      throw new Error("Failed to send emails");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Credentials sent successfully to both client and admin" 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});