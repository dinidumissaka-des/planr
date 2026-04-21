import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const consultantUserId = searchParams.get("consultant_user_id")
  const year  = parseInt(searchParams.get("year")  ?? "")
  const month = parseInt(searchParams.get("month") ?? "") // 0-based

  if (!consultantUserId || isNaN(year) || isNaN(month)) {
    return new Response("Missing params", { status: 400 })
  }

  // Use the user's session so RLS allows the read
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    }
  )

  const from = new Date(year, month, 1).toISOString()
  const to   = new Date(year, month + 1, 1).toISOString()

  const { data, error } = await supabase
    .from("consultations")
    .select("scheduled_at")
    .eq("consultant_user_id", consultantUserId)
    .not("status", "eq", "cancelled")
    .gte("scheduled_at", from)
    .lt("scheduled_at", to)

  if (error) {
    console.error("Availability error:", error.message)
    return new Response(error.message, { status: 500 })
  }

  const booked = (data ?? []).map((row: { scheduled_at: string }) => {
    const d = new Date(row.scheduled_at)
    return { date: d.getDate(), hour: d.getHours() }
  })

  return new Response(JSON.stringify(booked), {
    headers: { "Content-Type": "application/json" },
  })
}
