// Supabase Edge Function to send newsletter welcome emails via Resend API
// Using direct HTTP fetch instead of Resend SDK to avoid Deno compatibility issues

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  email: string;
  confirmationToken: string;
  unsubscribeToken: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // Get Resend API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }

    // Parse request body
    const { email, confirmationToken, unsubscribeToken }: EmailRequest = await req.json();

    if (!email || !confirmationToken || !unsubscribeToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate email HTML
    const origin = req.headers.get('origin') || 'http://localhost:8080';
    const confirmUrl = `${origin}/confirm-subscription?token=${confirmationToken}`;
    const unsubscribeUrl = `${origin}/unsubscribe?token=${unsubscribeToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Vignanits</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.2);">
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #8b5cf6;">
                        Welcome to Vignanits! 🎓
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e5e7eb;">
                        Hi there! 👋
                      </p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e5e7eb;">
                        Thank you for joining our learning community! You're now part of a growing network of students leveraging AI-powered tools for academic excellence.
                      </p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e5e7eb;">
                        Here's what you'll receive:
                      </p>
                      <ul style="margin: 0 0 20px; padding-left: 20px; color: #e5e7eb;">
                        <li style="margin-bottom: 10px;">📚 Weekly study tips and learning strategies</li>
                        <li style="margin-bottom: 10px;">🆕 New study materials and resources</li>
                        <li style="margin-bottom: 10px;">✨ Exclusive AI feature updates</li>
                        <li style="margin-bottom: 10px;">🎯 Personalized learning recommendations</li>
                      </ul>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${confirmUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                              Confirm Your Subscription
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #9ca3af;">
                        If you didn't subscribe to this newsletter, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid rgba(139, 92, 246, 0.2); text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 14px; color: #9ca3af;">
                        © 2026 Vignanits. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #6b7280;">
                        <a href="${unsubscribeUrl}" style="color: #8b5cf6; text-decoration: none;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send email via Resend API using direct HTTP fetch
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vignanits <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to Vignanits Learning Community! 🎓',
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await resendResponse.json();

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
