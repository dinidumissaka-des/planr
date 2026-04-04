"use client"

import {
  MoreHorizontal, ArrowUpRight, MessageCircleQuestion,
  CalendarCheck, Sparkles, TrendingUp, Clock, CheckCircle2,
  ChevronRight, Star
} from "lucide-react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

// ─── Data ─────────────────────────────────────────────────

const ongoingConsultations = [
  { name: "Judith Lowe",    initials: "JL", type: "Architecture",  date: "Oct 04, 2022", color: "bg-indigo-100 text-indigo-700",  photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80" },
  { name: "Conrad Harber",  initials: "CH", type: "Urban Design",  date: "Oct 06, 2022", color: "bg-emerald-100 text-emerald-700", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
  { name: "Erica Jones",    initials: "EJ", type: "Construction",  date: "Oct 13, 2022", color: "bg-orange-100 text-orange-700",  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
]

const upcomingConsultations = [
  { name: "Beth Fisher",        initials: "BF", type: "Interior Design",      date: "Oct 14, 2022", color: "bg-pink-100 text-pink-700",    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80" },
  { name: "Priscilla Larkin",   initials: "PL", type: "Residential Architect", date: "Oct 15, 2022", color: "bg-violet-100 text-violet-700", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&auto=format&fit=crop&q=80" },
  { name: "Johanna Wintheiser", initials: "JW", type: "Urban Design",          date: "Oct 16, 2022", color: "bg-emerald-100 text-emerald-700", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80" },
]

const recentQuestions = [
  {
    question: "What's your fee structure and what can I expect in costs?",
    answer: "Architects use different fee structures. On your end, be open about your budget — cost limitations are extremely critical since quality work can be very expensive.",
    consultant: "Davis Calzoni",
    role: "Architect",
    time: "14 minutes ago",
    rating: 4.9,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
  },
  {
    question: "How long does a typical residential project take?",
    answer: "A full residential build typically takes 12–24 months from design to completion. Permitting alone can take 2–3 months depending on your jurisdiction.",
    consultant: "Cooper Philips",
    role: "Residential Architect",
    time: "2 days ago",
    rating: 4.7,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
  },
]

// ─── Sub-components ───────────────────────────────────────

function ConsultationRow({ row }: { row: typeof ongoingConsultations[0] }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 rounded-lg px-2 -mx-2 transition-colors">
      <img src={row.photo} alt={row.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
      <span className="flex-1 text-sm font-medium text-gray-800 truncate">{row.name}</span>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.color}`}>{row.type}</span>
      <span className="text-xs text-gray-400 w-24 text-right">{row.date}</span>
      <button className="text-gray-300 hover:text-gray-600 transition-colors ml-1">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Dashboard" />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-5 h-full">

            {/* ── Left / Main Column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* ── Hero greeting banner ── */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 px-7 py-6 flex items-center justify-between">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #facc15 0%, transparent 60%), radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%)" }}
                />
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-medium mb-1">Good morning 👋</p>
                  <h2 className="text-2xl font-bold text-white mb-1">Sahan Fernando</h2>
                  <p className="text-gray-400 text-sm">You have <span className="text-yellow-400 font-semibold">2 ongoing</span> and <span className="text-white font-semibold">1 upcoming</span> consultation</p>
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <Link
                    href="/question-answer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <MessageCircleQuestion className="w-4 h-4" /> Ask a Question
                  </Link>
                  <Link
                    href="/bookings"
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Consultation
                  </Link>
                </div>
              </div>

              {/* ── Stats row ── */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Upcoming", value: "1", sub: "consultations", icon: Clock, color: "bg-violet-50 text-violet-500", trend: "Next on Oct 14" },
                  { label: "On-going", value: "2", sub: "consultations", icon: TrendingUp, color: "bg-emerald-50 text-emerald-500", trend: "2 active now" },
                  { label: "Completed", value: "8", sub: "consultations", icon: CheckCircle2, color: "bg-yellow-50 text-yellow-600", trend: "+3 this month" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-3">{stat.label} {stat.sub}</p>
                      <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.trend}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Recent Q&A — main feature highlight ── */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Recent Questions & Answers</p>
                  </div>
                  <Link href="/question-answer" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  {recentQuestions.map((q, i) => (
                    <Link key={i} href="/question-answer" className="group border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 rounded-xl p-4 transition-all block">
                      <div className="flex items-start gap-3">
                        <img src={q.photo} alt={q.consultant} className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-xs font-semibold text-gray-800 truncate">{q.consultant}
                              <span className="font-normal text-gray-400"> · {q.role}</span>
                            </p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-400">{q.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-gray-700 mb-1.5">Q: {q.question}</p>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{q.answer}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-gray-400">{q.time}</span>
                            <span className="text-[10px] font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                              Continue chat <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* AI assistant nudge */}
                <div className="mt-3 flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <p className="text-xs font-semibold text-indigo-800">Try the AI Assistant for instant answers</p>
                  </div>
                  <Link href="/question-answer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap">
                    Ask now →
                  </Link>
                </div>
              </div>

              {/* ── On-going consultations ── */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900">On-going consultations</p>
                  <button className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto_auto] text-xs text-gray-400 font-medium pb-2 border-b border-gray-100 px-2">
                  <span>Consultant</span><span className="pr-12">Type</span><span className="pr-8">Date</span><span />
                </div>
                {ongoingConsultations.map((row, i) => <ConsultationRow key={i} row={row} />)}
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">

              {/* Next upcoming */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-3">Next consultation</p>
                <div className="flex items-center gap-3 mb-3">
                  <img src={upcomingConsultations[0].photo} alt={upcomingConsultations[0].name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{upcomingConsultations[0].name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${upcomingConsultations[0].color}`}>{upcomingConsultations[0].type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                  <span className="text-xs text-gray-500 font-medium">📅 {upcomingConsultations[0].date}</span>
                  <span className="text-xs text-gray-400">10AM – 9PM</span>
                </div>
                <Link href="/bookings" className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Join Session
                </Link>
              </div>

              {/* Upcoming list */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900">Upcoming</p>
                  <button className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                {upcomingConsultations.map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
                    <img src={row.photo} alt={row.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{row.name}</p>
                      <p className="text-[10px] text-gray-400">{row.date}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${row.color} whitespace-nowrap`}>{row.type}</span>
                  </div>
                ))}
              </div>

              {/* Ask a question CTA — prominent */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-2xl p-5 text-white">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <MessageCircleQuestion className="w-5 h-5 text-white" />
                </div>
                <p className="text-base font-bold mb-1">Have a question?</p>
                <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                  Get instant answers from expert architects or our AI — available 24/7.
                </p>
                <Link
                  href="/question-answer"
                  className="block w-full text-center bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
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
