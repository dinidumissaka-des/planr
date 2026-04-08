"use client"

import {
  MoreHorizontal, ArrowUpRight, MessageCircleQuestion, MessageCircle,
  CalendarCheck, Sparkles, TrendingUp, Clock, CheckCircle2,
  ChevronRight, Star
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"

// ─── Data ─────────────────────────────────────────────────

const ongoingConsultations = [
  { name: "Sarah Mitchell", initials: "SM", type: "Architecture", date: "Oct 04, 2022", color: "bg-secondary/20 text-primary dark:text-secondary", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&auto=format&fit=crop&q=80" },
  { name: "Marcus Webb",    initials: "MW", type: "Urban Design", date: "Oct 06, 2022", color: "bg-secondary/20 text-primary dark:text-secondary" },
  { name: "Lauren Chen",    initials: "LC", type: "Construction", date: "Oct 13, 2022", color: "bg-secondary/20 text-primary dark:text-secondary", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&auto=format&fit=crop&q=80" },
]

const upcomingConsultations = [
  { name: "Priya Sharma",   initials: "PS", type: "Interior Design",       date: "Oct 14, 2022", color: "bg-secondary/20 text-primary dark:text-secondary", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80" },
  { name: "Tom Hargreaves", initials: "TH", type: "Residential Architect", date: "Oct 15, 2022", color: "bg-secondary/20 text-primary dark:text-secondary" },
  { name: "Nina Okafor",    initials: "NO", type: "Urban Design",          date: "Oct 16, 2022", color: "bg-secondary/20 text-primary dark:text-secondary", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&auto=format&fit=crop&q=80" },
]

const recentQuestions = [
  {
    question: "What's your fee structure and what can I expect in costs?",
    consultant: "James Thornton",
    initials: "JT",
    role: "Architect",
    time: "14 minutes ago",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=80",
  },
  {
    question: "How long does a typical residential project take?",
    consultant: "Alex Rivera",
    initials: "AR",
    role: "Residential Architect",
    time: "2 days ago",
  },
]

// ─── Sub-components ───────────────────────────────────────

function Avatar({ photo, initials, size = "w-8 h-8", textSize = "text-[10px]" }: { photo?: string; initials: string; size?: string; textSize?: string }) {
  if (photo) return <img src={photo} alt={initials} className={`${size} rounded-full object-cover flex-shrink-0`} />
  return (
    <div className={`${size} rounded-full bg-secondary/25 dark:bg-secondary/20 flex items-center justify-center flex-shrink-0`}>
      <span className={`${textSize} font-bold text-primary dark:text-secondary`}>{initials}</span>
    </div>
  )
}

function ConsultationRow({ row }: { row: typeof ongoingConsultations[0] }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/4 rounded-lg px-2 -mx-2 transition-colors">
      <Avatar photo={row.photo} initials={row.initials} />
      <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{row.name}</span>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.color} hidden sm:inline-flex`}>{row.type}</span>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-24 text-right hidden md:block">{row.date}</span>
      <button className="text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors ml-1">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const first = user.user_metadata?.first_name ?? ""
        const last = user.user_metadata?.last_name ?? ""
        setUserName(first && last ? `${first} ${last}` : (user.email ?? ""))
      }
    }
    loadUser()
  }, [])

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
                  <p className="text-white/50 text-sm font-medium mb-1">Good morning</p>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{userName}</h2>
                  <p className="text-white/60 text-sm">You have <span className="text-secondary font-semibold">2 ongoing</span> and <span className="text-white font-semibold">1 upcoming</span> consultation</p>
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
                {[
                  { label: "Upcoming", value: "1", sub: "consultations", icon: Clock, color: "bg-violet-50 text-violet-500", trend: "Next on Oct 14" },
                  { label: "On-going", value: "2", sub: "consultations", icon: TrendingUp, color: "bg-emerald-50 text-emerald-500", trend: "2 active now" },
                  { label: "Completed", value: "8", sub: "consultations", icon: CheckCircle2, color: "bg-yellow-50 text-yellow-600", trend: "+3 this month" },
                ].map((stat, i) => (
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

              {/* ── Recent Q&A — main feature highlight ── */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Recent Questions & Answers</p>
                  <Link href="/question-answer" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentQuestions.map((q, i) => (
                    <Link key={i} href="/question-answer" className="group relative border border-gray-200 dark:border-white/12 hover:border-secondary/40 rounded-xl p-4 transition-all block shadow-sm hover:shadow-md overflow-hidden" style={{ backgroundImage: "url('/grain-bg-lg.svg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/55 to-white/35 dark:from-[#0D1B2E]/80 dark:to-[#0D1B2E]/60 pointer-events-none rounded-xl" />
                      <div className="relative flex items-start gap-3">
                        <div className="mt-0.5"><Avatar photo={q.photo} initials={q.initials} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{q.consultant}
                            <span className="font-normal text-gray-400 dark:text-gray-500"> · {q.role}</span>
                          </p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1 mb-2">Q: {q.question}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-600">{q.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

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
                <div className="grid grid-cols-[1fr_auto_auto_auto] text-xs text-gray-400 dark:text-gray-600 font-medium pb-2 border-b border-gray-100 dark:border-white/8 px-2">
                  <span>Consultant</span><span className="pr-12 hidden sm:block">Type</span><span className="pr-8 hidden md:block">Date</span><span />
                </div>
                {ongoingConsultations.map((row, i) => <ConsultationRow key={i} row={row} />)}
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4">

              {/* Next upcoming */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Next consultation</p>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar photo={upcomingConsultations[0].photo} initials={upcomingConsultations[0].initials} size="w-10 h-10" textSize="text-xs" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{upcomingConsultations[0].name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${upcomingConsultations[0].color}`}>{upcomingConsultations[0].type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2.5 mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">📅 {upcomingConsultations[0].date}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">10AM – 9PM</span>
                </div>
                <Link href="/bookings" className="block w-full text-center border border-gray-900 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Join Session
                </Link>
              </div>

              {/* Upcoming list */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Upcoming</p>
                  <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                {upcomingConsultations.map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0">
                    <Avatar photo={row.photo} initials={row.initials} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{row.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600">{row.date}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${row.color} whitespace-nowrap`}>{row.type}</span>
                  </div>
                ))}
              </div>

              {/* Ask a question CTA — prominent */}
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
