import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact notification email for:", { name, email });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["hello@catalyst-ai.com"], // Replace with your actual admin email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted via Catalyst AI contact form</em></p>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Catalyst AI <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <blockquote style="background: #f4f4f4; padding: 16px; border-radius: 8px;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <p>Best regards,<br>The Catalyst AI Team</p>
      `,
    });

    console.log("User confirmation sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse, 
        userEmail: userEmailResponse 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
