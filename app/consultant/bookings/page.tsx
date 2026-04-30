"use client"

import { CalendarDays, Clock, CheckCircle2, XCircle, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConsultantSidebar } from "@/components/consultant-sidebar"
import { AppHeader } from "@/components/app-header"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import { createClient } from "@/lib/supabase"
import {
  fetchConsultantBookings,
  updateConsultationStatus,
  formatScheduledDate,
  type Consultation,
  type ConsultationStatus,
} from "@/lib/data"

const TABS: { label: string; value: ConsultationStatus | "all" }[] = [
  { label: "All",       value: "all" },
  { label: "Upcoming",  value: "upcoming" },
  { label: "Ongoing",   value: "ongoing" },
  { label: "Completed", value: "completed" },
]

const STATUS_META: Record<ConsultationStatus, { label: string; color: string; icon: React.ElementType }> = {
  upcoming:  { label: "Upcoming",  color: "bg-secondary/20 text-primary dark:text-secondary",                              icon: CalendarDays },
  ongoing:   { label: "Ongoing",   color: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",  icon: Clock },
  completed: { label: "Completed", color: "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400",                icon: CheckCircle2 },
}

function BookingCard({
  booking,
  onStatusChange,
}: {
  booking: Consultation
  onStatusChange: (id: string, status: ConsultationStatus) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const meta = STATUS_META[booking.status]
  const Icon = meta.icon
  const shortId = booking.id.slice(0, 8).toUpperCase()

  async function change(status: ConsultationStatus) {
    setUpdating(true)
    await onStatusChange(booking.id, status)
    setUpdating(false)
    setExpanded(false)
  }

  return (
    <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
      {/* Header row */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 dark:hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "rgba(129,185,233,0.18)" }}>
          <CalendarDays className="w-5 h-5" style={{ color: "#1A3050" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{booking.consultation_type}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{formatScheduledDate(booking.scheduled_at)} · #{shortId}</p>
        </div>
        <span className={`hidden sm:inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full items-center gap-1.5 ${meta.color}`}>
          <Icon className="w-3 h-3" />
          {meta.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded actions */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-white/8 px-5 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl p-3">
            <div>
              <span className="text-gray-400 dark:text-gray-600 block mb-0.5">Type</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{booking.consultation_type}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-600 block mb-0.5">Date</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{formatScheduledDate(booking.scheduled_at)}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-600 block mb-0.5">Ref</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">#{shortId}</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Change status</p>
          <div className="flex gap-2 flex-wrap">
            {booking.status !== "ongoing" && (
              <button
                onClick={() => change("ongoing")}
                disabled={updating}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                <Clock className="w-3.5 h-3.5" /> Mark Ongoing
              </button>
            )}
            {booking.status !== "completed" && (
              <button
                onClick={() => change("completed")}
                disabled={updating}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
              </button>
            )}
            {booking.status !== "upcoming" && (
              <button
                onClick={() => change("upcoming")}
                disabled={updating}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-secondary/20 text-primary dark:text-secondary hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                <CalendarDays className="w-3.5 h-3.5" /> Reset to Upcoming
              </button>
            )}
            {updating && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 px-3 py-2">
                <div className="w-3 h-3 rounded-full border border-gray-300 border-t-gray-600 animate-spin" /> Updating…
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ConsultantBookingsPage() {
  const router = useRouter()
  const [loading, setLoading]   = useState(true)
  const [bookings, setBookings] = useState<Consultation[]>([])
  const [tab, setTab]           = useState<ConsultationStatus | "all">("all")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const data = await fetchConsultantBookings(user.id)
      setBookings(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusChange(id: string, status: ConsultationStatus) {
    await updateConsultationStatus(id, status)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const filtered   = tab === "all" ? bookings : bookings.filter(b => b.status === tab)
  const upcoming   = bookings.filter(b => b.status === "upcoming")
  const ongoing    = bookings.filter(b => b.status === "ongoing")
  const completed  = bookings.filter(b => b.status === "completed")
  const nextSession = upcoming[0] ?? null

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <ConsultantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Bookings" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="flex flex-col lg:flex-row gap-5">

            {/* ── Main column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Tab filter */}
              <div className="flex gap-2 p-1 bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl">
                {TABS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all ${
                      tab === t.value
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Booking list */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
                </div>
              ) : filtered.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filtered.map(b => (
                    <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <XCircle className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No {tab === "all" ? "" : tab} bookings</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 max-w-xs">
                    {tab === "all"
                      ? "Bookings assigned to you will appear here."
                      : `You have no ${tab} bookings at the moment.`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* ── Right sidebar ── */}
            <div className="hidden lg:flex w-[280px] flex-shrink-0 flex-col gap-4 self-start">

              {/* Status overview */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Overview</p>
                <div className="space-y-3">
                  {[
                    { label: "Upcoming",  value: upcoming.length,  icon: CalendarDays, color: "text-secondary dark:text-secondary" },
                    { label: "Ongoing",   value: ongoing.length,   icon: Clock,        color: "text-emerald-500" },
                    { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-gray-400 dark:text-gray-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next session */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Next session</p>
                {nextSession ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <AvatarInitials initials={nextSession.architect_initials} size="w-10 h-10" textSize="text-xs" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{nextSession.architect_name}</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-primary dark:text-secondary">
                          {nextSession.consultation_type}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        📅 {formatScheduledDate(nextSession.scheduled_at)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-5 text-center">
                    <CalendarDays className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No upcoming sessions</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Assigned sessions will appear here.</p>
                  </div>
                )}
              </div>

              {/* Status guide */}
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Status guide</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Upcoming", desc: "Session is scheduled and confirmed.", color: "bg-secondary/20 text-primary dark:text-secondary" },
                    { label: "Ongoing",  desc: "Session is currently in progress.",   color: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
                    { label: "Completed",desc: "Session has been completed.",         color: "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400" },
                  ].map(({ label, desc, color }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5 ${color}`}>{label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
