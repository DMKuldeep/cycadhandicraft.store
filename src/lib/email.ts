import { SITE_NAME } from "@/lib/constants";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? `${SITE_NAME} <onboarding@resend.dev>`;

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Email send failed:", response.status, body);
    return false;
  }

  return true;
}

export async function sendEnquiryNotificationEmail(params: {
  to: string;
  name: string;
  email: string;
  message: string;
}) {
  const html = `
    <h2>New contact enquiry — ${SITE_NAME}</h2>
    <p><strong>Name:</strong> ${escapeHtml(params.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(params.email)}">${escapeHtml(params.email)}</a></p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(params.message)}</p>
    <hr />
    <p style="color:#666;font-size:12px">View all enquiries in your admin panel → Enquiries.</p>
  `;

  return sendEmail({
    to: params.to,
    subject: `New enquiry from ${params.name}`,
    html,
  });
}

export async function sendEnquiryAutoReplyEmail(params: {
  to: string;
  name: string;
}) {
  const html = `
    <h2>Thank you for contacting ${SITE_NAME}</h2>
    <p>Hi ${escapeHtml(params.name)},</p>
    <p>We have received your message and will get back to you soon.</p>
    <p>Best regards,<br />${SITE_NAME}</p>
  `;

  return sendEmail({
    to: params.to,
    subject: `We received your message — ${SITE_NAME}`,
    html,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
