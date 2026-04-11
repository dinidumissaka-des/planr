"use client"

import {
  MoreHorizontal, ArrowUpRight, MessageCircle,
  CalendarCheck, Sparkles, Clock,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { createClient } from "@/lib/supabase"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import {
  fetchConsultations,
  fetchRecentQuestions,
  formatScheduledDate,
  timeAgo,
  type Consultation,
  type RecentQuestion,
} from "@/lib/data"

// ─── Sub-components ───────────────────────────────────────

const Avatar = ({ initials, size = "w-8 h-8", textSize = "text-[10px]" }: { initials: string; size?: string; textSize?: string }) =>
  <AvatarInitials initials={initials} size={size} textSize={textSize} />

function ConsultationRow({ row }: { row: Consultation }) {
  const inner = (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/4 rounded-lg px-2 -mx-2 transition-colors">
      <Avatar initials={row.architect_initials} />
      <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{row.architect_name}</span>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/20 text-primary dark:text-secondary hidden sm:inline-flex">{row.consultation_type}</span>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-24 text-right hidden md:block">{formatScheduledDate(row.scheduled_at)}</span>
      <span className="text-gray-300 dark:text-gray-600 ml-1">
        <MoreHorizontal className="w-4 h-4" />
      </span>
    </div>
  )
  return <Link href={`/consultants/${row.id}`}>{inner}</Link>
}

// ─── Page ─────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const [loading, setLoading]             = useState(true)
  const [userName, setUserName]           = useState("")
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const first = user.user_metadata?.first_name ?? ""
      const last  = user.user_metadata?.last_name  ?? ""
      setUserName(first && last ? `${first} ${last}` : (user.email ?? ""))

      const [cons, questions] = await Promise.all([
        fetchConsultations(user.id),
        fetchRecentQuestions(user.id, 2),
      ])
      setConsultations(cons)
      setRecentQuestions(questions)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <DashboardSkeleton />

  // ── Derived data ──────────────────────────────────────────
  const ongoing   = consultations.filter(c => c.status === "ongoing")
  const upcoming  = consultations.filter(c => c.status === "upcoming")
  const completed = consultations.filter(c => c.status === "completed")

  const nextUpcoming = upcoming[0] ?? null

  // Stat card trend lines
  const nextUpcomingLabel = nextUpcoming
    ? `Next on ${formatScheduledDate(nextUpcoming.scheduled_at)}`
    : "None scheduled"
  const completedThisMonth = completed.filter(c => {
    const d = new Date(c.scheduled_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const stats = [
    { label: "Upcoming",  value: String(upcoming.length),  sub: "consultations", trend: nextUpcomingLabel,                            bg: 0 },
    { label: "On-going",  value: String(ongoing.length),   sub: "consultations", trend: `${ongoing.length} active now`,               bg: 1 },
    { label: "Completed", value: String(completed.length), sub: "consultations", trend: `+${completedThisMonth} this month`,           bg: 2 },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Dashboard" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="flex flex-col lg:flex-row gap-5">

            {/* ── Left / Main Column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* ── Hero greeting banner ── */}
              <div className="relative rounded-2xl overflow-hidden px-5 md:px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  backgroundImage: `url('/banner.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
                  backgroundBlendMode: 'overlay',
                  backgroundSize: 'cover, cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative z-10">
                  <p className="text-white/50 text-sm font-medium mb-1">{getGreeting()}</p>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{userName}</h2>
                  <p className="text-white/60 text-sm">
                    You have{" "}
                    <span className="text-secondary font-semibold">{ongoing.length} ongoing</span>
                    {" "}and{" "}
                    <span className="text-white font-semibold">{upcoming.length} upcoming</span>
                    {" "}consultation{upcoming.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="relative z-10">
                  <Link
                    href="/bookings"
                    className="flex items-center gap-2 bg-white hover:bg-white/90 text-primary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors whitespace-nowrap"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Consultation
                  </Link>
                </div>
              </div>

              {/* ── Stats row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="relative rounded-2xl p-5 flex items-start justify-between overflow-hidden shadow-sm"
                    style={{
                      backgroundColor: i === 1 ? '#E1C1A5' : i === 2 ? '#BDC7D9' : '#81B9E9',
                      backgroundImage: `url('${i === 1 ? '/bg-grain-2.png' : i === 2 ? '/bg-grain-1.png' : '/bg-grain-3.png'}')`,
                      backgroundBlendMode: 'screen',
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <p className="text-sm text-[#07111E] font-semibold">{stat.label} {stat.sub}</p>
                      <p className="text-xs text-[#07111E]/60 mt-1">{stat.trend}</p>
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0">
                      <p className="text-xl font-bold text-[#07111E]">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Recent Q&A ── */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Recent Questions &amp; Answers</p>
                  <Link href="/question-answer" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                {recentQuestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentQuestions.map((q) => (
                      <Link key={q.id} href="/question-answer" className="group relative border border-gray-200 dark:border-white/12 hover:border-secondary/40 rounded-xl p-4 transition-all block shadow-sm hover:shadow-md overflow-hidden" style={{ backgroundImage: "url('/grain-bg-lg.svg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/55 to-white/35 dark:from-[#0D1B2E]/80 dark:to-[#0D1B2E]/60 pointer-events-none rounded-xl" />
                        <div className="relative flex items-start gap-3">
                          <div className="mt-0.5"><Avatar initials={q.consultant_initials} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{q.consultant_name}
                              <span className="font-normal text-gray-400 dark:text-gray-500"> · {q.consultant_role}</span>
                            </p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1 mb-2">Q: {q.question}</p>
                            <span className="text-xs text-gray-400 dark:text-gray-600">{timeAgo(q.created_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No questions yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 max-w-xs">Ask a consultant a question or try the AI assistant for instant answers.</p>
                  </div>
                )}

                {/* AI assistant nudge */}
                <div className="mt-3 flex items-center justify-between bg-secondary/15 dark:bg-secondary/10 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <p className="text-xs font-semibold text-primary dark:text-white">Try the AI Assistant for instant answers</p>
                  </div>
                  <Link href="/question-answer" className="text-xs font-bold text-primary dark:text-secondary hover:opacity-70 transition-colors whitespace-nowrap">
                    Ask now →
                  </Link>
                </div>
              </div>

              {/* ── On-going consultations ── */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">On-going consultations</p>
                  <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                {ongoing.length > 0 ? (
                  <>
                    <div className="grid grid-cols-[1fr_auto_auto_auto] text-xs text-gray-400 dark:text-gray-600 font-medium pb-2 border-b border-gray-100 dark:border-white/8 px-2">
                      <span>Consultant</span><span className="pr-12 hidden sm:block">Type</span><span className="pr-8 hidden md:block">Date</span><span />
                    </div>
                    {ongoing.map((row) => <ConsultationRow key={row.id} row={row} />)}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No ongoing consultations</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Your active sessions will appear here once started.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4">

              {/* Next upcoming */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] flex flex-col">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Next consultation</p>
                {nextUpcoming ? (
                  <>
                    <Link href={`/consultants/${nextUpcoming.id}`} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                      <Avatar initials={nextUpcoming.architect_initials} size="w-10 h-10" textSize="text-xs" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{nextUpcoming.architect_name}</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-primary dark:text-secondary">{nextUpcoming.consultation_type}</span>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2.5 mb-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">📅 {formatScheduledDate(nextUpcoming.scheduled_at)}</span>
                    </div>
                    <Link href="/bookings" className="block w-full text-center border border-gray-900 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl transition-colors mt-auto">
                      Join Session
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <CalendarCheck className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nothing scheduled</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">You have no upcoming consultations booked.</p>
                    <Link href="/bookings" className="block w-full text-center border border-gray-900 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl transition-colors mt-auto">
                      Book a consultation
                    </Link>
                  </div>
                )}
              </div>

              {/* Upcoming list */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Upcoming</p>
                  <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                {upcoming.length > 0 ? upcoming.map((row) => (
                  <Link key={row.id} href={`/consultants/${row.id}`} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                    <Avatar initials={row.architect_initials} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{row.architect_name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600">{formatScheduledDate(row.scheduled_at)}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-primary dark:text-secondary whitespace-nowrap">{row.consultation_type}</span>
                  </Link>
                )) : (
                  <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-5">No upcoming consultations.</p>
                )}
              </div>

              {/* Ask a question CTA */}
              <div
                className="rounded-2xl pt-5 px-5 text-white relative overflow-hidden self-start w-full"
                style={{
                  paddingBottom: '20px',
                  backgroundImage: `url('/bg-gradient.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
                  backgroundBlendMode: 'overlay',
                  backgroundSize: 'cover, cover',
                }}
              >
                <MessageCircle className="w-5 h-5 text-white mb-4" />
                <p className="text-base font-bold mb-1.5">Have a question?</p>
                <p className="text-sm text-white/55 leading-relaxed mb-5">
                  Get instant answers from expert architects or our AI — available 24/7.
                </p>
                <Link
                  href="/question-answer"
                  className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  Ask a Question
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
