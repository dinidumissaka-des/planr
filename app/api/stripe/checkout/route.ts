import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

const PLATFORM_FEE_CENTS = 500

export type CheckoutPayload = {
  user_id: string
  architect_id: number | null
  architect_name: string
  architect_initials: string
  consultation_type: string
  scheduled_at: string
  consultant_user_id: string | null
  notes: string | null
  categories: string[] | null
  client_name: string
  client_email: string
  client_mobile: string
  rate: number
}

export async function POST(req: NextRequest) {
  const payload: CheckoutPayload = await req.json()

  const origin = req.headers.get("origin") ?? req.nextUrl.origin
  const rateCents = Math.round(payload.rate * 100)

  if (!stripe) {
    // Dev mode: no Stripe configured — skip to success with encoded booking data
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
    return NextResponse.json({ url: `${origin}/bookings/success?bk=${encoded}`, dev: true })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: payload.client_email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: rateCents,
          product_data: { name: `Consultation — ${payload.architect_name}`, description: payload.consultation_type },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          unit_amount: PLATFORM_FEE_CENTS,
          product_data: { name: "Planr platform fee" },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/bookings`,
    metadata: {
      user_id: payload.user_id,
      architect_id: payload.architect_id !== null ? String(payload.architect_id) : "",
      architect_name: payload.architect_name,
      architect_initials: payload.architect_initials,
      consultation_type: payload.consultation_type,
      scheduled_at: payload.scheduled_at,
      consultant_user_id: payload.consultant_user_id ?? "",
      notes: payload.notes ?? "",
      categories: payload.categories ? JSON.stringify(payload.categories) : "",
      client_name: payload.client_name,
      client_email: payload.client_email,
      client_mobile: payload.client_mobile,
      rate: String(payload.rate),
    },
  })

  return NextResponse.json({ url: session.url })
}
