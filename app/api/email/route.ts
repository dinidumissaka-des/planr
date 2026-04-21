import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = "Planr <notifications@planr.app>"

export type BookingEmailPayload = {
  type: "booking_confirmation"
  clientEmail: string
  clientName: string
  consultantName: string
  consultantRole: string
  scheduledDate: string
  scheduledTime: string
}

export type QAReplyEmailPayload = {
  type: "qa_reply"
  clientEmail: string
  clientName: string
  consultantName: string
  question: string
  reply: string
}

type EmailPayload = BookingEmailPayload | QAReplyEmailPayload

export async function POST(req: NextRequest) {
  if (!resend) {
    // Silently succeed if no API key — don't block the booking flow
    return NextResponse.json({ ok: true, skipped: true })
  }

  const payload: EmailPayload = await req.json()

  try {
    if (payload.type === "booking_confirmation") {
      await resend.emails.send({
        from: FROM,
        to: payload.clientEmail,
        subject: `Booking confirmed — ${payload.consultantName}`,
        html: bookingHtml({
          name: payload.clientName,
          consultantName: payload.consultantName,
          consultantRole: payload.consultantRole,
          date: payload.scheduledDate,
          time: payload.scheduledTime,
        }),
      })
    } else if (payload.type === "qa_reply") {
      await resend.emails.send({
        from: FROM,
        to: payload.clientEmail,
        subject: `Your question was answered — Planr`,
        html: qaReplyHtml({
          name: payload.clientName,
          consultantName: payload.consultantName,
          question: payload.question,
          reply: payload.reply,
        }),
      })
    }
  } catch (err) {
    console.error("Email send error:", err)
    // Non-fatal — log but don't block the caller
  }

  return NextResponse.json({ ok: true })
}

function bookingHtml(p: {
  name: string
  consultantName: string
  consultantRole: string
  date: string
  time: string
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><style>body{font-family:sans-serif;color:#1a1a1a;background:#f9fafb;margin:0;padding:0}.card{background:#fff;border-radius:12px;padding:32px;max-width:480px;margin:40px auto}.label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:4px}.value{font-size:15px;font-weight:600;color:#111}.row{margin-bottom:16px}.footer{font-size:12px;color:#9ca3af;text-align:center;margin-top:24px}</style></head>
<body>
  <div class="card">
    <p style="font-size:24px;font-weight:700;margin:0 0 8px">Booking confirmed</p>
    <p style="color:#6b7280;margin:0 0 28px">Hi ${escHtml(p.name)}, your consultation is booked.</p>
    <div class="row"><div class="label">Consultant</div><div class="value">${escHtml(p.consultantName)}</div><div style="font-size:13px;color:#6b7280">${escHtml(p.consultantRole)}</div></div>
    <div class="row"><div class="label">Date</div><div class="value">${escHtml(p.date)}</div></div>
    <div class="row"><div class="label">Time</div><div class="value">${escHtml(p.time)}</div></div>
    <p style="margin-top:28px;font-size:14px;color:#6b7280">You'll receive a reminder before your session. Log in to Planr to manage your booking.</p>
    <div class="footer">Planr · planr.app</div>
  </div>
</body>
</html>`
}

function qaReplyHtml(p: {
  name: string
  consultantName: string
  question: string
  reply: string
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><style>body{font-family:sans-serif;color:#1a1a1a;background:#f9fafb;margin:0;padding:0}.card{background:#fff;border-radius:12px;padding:32px;max-width:480px;margin:40px auto}.blockquote{border-left:3px solid #e5e7eb;padding-left:12px;color:#6b7280;font-style:italic;margin:16px 0}.reply-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-top:12px}.footer{font-size:12px;color:#9ca3af;text-align:center;margin-top:24px}</style></head>
<body>
  <div class="card">
    <p style="font-size:24px;font-weight:700;margin:0 0 8px">Your question was answered</p>
    <p style="color:#6b7280;margin:0 0 24px">Hi ${escHtml(p.name)}, ${escHtml(p.consultantName)} has replied to your question.</p>
    <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Your question</p>
    <div class="blockquote">${escHtml(p.question)}</div>
    <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Reply from ${escHtml(p.consultantName)}</p>
    <div class="reply-box">${escHtml(p.reply)}</div>
    <div class="footer">Planr · planr.app</div>
  </div>
</body>
</html>`
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
