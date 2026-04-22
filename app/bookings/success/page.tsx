"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BadgeCheck, CalendarDays, Clock, User, Mail, CreditCard } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import { insertConsultation } from "@/lib/data"
import Link from "next/link"

type BookingMeta = {
  architect_name: string
  consultation_type: string
  scheduled_at: string
  client_name: string
  client_email: string
  rate: string
  architect_id: string
  architect_initials: string
  consultant_user_id: string
  notes: string
  categories: string
  // dev-mode payload fields (decoded from ?bk=)
  user_id?: string
}

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get("session_id")
  const bkEncoded = params.get("bk")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [meta, setMeta] = useState<BookingMeta | null>(null)
  const [amountTotal, setAmountTotal] = useState<number | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    async function process() {
      const storageKey = sessionId ? `planr_booked_${sessionId}` : bkEncoded ? `planr_booked_bk_${bkEncoded.slice(0, 32)}` : null
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setStatus("error"); return }

      let bookingMeta: BookingMeta | null = null
      let total: number | null = null

      if (sessionId) {
        // Real Stripe session
        const res = await fetch(`/api/stripe/session?id=${sessionId}`)
        if (!res.ok) { setStatus("error"); return }
        const json = await res.json()
        if (json.status !== "paid") { setStatus("error"); return }
        bookingMeta = json.metadata as BookingMeta
        total = json.amount_total
      } else if (bkEncoded) {
        // Dev mode — booking data encoded in URL
        try {
          bookingMeta = JSON.parse(Buffer.from(bkEncoded, "base64url").toString("utf-8")) as BookingMeta
          const rate = Number(bookingMeta.rate ?? 120)
          total = (rate + 5) * 100
        } catch {
          setStatus("error"); return
        }
      } else {
        setStatus("error"); return
      }

      if (!bookingMeta) { setStatus("error"); return }

      // Insert consultation only once (guard via localStorage)
      if (storageKey && !localStorage.getItem(storageKey)) {
        try {
          await insertConsultation(user.id, {
            architect_id: bookingMeta.architect_id ? Number(bookingMeta.architect_id) : null,
            architect_name: bookingMeta.architect_name,
            architect_initials: bookingMeta.architect_initials || bookingMeta.architect_name.split(" ").map((n: string) => n[0]).join(""),
            consultation_type: bookingMeta.consultation_type,
            scheduled_at: bookingMeta.scheduled_at,
            consultant_user_id: bookingMeta.consultant_user_id || null,
            notes: bookingMeta.notes || undefined,
            categories: bookingMeta.categories ? JSON.parse(bookingMeta.categories) : undefined,
          })

          fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "booking_confirmation",
              clientEmail: bookingMeta.client_email,
              clientName: bookingMeta.client_name,
              consultantName: bookingMeta.architect_name,
              consultantRole: bookingMeta.consultation_type,
              scheduledDate: new Date(bookingMeta.scheduled_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              scheduledTime: new Date(bookingMeta.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            }),
          }).catch(() => {})

          if (storageKey) localStorage.setItem(storageKey, "1")
        } catch (e) {
          console.error("Insert consultation error:", e)
        }
      }

      setMeta(bookingMeta)
      setAmountTotal(total)
      setStatus("success")
    }

    process().catch(() => setStatus("error"))
  }, [sessionId, bkEncoded])

  const scheduledDate = meta?.scheduled_at
    ? new Date(meta.scheduled_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "—"
  const scheduledTime = meta?.scheduled_at
    ? new Date(meta.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "—"
  const totalFormatted = amountTotal !== null ? `$${(amountTotal / 100).toFixed(2)}` : "—"

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Booking Confirmed" />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 flex items-start justify-center">
          <div className="w-full max-w-lg mt-4">

            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-white/20 border-t-gray-900 dark:border-t-white animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Confirming your booking…</p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-8 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Something went wrong</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We couldn't confirm your payment. Please contact support if you were charged.</p>
                <Link href="/dashboard" className="text-sm font-medium text-gray-900 dark:text-white underline">Go to dashboard</Link>
              </div>
            )}

            {status === "success" && meta && (
              <>
                {/* Hero */}
                <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-8 text-center mb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <BadgeCheck className="w-9 h-9 text-emerald-500" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Booking confirmed</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your consultation with <span className="font-semibold text-gray-700 dark:text-gray-300">{meta.architect_name}</span> is booked.
                  </p>
                </div>

                {/* Details card */}
                <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6 mb-4 space-y-4">
                  <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Booking details</p>

                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{scheduledDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{scheduledTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Consultant</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{meta.architect_name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{meta.consultation_type}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Confirmation sent to</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{meta.client_email}</p>
                    </div>
                  </div>
                </div>

                {/* Receipt */}
                <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Receipt</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Consultation fee</span>
                      <span className="font-semibold text-gray-800 dark:text-white">${Number(meta.rate)}.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Platform fee</span>
                      <span className="font-semibold text-gray-800 dark:text-white">$5.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100 dark:border-white/8">
                      <span className="text-gray-800 dark:text-white">Total paid</span>
                      <span className="text-gray-900 dark:text-white">{totalFormatted}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
                >
                  Go to dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#07111E]">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-white/20 border-t-gray-900 dark:border-t-white animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
