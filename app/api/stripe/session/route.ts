import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("id")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 })
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return NextResponse.json({
    status: session.payment_status,
    metadata: session.metadata,
    amount_total: session.amount_total,
  })
}
