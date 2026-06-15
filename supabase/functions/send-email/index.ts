import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "nachhilfe.htlwy@gmail.com";
const WEBSITE_URL = "https://nachhilfe.htlwy.com";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  type: "booking_request" | "booking_confirmed" | "booking_rejected";
  data: {
    studentName?: string;
    studentEmail?: string;
    coachName?: string;
    coachEmail?: string;
    subject?: string;
    reason?: string;
  };
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }

  let html: string;
  let subject: string;
  let to: string = payload.to;

  switch (payload.type) {
    case "booking_request": {
      const { studentName, studentEmail, subject: fach } = payload.data;
      subject = `Neue Buchungsanfrage für ${fach || "Nachhilfe"}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Neue Buchungsanfrage</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Du hast eine neue Buchungsanfrage erhalten:
            </p>
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong style="color: #1f2937;">Schüler:</strong> <span style="color: #4b5563;">${studentName}</span></p>
              <p style="margin: 0 0 8px 0;"><strong style="color: #1f2937;">E-Mail:</strong> <span style="color: #4b5563;">${studentEmail}</span></p>
              <p style="margin: 0;"><strong style="color: #1f2937;">Fach:</strong> <span style="color: #4b5563;">${fach}</span></p>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Du kannst die Anfrage unter folgendem Link bestätigen oder ablehnen:
            </p>
            <a href="${WEBSITE_URL}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px;">
              Zur Website
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Diese E-Mail wurde automatisch versendet. Bitte antworte nicht darauf.
            </p>
          </div>
        </div>
      `;
      break;
    }

    case "booking_confirmed": {
      const { coachName, coachEmail, subject: fach } = payload.data;
      subject = `Deine Buchungsanfrage wurde bestätigt`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #059669; font-size: 24px; margin-bottom: 20px;">Buchung bestätigt!</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Gute Neuigkeiten! Deine Buchungsanfrage wurde bestätigt.
            </p>
            <div style="background-color: #ecfdf5; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #a7f3d0;">
              <p style="margin: 0 0 8px 0;"><strong style="color: #1f2937;">Coach:</strong> <span style="color: #4b5563;">${coachName}</span></p>
              <p style="margin: 0 0 8px 0;"><strong style="color: #1f2937;">E-Mail:</strong> <span style="color: #4b5563;">${coachEmail}</span></p>
              <p style="margin: 0;"><strong style="color: #1f2937;">Fach:</strong> <span style="color: #4b5563;">${fach}</span></p>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Kontaktiere deinen Coach per E-Mail, um die Details zu besprechen.
            </p>
            <a href="${WEBSITE_URL}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px;">
              Zur Website
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Diese E-Mail wurde automatisch versendet. Bitte antworte nicht darauf.
            </p>
          </div>
        </div>
      `;
      break;
    }

    case "booking_rejected": {
      const { coachName, subject: fach, reason } = payload.data;
      subject = `Deine Buchungsanfrage wurde abgelehnt`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">Buchung abgelehnt</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Leider wurde deine Buchungsanfrage abgelehnt.
            </p>
            <div style="background-color: #fef2f2; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #fecaca;">
              <p style="margin: 0 0 8px 0;"><strong style="color: #1f2937;">Coach:</strong> <span style="color: #4b5563;">${coachName}</span></p>
              <p style="margin: 0;"><strong style="color: #1f2937;">Fach:</strong> <span style="color: #4b5563;">${fach}</span></p>
            </div>
            ${reason ? `
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">Begründung:</p>
                <p style="margin: 0; color: #4b5563; font-style: italic;">"${reason}"</p>
              </div>
            ` : ""}
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Du kannst auf der Website einen anderen Coach suchen und eine neue Anfrage stellen.
            </p>
            <a href="${WEBSITE_URL}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px;">
              Anderen Coach finden
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Diese E-Mail wurde automatisch versendet. Bitte antworte nicht darauf.
            </p>
          </div>
        </div>
      `;
      break;
    }

    default:
      return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const success = await sendEmail(payload);

    if (success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
