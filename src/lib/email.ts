import { profile } from "@/data/profile";

export type Inquiry = {
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  /** Language of the page the visitor used, if not English */
  language?: string;
  message: string;
  source: "Contact form" | "AI assistant";
};

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Emails a new client inquiry to the portfolio owner via Resend.
 * Reply-To is the visitor, so hitting "Reply" answers them directly.
 */
export async function sendInquiry(inquiry: Inquiry): Promise<{ ok: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    return { ok: false, error: "Email is not configured (RESEND_API_KEY missing)." };
  }

  const rows: [string, string | undefined][] = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Project type", inquiry.projectType],
    ["Budget", inquiry.budget],
    ["Site language", inquiry.language],
    ["Via", inquiry.source],
  ];

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="margin:0 0 16px">New project inquiry 🎉</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${escapeHtml(v!)}</b></td></tr>`,
          )
          .join("")}
      </table>
      <div style="white-space:pre-wrap;padding:16px;background:#f5f5f7;border-radius:8px">${escapeHtml(inquiry.message)}</div>
      <p style="color:#666;font-size:13px">Reply to this email to answer ${escapeHtml(inquiry.name)} directly.</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || profile.email],
        reply_to: inquiry.email,
        subject: `New inquiry from ${inquiry.name}${inquiry.projectType ? ` · ${inquiry.projectType}` : ""}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return { ok: false, error: "Email service rejected the message." };
    }
    return { ok: true };
  } catch (error) {
    console.error("Failed to send inquiry email", error);
    return { ok: false, error: "Could not reach the email service." };
  }
}

// Best-effort spam guard: at most 3 inquiries per IP per 10 minutes (per server instance).
const recent = new Map<string, number[]>();

export function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= 3) return true;
  recent.set(ip, [...hits, now]);
  return false;
}
