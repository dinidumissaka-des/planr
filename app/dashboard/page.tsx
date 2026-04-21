"use client"

import {
  MoreHorizontal, ArrowUpRight, MessageCircle,
  CalendarCheck, Clock, Plus, Loader2, X, Wallet, Calendar, XCircle,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { createClient } from "@/lib/supabase"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import {
  fetchConsultations,
  fetchRecentQuestions,
  fetchBudgetEntries,
  addBudgetEntry,
  deleteBudgetEntry,
  cancelConsultation,
  rescheduleConsultation,
  formatScheduledDate,
  timeAgo,
  BUDGET_RANGE_DEFAULTS,
  BUDGET_CATEGORY_CONFIG,
  type Consultation,
  type RecentQuestion,
  type BudgetEntry,
  type BudgetCategory,
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
  const href = row.architect_id ? `/consultants/${row.architect_id}` : "/bookings"
  return <Link href={href}>{inner}</Link>
}

// ─── Budget Tracker ──────────────────────────────────────

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

function BudgetTracker({ userId, budgetRange }: { userId: string; budgetRange: string }) {
  const [entries, setEntries]       = useState<BudgetEntry[]>([])
  const [budgetCap, setBudgetCap]   = useState(0)
  const [loading, setLoading]       = useState(true)
  const [editingCap, setEditingCap] = useState(false)
  const [capInput, setCapInput]     = useState("")
  const [showModal, setShowModal]   = useState(false)
  const [newCat, setNewCat]         = useState<BudgetCategory>("architecture")
  const [newDesc, setNewDesc]       = useState("")
  const [newAmt, setNewAmt]         = useState("")
  const [newDate, setNewDate]       = useState(new Date().toISOString().split("T")[0])
  const [adding, setAdding]         = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const stored = user?.user_metadata?.budget_amount
      const fallback = BUDGET_RANGE_DEFAULTS[budgetRange] ?? 150_000
      const cap = stored ?? fallback
      setBudgetCap(cap)
      setCapInput(String(cap))
      setEntries(await fetchBudgetEntries(userId))
      setLoading(false)
    }
    load()
  }, [userId, budgetRange])

  const totalSpent = entries.reduce((s, e) => s + e.amount, 0)
  const remaining  = budgetCap - totalSpent
  const pct        = budgetCap > 0 ? Math.min(100, Math.round((totalSpent / budgetCap) * 100)) : 0
  const barColor   = pct >= 90 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "var(--color-secondary, #6366f1)"

  const categoryTotals = (Object.keys(BUDGET_CATEGORY_CONFIG) as BudgetCategory[])
    .map(cat => ({ cat, ...BUDGET_CATEGORY_CONFIG[cat], total: entries.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0) }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)

  async function saveCap() {
    const val = parseFloat(capInput)
    if (isNaN(val) || val <= 0) { setCapInput(String(budgetCap)); setEditingCap(false); return }
    setBudgetCap(val)
    setEditingCap(false)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { budget_amount: val } })
  }

  async function handleAdd() {
    const amt = parseFloat(newAmt)
    if (!newDesc.trim() || isNaN(amt) || amt <= 0) return
    setAdding(true)
    const entry = await addBudgetEntry(userId, { category: newCat, description: newDesc.trim(), amount: amt, entry_date: newDate })
    if (entry) setEntries(prev => [entry, ...prev])
    setAdding(false)
    setShowModal(false)
    setNewDesc(""); setNewAmt(""); setNewDate(new Date().toISOString().split("T")[0])
  }

  async function handleDelete(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
    await deleteBudgetEntry(id, userId)
  }

  return (
    <>
      <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Budget Tracker</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Log expense
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300 dark:text-gray-700" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Progress side */}
            <div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpent)}</p>
                <span className="text-sm text-gray-400 dark:text-gray-500">of</span>
                {editingCap ? (
                  <input
                    value={capInput}
                    onChange={e => setCapInput(e.target.value)}
                    onBlur={saveCap}
                    onKeyDown={e => { if (e.key === "Enter") saveCap(); if (e.key === "Escape") { setCapInput(String(budgetCap)); setEditingCap(false) } }}
                    className="w-24 text-sm font-semibold bg-transparent border-b border-secondary focus:outline-none text-gray-700 dark:text-gray-300"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setEditingCap(true)}
                    title="Click to edit budget"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-secondary transition-colors"
                  >
                    {formatCurrency(budgetCap)}
                  </button>
                )}
              </div>

              <div className="h-2.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
              </div>

              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium ${remaining < 0 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                  {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over budget`}
                </p>
                <p className={`text-xs font-bold tabular-nums ${pct >= 90 ? "text-red-500" : pct >= 75 ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`}>{pct}%</p>
              </div>

              {/* Recent entries */}
              {entries.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {entries.slice(0, 3).map(e => (
                    <div key={e.id} className="group flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${BUDGET_CATEGORY_CONFIG[e.category].dotColor}`} />
                      <span className="flex-1 text-gray-600 dark:text-gray-400 truncate">{e.description}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">{formatCurrency(e.amount)}</span>
                      <button onClick={() => handleDelete(e.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {entries.length > 3 && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 pt-0.5">{entries.length - 3} more entries</p>
                  )}
                </div>
              )}
            </div>

            {/* Category side */}
            {categoryTotals.length > 0 ? (
              <div className="sm:border-l sm:border-gray-100 sm:dark:border-white/8 sm:pl-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-3">By category</p>
                <div className="space-y-3">
                  {categoryTotals.map(c => (
                    <div key={c.cat}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dotColor}`} />
                          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{c.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-2 flex-shrink-0 tabular-nums">{formatCurrency(c.total)}</span>
                      </div>
                      <div className="h-1 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${totalSpent > 0 ? Math.round((c.total / totalSpent) * 100) : 0}%`, backgroundColor: barColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center sm:border-l sm:border-gray-100 sm:dark:border-white/8 sm:pl-6">
                <Wallet className="w-7 h-7 text-gray-200 dark:text-gray-700 mb-2" />
                <p className="text-xs font-medium text-gray-400 dark:text-gray-600">No expenses yet</p>
                <p className="text-[10px] text-gray-300 dark:text-gray-700 mt-0.5 leading-relaxed">Log invoices, payments, and fees to track your spend</p>
                <button onClick={() => setShowModal(true)} className="text-xs font-semibold text-secondary mt-3 hover:opacity-70 transition-opacity">Log first expense →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Log expense modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Log Expense</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Category</label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value as BudgetCategory)}
                  className="h-11 w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                >
                  {(Object.keys(BUDGET_CATEGORY_CONFIG) as BudgetCategory[]).map(v => (
                    <option key={v} value={v}>{BUDGET_CATEGORY_CONFIG[v].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Description *</label>
                <input
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Foundation pour, Architect consultation"
                  className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Amount ($) *</label>
                  <input
                    type="number" min="0" step="1"
                    value={newAmt}
                    onChange={e => setNewAmt(e.target.value)}
                    placeholder="0"
                    className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={adding || !newDesc.trim() || !newAmt}
                className="flex-1 h-11 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {adding ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : "Log Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Reschedule Modal (client) ────────────────────────────

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
const SLOT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16]
const TODAY_STR  = new Date().toISOString().split("T")[0]

function RescheduleModal({
  booking,
  onConfirm,
  onClose,
}: {
  booking: Consultation
  onConfirm: (newIso: string) => Promise<void>
  onClose: () => void
}) {
  const [date, setDate]   = useState("")
  const [slot, setSlot]   = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleConfirm() {
    if (!date || slot === null) return
    setSaving(true)
    const d = new Date(`${date}T${String(SLOT_HOURS[slot]).padStart(2, "0")}:00:00`)
    await onConfirm(d.toISOString())
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Reschedule Booking</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{booking.architect_name} · {booking.consultation_type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">New date</label>
            <input
              type="date"
              min={TODAY_STR}
              value={date}
              onChange={e => { setDate(e.target.value); setSlot(null) }}
              className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>
          {date && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">New time</label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSlot(i)}
                    className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      slot === i
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/8 hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
          >
            Go back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!date || slot === null || saving}
            className="flex-1 h-11 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/40 dark:border-gray-400/40 border-t-white dark:border-t-gray-900 animate-spin" /> Saving…</>
              : "Confirm Reschedule"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

function CancelModal({
  booking,
  onConfirm,
  onClose,
}: {
  booking: Consultation
  onConfirm: () => Promise<void>
  onClose: () => void
}) {
  const [cancelling, setCancelling] = useState(false)

  async function handleConfirm() {
    setCancelling(true)
    await onConfirm()
    setCancelling(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-sm rounded-t-3xl md:rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Cancel Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Are you sure you want to cancel this booking?</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{booking.architect_name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">{booking.consultation_type} · {formatScheduledDate(booking.scheduled_at)}</p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
          >
            Go back
          </button>
          <button
            onClick={handleConfirm}
            disabled={cancelling}
            className="flex-1 h-11 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {cancelling
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Cancelling…</>
              : "Confirm Cancel"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading]             = useState(true)
  const [userName, setUserName]           = useState("")
  const [userId, setUserId]               = useState("")
  const [budgetRange, setBudgetRange]     = useState("")
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])
  const [cancelTarget, setCancelTarget]         = useState<Consultation | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<Consultation | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      if (user.user_metadata?.role === "consultant") {
        router.replace("/consultant/dashboard")
        return
      }

      setUserId(user.id)
      setBudgetRange(user.user_metadata?.budget_range ?? "")
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

  async function handleCancel(booking: Consultation) {
    await cancelConsultation(booking.id, booking.consultant_user_id)
    setConsultations(prev => prev.map(c => c.id === booking.id ? { ...c, status: "cancelled" as const } : c))
    setCancelTarget(null)
  }

  async function handleReschedule(booking: Consultation, newIso: string) {
    await rescheduleConsultation(booking.id, newIso, booking.consultant_user_id)
    setConsultations(prev => prev.map(c => c.id === booking.id ? { ...c, scheduled_at: newIso, status: "upcoming" as const } : c))
    setRescheduleTarget(null)
  }

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
    <>
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

              {/* ── Budget Tracker ── */}
              {userId && <BudgetTracker userId={userId} budgetRange={budgetRange} />}

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
                    <img src="/ai-icon.svg" alt="Planr AI" width={18} height={18} className="rounded-full flex-shrink-0" />
                    <p className="text-xs font-semibold text-primary dark:text-white">Try the Planr AI for instant answers</p>
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
                    <Link href={nextUpcoming.architect_id ? `/consultants/${nextUpcoming.architect_id}` : "/bookings"} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
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
                  <>
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                      <CalendarCheck className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nothing scheduled</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">You have no upcoming consultations booked.</p>
                    </div>
                    <Link href="/bookings" className="block w-full text-center border border-gray-900 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl transition-colors">
                      Book a consultation
                    </Link>
                  </>
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
                  <div key={row.id} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0 group">
                    <Link href={row.architect_id ? `/consultants/${row.architect_id}` : "/bookings"} className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                      <Avatar initials={row.architect_initials} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{row.architect_name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600">{formatScheduledDate(row.scheduled_at)}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setRescheduleTarget(row)}
                        title="Reschedule"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCancelTarget(row)}
                        title="Cancel"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-primary dark:text-secondary whitespace-nowrap">{row.consultation_type}</span>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-5">No upcoming consultations.</p>
                )}
              </div>

              {/* Planr AI CTA */}
              <div
                className="rounded-2xl pt-5 px-5 text-white relative overflow-hidden self-start w-full"
                style={{
                  paddingBottom: '20px',
                  backgroundImage: `url('/bg-gradient.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
                  backgroundBlendMode: 'overlay',
                  backgroundSize: 'cover, cover',
                }}
              >
                <div className="mb-4">
                  <img src="/ai-icon.svg" alt="Planr AI" width={36} height={36} className="rounded-full" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-base font-bold">Planr AI</p>
                  <span className="text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded-full">Beta</span>
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-5">
                  Get instant answers about architecture, permits, costs, and timelines — available 24/7.
                </p>
                <Link
                  href="/question-answer?tab=ai"
                  className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  Try Planr AI
                </Link>
              </div>

              {/* Referral CTA */}
              <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(219,207,99,0.18)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A89A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/><path d="m16 2 6 6-9 9-4 1 1-4z"/></svg>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Invite a friend</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  Know someone who's building? Refer them and you both get a month free.
                </p>
                <Link
                  href="/referral"
                  className="block w-full text-center bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Get your referral link
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    {cancelTarget && (
      <CancelModal
        booking={cancelTarget}
        onConfirm={() => handleCancel(cancelTarget)}
        onClose={() => setCancelTarget(null)}
      />
    )}

    {rescheduleTarget && (
      <RescheduleModal
        booking={rescheduleTarget}
        onConfirm={(newIso) => handleReschedule(rescheduleTarget, newIso)}
        onClose={() => setRescheduleTarget(null)}
      />
    )}
    </>
  )
}
