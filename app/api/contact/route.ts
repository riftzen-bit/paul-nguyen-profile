import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;
const buckets = new Map<string, { count: number; resetAt: number }>();

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  company?: string;
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isLimited(ip)) return json({ message: "Too many messages. Try again in one minute." }, 429);

  const payload = (await request.json().catch(() => null)) as ContactPayload | null;
  if (!payload) return json({ message: "Invalid request body." }, 400);
  if (payload.company) return json({ ok: true }, 200);

  const parsed = parsePayload(payload);
  if (!parsed.ok) return json({ message: parsed.error }, 400);

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
  if (!to || !from) return json({ message: "Contact email recipient/sender is not configured." }, 503);
  if (!hasEmailTransport()) return json({ message: "Contact email transport is not configured." }, 503);

  try {
    await sendMail({
      from,
      to,
      replyTo: parsed.data.email,
      subject: `Profile inquiry from ${parsed.data.name}`,
      text: buildText(parsed.data),
      html: buildHtml(parsed.data)
    });
    return json({ ok: true }, 200);
  } catch {
    return json({ message: "Email provider rejected the message." }, 502);
  }
}

function parsePayload(payload: ContactPayload) {
  const name = clean(payload.name, 80);
  const email = clean(payload.email, 120).toLowerCase();
  const projectType = clean(payload.projectType, 80);
  const budget = clean(payload.budget, 80);
  const timeline = clean(payload.timeline, 80);
  const message = clean(payload.message, 1600);

  if (!name || !email || !message) return { ok: false as const, error: "Name, email, and message are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false as const, error: "Use a valid email address." };
  if (message.length < 20) return { ok: false as const, error: "Message must be at least 20 characters." };
  return { ok: true as const, data: { name, email, projectType, budget, timeline, message } };
}

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function isLimited(ip: string) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

function hasEmailTransport() {
  return Boolean(
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
    process.env.RESEND_API_KEY
  );
}

type ParsedContact = Extract<ReturnType<typeof parsePayload>, { ok: true }>["data"];

function buildText(data: ParsedContact) {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Project type: ${data.projectType || "Not specified"}`,
    `Budget: ${data.budget || "Not specified"}`,
    `Timeline: ${data.timeline || "Not specified"}`,
    "",
    data.message
  ].join("\n");
}

function buildHtml(data: ParsedContact) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Project type", data.projectType || "Not specified"],
    ["Budget", data.budget || "Not specified"],
    ["Timeline", data.timeline || "Not specified"]
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#171615;line-height:1.5">
      <h1 style="font-size:24px">New profile inquiry</h1>
      <table>${rows.map(([label, value]) => `<tr><td style="padding:6px 16px 6px 0;color:#666">${escapeHtml(label)}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`).join("")}</table>
      <p style="white-space:pre-line;margin-top:24px">${escapeHtml(data.message)}</p>
    </div>
  `;
}

async function sendMail(message: { from: string; to: string; replyTo: string; subject: string; text: string; html: string }) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail(message);
    return;
  }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: message.from,
        to: message.to,
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html
      })
    });

    if (response.ok) return;
  }

  throw new Error("No email transport configured.");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] ?? char);
}

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status });
}
