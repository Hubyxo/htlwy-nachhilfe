import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GMAIL_USER = "nachhilfe.htlwy@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
const WEBSITE_URL = "https://nachhilfe.htlwy.com";

interface EmailPayload {
  to: string;
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
  if (!GMAIL_APP_PASSWORD) {
    console.error("GMAIL_APP_PASSWORD not configured");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  let text: string;
  let subject: string;

  switch (payload.type) {
    case "booking_request": {
      const { studentName, studentEmail, subject: fach } = payload.data;
      subject = `Neue Buchungsanfrage für ${fach || "Nachhilfe"}`;
      text = `Neue Buchungsanfrage\n\nSchüler: ${studentName}\nE-Mail: ${studentEmail}\nFach: ${fach}\n\n${WEBSITE_URL}\n\n--\nAutomatisch versendete Nachricht.`;
      break;
    }

    case "booking_confirmed": {
      const { coachName, coachEmail, subject: fach } = payload.data;
      subject = `Deine Buchungsanfrage wurde bestätigt`;
      text = `Buchung bestätigt!\n\nDeine Buchungsanfrage wurde bestätigt.\n\nCoach: ${coachName}\nE-Mail: ${coachEmail}\nFach: ${fach}\n\n${WEBSITE_URL}\n\n--\nAutomatisch versendete Nachricht.`;
      break;
    }

    case "booking_rejected": {
      const { coachName, subject: fach, reason } = payload.data;
      subject = `Deine Buchungsanfrage wurde abgelehnt`;
      text = `Buchung abgelehnt\n\nLeider wurde deine Buchungsanfrage abgelehnt.\n\nCoach: ${coachName}\nFach: ${fach}${reason ? `\nBegründung: ${reason}` : ""}\n\n${WEBSITE_URL}\n\n--\nAutomatisch versendete Nachricht.`;
      break;
    }

    default:
      return false;
  }

  try {
    await transporter.sendMail({
      from: `"HTL Nachhilfe" <${GMAIL_USER}>`,
      to: payload.to,
      subject,
      text,
    });
    console.log(`Email sent successfully to ${payload.to} (type: ${payload.type})`);
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

    return new Response(JSON.stringify({ success }), {
      status: success ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
