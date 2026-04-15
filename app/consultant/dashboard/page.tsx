"use client"

import { CalendarDays, MessageSquare, CheckCircle2, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ConsultantSidebar } from "@/components/consultant-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import {
  fetchConsultantBookings,
  fetchAllQuestions,
  fetchOrCreateConsultantProfile,
  formatScheduledDate,
  timeAgo,
  type Consultation,
  type ConsultantQuestion,
} from "@/lib/data"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

const STATUS_STYLES: Record<string, string> = {
  upcoming:  "bg-secondary/20 text-primary dark:text-secondary",
  ongoing:   "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  completed: "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400",
}

export default function ConsultantDashboardPage() {
  const [loading, setLoading]           = useState(true)
  const [userName, setUserName]         = useState("")
  const [userId, setUserId]             = useState("")
  const [bookings, setBookings]         = useState<Consultation[]>([])
  const [questions, setQuestions]       = useState<ConsultantQuestion[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      setUserId(user.id)
      const first = user.user_metadata?.first_name ?? ""
      const last  = user.user_metadata?.last_name  ?? ""
      const name  = first && last ? `${first} ${last}` : (user.email ?? "")
      setUserName(name)

      // Ensure consultant profile exists
      await fetchOrCreateConsultantProfile(user.id, name)

      const [bk, qs] = await Promise.all([
        fetchConsultantBookings(user.id),
        fetchAllQuestions(20),
      ])
      setBookings(bk)
      setQuestions(qs)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
        <ConsultantSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader title="Dashboard" />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  const upcoming  = bookings.filter(b => b.status === "upcoming")
  const ongoing   = bookings.filter(b => b.status === "ongoing")
  const completed = bookings.filter(b => b.status === "completed")
  const unanswered = questions.filter(q => !q.is_answered)
  const nextBooking = upcoming[0] ?? null

  const stats = [
    { label: "Upcoming sessions",  value: upcoming.length,  bg: "#81B9E9", grain: "/bg-grain-3.png" },
    { label: "Active sessions",    value: ongoing.length,   bg: "#E1C1A5", grain: "/bg-grain-2.png" },
    { label: "Questions to answer",value: unanswered.length,bg: "#BDC7D9", grain: "/bg-grain-1.png" },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <ConsultantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Dashboard" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="flex flex-col lg:flex-row gap-5">

            {/* ── Left column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Hero banner */}
              <div
                className="relative rounded-2xl overflow-hidden px-5 md:px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  backgroundImage: `url('/banner.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
                  backgroundBlendMode: "overlay",
                  backgroundSize: "cover, cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative z-10">
                  <p className="text-white/50 text-sm font-medium mb-1">{getGreeting()}</p>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{userName}</h2>
                  <p className="text-white/60 text-sm">
                    You have{" "}
                    <span className="text-secondary font-semibold">{upcoming.length} upcoming</span>
                    {" "}session{upcoming.length !== 1 ? "s" : ""} and{" "}
                    <span className="text-white font-semibold">{unanswered.length} question{unanswered.length !== 1 ? "s" : ""}</span>
                    {" "}waiting
                  </p>
                </div>
                <div className="relative z-10 flex gap-2">
                  <Link
                    href="/consultant/bookings"
                    className="flex items-center gap-2 bg-white hover:bg-white/90 text-primary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors whitespace-nowrap"
                  >
                    <CalendarDays className="w-4 h-4" /> View Bookings
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="relative rounded-2xl p-5 flex items-start justify-between overflow-hidden shadow-sm"
                    style={{
                      backgroundColor: s.bg,
                      backgroundImage: `url('${s.grain}')`,
                      backgroundBlendMode: "screen",
                      backgroundSize: "cover",
                    }}
                  >
                    <p className="text-sm text-[#07111E] font-semibold leading-snug">{s.label}</p>
                    <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0">
                      <p className="text-xl font-bold text-[#07111E]">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent questions */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Questions from clients</p>
                  <Link href="/consultant/questions" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                {questions.slice(0, 3).length > 0 ? (
                  <div className="space-y-3">
                    {questions.slice(0, 3).map((q) => (
                      <Link
                        key={q.id}
                        href="/consultant/questions"
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors block"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {q.is_answered
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            : <MessageSquare className="w-5 h-5 text-secondary" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{q.question}</p>
                          {q.category && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/15 text-primary dark:text-secondary mr-2">{q.category}</span>
                          )}
                          <span className="text-xs text-gray-400 dark:text-gray-600">{timeAgo(q.created_at)}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${q.is_answered ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"}`}>
                          {q.is_answered ? "Answered" : "Pending"}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No questions yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Client questions will appear here.</p>
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Recent bookings</p>
                  <Link href="/consultant/bookings" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                {bookings.slice(0, 5).length > 0 ? bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
                    <AvatarInitials initials={b.architect_initials} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{b.architect_name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{b.consultation_type} · {formatScheduledDate(b.scheduled_at)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? ""}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No bookings assigned yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Bookings assigned to you will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4">

              {/* Next session */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Next session</p>
                {nextBooking ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <AvatarInitials initials={nextBooking.architect_initials} size="w-10 h-10" textSize="text-xs" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{nextBooking.architect_name}</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-primary dark:text-secondary">
                          {nextBooking.consultation_type}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2.5 mb-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        📅 {formatScheduledDate(nextBooking.scheduled_at)}
                      </span>
                    </div>
                    <Link
                      href="/consultant/bookings"
                      className="block w-full text-center border border-gray-900 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl transition-colors"
                    >
                      View details
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CalendarDays className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No upcoming sessions</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Assigned sessions will appear here.</p>
                  </div>
                )}
              </div>

              {/* Stats summary */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Overview</p>
                <div className="space-y-3">
                  {[
                    { label: "Total bookings",   value: bookings.length,    icon: CalendarDays },
                    { label: "Completed",         value: completed.length,   icon: CheckCircle2 },
                    { label: "Questions pending", value: unanswered.length,  icon: MessageSquare },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile CTA */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(129,185,233,0.18)" }}>
                  <AvatarInitials initials={userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)} size="w-8 h-8" textSize="text-[10px]" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Complete your profile</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  Add your specialization, bio, and experience so clients can find the right consultant.
                </p>
                <Link
                  href="/consultant/profile"
                  className="block w-full text-center bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Edit profile
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
