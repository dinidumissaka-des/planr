"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Star, X, BadgeCheck, Check, ChevronLeft, ChevronRight, MapPin, Briefcase, GraduationCap, Award, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { CalendarDays } from "lucide-react"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import { createClient } from "@/lib/supabase"
import { insertConsultation, fetchAllConsultants, type ConsultantProfile } from "@/lib/data"
import { PortfolioGallery } from "@/components/ui/portfolio-gallery"

// ─── Data ─────────────────────────────────────────────────

const categories = [
  "Architecture",
  "Interior Design",
  "Landscape Architecture",
  "Urban Design",
  "Structural Engineering",
  "Construction",
  "Quantity Surveying",
]

function cardColor(role: string): string {
  switch (role) {
    case "Interior Designer":   return '#E1C1A5'
    case "Landscape Architect": return '#BDC7D9'
    case "Urban Designer":      return '#C5C9A0'
    case "Structural Engineer": return '#B0C4B8'
    case "Contractor":          return '#D4B8A0'
    case "Quantity Surveyor":   return '#C4B4D4'
    default:                    return '#81B9E9'  // Architect
  }
}

// ─── Field Error ──────────────────────────────────────────

function FieldError({ msg }: { msg: string | undefined }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />{msg}
    </p>
  )
}

// ─── Profile Drawer ────────────────────────────────────────

function ProfileDrawer({ architect, onClose, onSelect }: { architect: ConsultantProfile; onClose: () => void; onSelect: () => void }) {
  useEffect(() => {
    function handle(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handle)
    return () => document.removeEventListener("keydown", handle)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40" onClick={onClose} />

      {/* Drawer — right side on desktop, bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-0 md:top-0 md:left-auto md:right-0 md:w-[420px] z-50 flex flex-col bg-white dark:bg-[#0D1B2E] rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-2xl max-h-[90vh] md:max-h-full overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <AvatarInitials initials={architect.display_name.split(" ").map(n => n[0]).join("")} size="w-16 h-16" textSize="text-lg" rounded="rounded-2xl" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{architect.display_name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{architect.role ?? "Consultant"}</p>
              {architect.rating > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(architect.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{architect.rating}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">({architect.review_count} reviews)</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta pills */}
        <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0 flex-wrap border-b border-gray-100 dark:border-white/8">
          {architect.company && (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Briefcase className="w-3.5 h-3.5" />{architect.company}
            </span>
          )}
          {architect.company && architect.location && <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />}
          {architect.location && (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5" />{architect.location}
            </span>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* About */}
          {architect.bio && (
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">About</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{architect.bio}</p>
            </div>
          )}

          {/* Specializations */}
          {architect.specializations?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2.5">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {architect.specializations.map(s => (
                  <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary/15 dark:bg-secondary/10 text-primary dark:text-secondary">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {architect.experience?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Experience
              </p>
              <div className="space-y-4">
                {architect.experience.map((e, i) => (
                  <div key={i} className="border-l-2 border-secondary/30 pl-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{e.company}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{e.role} · <span className="text-secondary">{e.type}</span></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{e.period}</p>
                    {e.description && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{e.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {architect.education?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </p>
              {architect.education.map((e, i) => (
                <div key={i} className="border-l-2 border-gray-200 dark:border-white/10 pl-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{e.school}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{e.dept}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{e.period}</p>
                </div>
              ))}
            </div>
          )}

          {/* Portfolio */}
          {architect.portfolio?.length > 0 && (
            <PortfolioGallery portfolio={architect.portfolio} />
          )}

          {/* Reviews */}
          {architect.reviews?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Client Reviews
              </p>
              <div className="space-y-3">
                {architect.reviews.map((r, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.name}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/8 flex-shrink-0">
          <button
            onClick={() => { onSelect(); onClose() }}
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
          >
            Select {architect.display_name.split(" ")[0]}
          </button>
        </div>
      </div>
    </>
  )
}

type CalDay = { d: number; out?: boolean; past?: boolean; today?: boolean }

function buildCalendarWeeks(year: number, month: number): CalDay[][] {
  const now = new Date()
  const todayY = now.getFullYear(), todayM = now.getMonth(), todayD = now.getDate()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const weeks: CalDay[][] = []
  let week: CalDay[] = []
  // leading days from prev month
  for (let i = 0; i < firstDow; i++) {
    week.push({ d: daysInPrev - firstDow + 1 + i, out: true })
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isPast = year < todayY || (year === todayY && month < todayM) || (year === todayY && month === todayM && d < todayD)
    const isToday = year === todayY && month === todayM && d === todayD
    week.push({ d, past: isPast, today: isToday })
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  // trailing days from next month
  if (week.length > 0) {
    let nd = 1
    while (week.length < 7) week.push({ d: nd++, out: true })
    weeks.push(week)
  }
  return weeks
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function ordinal(n: number) {
  const v = n % 100
  return n + (["th","st","nd","rd"][(v - 20) % 10] || ["th","st","nd","rd"][v] || "th")
}

const calDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

// ─── Stepper ───────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Fill in General Info" },
    { n: 2, label: "Choose Date and Time" },
    { n: 3, label: "Consultation Info" },
    { n: 4, label: "Payment" },
  ]
  return (
    <div className="flex items-center mb-6 md:mb-8 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const done = step > s.n
        const active = step === s.n
        return (
          <div key={s.n} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border-2 transition-all ${
                done    ? "bg-emerald-500 border-emerald-500 text-white" :
                active  ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900" :
                          "bg-gray-200 dark:bg-white/10 border-gray-300 dark:border-white/15 text-gray-500 dark:text-gray-500"
              }`}>
                {done ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-xs md:text-sm font-medium whitespace-nowrap hidden sm:block ${active ? "text-gray-900 dark:text-white font-bold" : done ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}`}>
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div className={`h-px w-6 md:w-12 mx-2 md:mx-3 ${step > s.n ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-white/15"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Architect Summary Bar ─────────────────────────────────

function ArchitectBar({ architect, dateLabel, timeLabel, leftLabel, rightLabel, onViewProfile }: {
  architect: ConsultantProfile; dateLabel: string; timeLabel: string; leftLabel: string; rightLabel: string; onViewProfile: () => void
}) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 mb-5">
      {/* Row 1: avatar + name + view profile */}
      <div className="flex items-center gap-3 mb-4">
        <AvatarInitials initials={architect.display_name.split(" ").map(n => n[0]).join("")} size="w-10 h-10" textSize="text-xs" />
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{architect.display_name}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{architect.role ?? "Consultant"}</p>
          {architect.rating > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{architect.rating} ({architect.review_count} Reviews)
            </p>
          )}
        </div>
        <button onClick={onViewProfile} className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0">View Profile</button>
      </div>
      {/* Row 2: date + time badges */}
      <div className="flex items-center gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{leftLabel}</p>
          <span className="text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg uppercase tracking-wide whitespace-nowrap">{dateLabel}</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{rightLabel}</p>
          <span className="text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-lg whitespace-nowrap">{timeLabel}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Success Modal ─────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-gray-600/60 dark:bg-black/70 flex items-end md:items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0D1B2E] rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md p-8 relative md:mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/8 rounded-xl flex items-center justify-center">
            <BadgeCheck className="w-10 h-10 text-yellow-400" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4">Booking Request Successful</h2>
        <div className="border-t border-gray-100 dark:border-white/8 mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-5">
          You will get a reference number to access your answer through a notification and you will receive an email when your request is approved.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Find out more at the{" "}
          <a href="#" className="text-blue-500 hover:underline font-medium">Help Center</a>
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────

export default function BookingsPage() {
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([])
  const [loadingConsultants, setLoadingConsultants] = useState(true)

  useEffect(() => {
    fetchAllConsultants().then(data => {
      setConsultants(data)
      setLoadingConsultants(false)
    })
  }, [])

  const [step, setStep] = useState(1)
  const [firstTime, setFirstTime] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedArchitect, setSelectedArchitect] = useState<string | null>(null)
  const [autoChoose, setAutoChoose] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const todayNow = new Date()
  const [calYear, setCalYear] = useState(todayNow.getFullYear())
  const [calMonth, setCalMonth] = useState(todayNow.getMonth())
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [agreedConsult, setAgreedConsult] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [zip, setZip] = useState("")
  const [agreedPayment, setAgreedPayment] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ── Availability ──────────────────────────────────────────
  const [bookedSlots, setBookedSlots] = useState<{ date: number; hour: number }[]>([])
  const [loadingAvail, setLoadingAvail] = useState(false)

  async function fetchAvailability(consultantUserId: string, year: number, month: number) {
    setLoadingAvail(true)
    try {
      const res = await fetch(`/api/availability?consultant_user_id=${consultantUserId}&year=${year}&month=${month}`)
      if (res.ok) setBookedSlots(await res.json())
    } finally {
      setLoadingAvail(false)
    }
  }

  function isSlotBooked(date: number, slotIndex: number) {
    return bookedSlots.some(b => b.date === date && b.hour === slotHours[slotIndex])
  }

  function isDateFullyBooked(date: number) {
    return slotHours.every(h => bookedSlots.some(b => b.date === date && b.hour === h))
  }

  function isDatePartiallyBooked(date: number) {
    return bookedSlots.some(b => b.date === date)
  }

  // ── Validation state ──────────────────────────────────────
  // triedNext: user clicked Next while disabled — show a banner
  const [triedNext, setTriedNext] = useState(false)
  // touched: fields the user has blurred at least once
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function touch(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Per-step validity (used by footers and to decide whether to advance)
  function step1Valid() { return selectedArchitect !== null || autoChoose }
  function step2Valid() { return selectedSlot !== null }
  function step3Valid() { return !!firstName.trim() && !!lastName.trim() && !!email.trim() && !!mobile.trim() && agreedConsult }
  function step4Valid() { return !!cardNumber.trim() && !!expiry.trim() && !!cvv.trim() && !!zip.trim() && agreedPayment }

  // Per-field error messages (only shown after the field is touched or triedNext)
  function err(field: string, condition: boolean, msg: string) {
    return (touched[field] || triedNext) && condition ? msg : undefined
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const errors = {
    firstName:  err("firstName",  !firstName.trim(),                       "First name is required"),
    lastName:   err("lastName",   !lastName.trim(),                        "Last name is required"),
    email:      err("email",      !email.trim() ? true : !emailRegex.test(email), !email.trim() ? "Email is required" : "Enter a valid email address"),
    mobile:     err("mobile",     !mobile.trim(),                          "Mobile number is required"),
    cardNumber: err("cardNumber", !cardNumber.trim(),                      "Card number is required"),
    expiry:     err("expiry",     !expiry.trim(),                          "Expiration date is required"),
    cvv:        err("cvv",        !cvv.trim(),                             "CVV is required"),
    zip:        err("zip",        !zip.trim(),                             "ZIP code is required"),
  }

  function tryAdvance(isValid: () => boolean, onNext: () => void) {
    if (isValid()) {
      setTriedNext(false)
      setTouched({})
      onNext()
    } else {
      setTriedNext(true)
    }
  }

  // ── Slot index → hour (9 AM = 9, 12 PM = 12, 1 PM = 13, …) ──
  const slotHours = [9, 10, 11, 12, 13, 14, 15, 16]

  async function handleConfirm() {
    if (!step4Valid()) { setTriedNext(true); return }
    if (submitting) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && selectedDate !== null && selectedSlot !== null) {
        const scheduled = new Date(calYear, calMonth, selectedDate, slotHours[selectedSlot], 0, 0)
        await insertConsultation(user.id, {
          consultant_user_id: activeArchitect.user_id,
          architect_name: activeArchitect.display_name,
          architect_initials: activeArchitect.display_name.split(" ").map(n => n[0]).join(""),
          consultation_type: activeArchitect.role ?? "Consultation",
          scheduled_at: scheduled.toISOString(),
          notes: notes.trim() || undefined,
          categories: selectedCategories.length ? selectedCategories : undefined,
        })
      }
    } finally {
      setSubmitting(false)
      setTriedNext(false)
      setTouched({})
      setConfirmed(true)
    }
  }

  const activeArchitect = consultants.find(a => a.user_id === selectedArchitect) ?? consultants[0]
  const filtered = consultants.filter(a => {
    const matchesSearch = search === "" ||
      a.display_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.role ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(a.category ?? "")
    return matchesSearch && matchesCategory
  })
  const selectedSlotLabel = selectedSlot !== null ? timeSlots[selectedSlot] : "—"
  const [architectDot, setArchitectDot] = useState(0)
  const architectScrollRef = useRef<HTMLDivElement>(null)
  const [profileDrawer, setProfileDrawer] = useState<ConsultantProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  function openProfile(a: ConsultantProfile | null | undefined) {
    if (!a) return
    setProfileLoading(true)
    setTimeout(() => { setProfileLoading(false); setProfileDrawer(a) }, 80)
  }

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const cardBase = "bg-white dark:bg-[#0D1B2E] border border-secondary/15 dark:border-white/8 rounded-2xl p-5 md:p-7 max-w-5xl"

  // Step-level hint messages shown in the banner when the user clicks Next while invalid
  const stepHints: Record<number, string> = {
    1: "Please select a consultant to continue.",
    2: "Please choose a date and time slot to continue.",
    3: "Please fill in all required fields and agree to the terms.",
    4: "Please complete your payment details and agree to the terms.",
  }

  // Proactive hint shown near the Next button before the user clicks
  function getStepHint(): string | null {
    switch (step) {
      case 1:
        if (step1Valid()) return null
        return "Select a consultant to continue"
      case 2:
        if (step2Valid()) return null
        if (!selectedDate && selectedSlot === null) return "Pick a date and time slot"
        if (!selectedDate) return "Pick a date to continue"
        return "Pick a time slot to continue"
      case 3:
        if (step3Valid()) return null
        if (!firstName.trim() || !lastName.trim()) return "Enter your full name to continue"
        if (!email.trim() || !emailRegex.test(email)) return "Enter a valid email address"
        if (!mobile.trim()) return "Enter your mobile number"
        return "Agree to the Terms of Use to continue"
      case 4:
        if (step4Valid()) return null
        if (!cardNumber.trim()) return "Enter your card number"
        if (!expiry.trim() || !cvv.trim()) return "Enter your card expiry and CVV"
        if (!zip.trim()) return "Enter your ZIP / postal code"
        return "Agree to the Terms of Use to continue"
      default:
        return null
    }
  }

  const footerContent = (onBack: (() => void) | undefined, onNext: () => void, nextLabel: string, hint: string | null) => (
    <>
      <div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="px-6 h-11 border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 dark:bg-transparent dark:hover:bg-white/5">Go back</Button>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1,2,3,4].map(n => (
              <div key={n} className={`rounded-full transition-all ${step === n ? "w-4 h-2 bg-gray-900 dark:bg-white" : "w-2 h-2 bg-gray-300 dark:bg-white/20"}`} />
            ))}
          </div>
          <Button
            className="px-8 h-11 rounded-xl text-sm font-semibold bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"
            onClick={onNext}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </>
  )

  const StepFooter = ({ onBack, onNext, nextLabel = "Next" }: {
    onBack?: () => void; onNext: () => void; nextLabel?: string
  }) => {
    const hint = getStepHint()
    return (
      <>
        {/* Validation banner — shown only after the user has clicked Next once */}
        {triedNext && (
          <div className="flex items-center gap-2 mt-5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{stepHints[step]}</p>
          </div>
        )}
        {/* Desktop: inline footer */}
        <div className="hidden md:flex items-center justify-between mt-5 pt-5 border-t border-gray-100 dark:border-white/8">
          {footerContent(onBack, onNext, nextLabel, hint)}
        </div>
        {/* Mobile: sticky footer above bottom nav */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white dark:bg-[#0D1B2E] border-t border-gray-100 dark:border-white/8 px-4 py-3 flex items-center justify-between">
          {footerContent(onBack, onNext, nextLabel, hint)}
        </div>
        {/* Spacer so content isn't hidden under sticky footer on mobile */}
        <div className="h-20 md:hidden" />
      </>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Booking Consultation" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Stepper step={step} />

          {/* ═══ STEP 1 ═══ */}
          {step === 1 && (
            <div className={cardBase}>

              {/* First time toggle */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gray-100 dark:border-white/8 mb-6">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">First time consulting?</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">If this is your first time scheduling a consultation, we'll guide you through each step to ensure you get the most out of your session.</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Switch checked={firstTime} onCheckedChange={setFirstTime} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{firstTime ? "Yes" : "No"}</span>
                </div>
              </div>

              {/* Category selection — full width tags below description */}
              <div className="pb-6 border-b border-gray-100 dark:border-white/8 mb-6">
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Select an area you want information in</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">This helps us match you with the right professional based on your needs and questions.</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        selectedCategories.includes(cat)
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                          : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultant list */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Consultant list</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Browse and select the consultant that fits your needs.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-10 text-sm"
                  />
                </div>
              </div>

              {/* Mobile: horizontal scroll with dots */}
              <div className="md:hidden mb-5">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                    <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No consultants found</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Try a different name or role.</p>
                  </div>
                ) : (
                <>
                <div
                  ref={architectScrollRef}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                  onScroll={e => {
                    const el = e.currentTarget
                    const progress = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)
                    setArchitectDot(Math.min(2, Math.floor(progress * 3 + 0.1)))
                  }}
                >
                  {filtered.map(a => (
                    <button
                      key={a.user_id}
                      onClick={() => setSelectedArchitect(a.user_id)}
                      className={`flex-shrink-0 w-[72%] snap-start rounded-xl border-2 p-4 text-left transition-all ${
                        selectedArchitect === a.user_id
                          ? "border-gray-900 dark:border-white shadow-sm"
                          : "border-transparent shadow-sm"
                      }`}
                      style={{
                        backgroundColor: cardColor(a.role ?? ""),
                        backgroundImage: "url('/grain-bg-lg.svg')",
                        backgroundBlendMode: 'screen',
                        backgroundSize: 'cover',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <AvatarInitials initials={a.display_name.split(" ").map(n => n[0]).join("")} size="w-12 h-12" textSize="text-sm" rounded="rounded-full" />
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedArchitect === a.user_id ? "border-[#07111E]" : "border-[#07111E]/30"}`}>
                          {selectedArchitect === a.user_id && <div className="w-2 h-2 bg-[#07111E] rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-[#07111E]/60 truncate">{a.display_name}</p>
                      <p className="text-sm font-bold text-[#07111E]">{a.role ?? "Consultant"}</p>
                      {a.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[#07111E]/50 mb-4">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{a.rating} ({a.review_count} Reviews)
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-1.5 mb-3 mt-2">
                        <div>
                          <p className="text-[10px] text-[#07111E]/50 mb-1">Working hours:</p>
                          <span className="text-[10px] font-semibold bg-white/40 text-[#07111E] px-2 py-1 rounded-md block text-center">{a.working_hours ?? "Contact to confirm"}</span>
                        </div>
                      </div>
                      <div className="border-t border-[#07111E]/10 pt-2.5 text-center">
                        <span onClick={e => { e.stopPropagation(); openProfile(a) }} className="text-xs font-medium text-[#07111E]/60 hover:text-[#07111E] transition-colors cursor-pointer">View Profile</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 mt-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`rounded-full transition-all ${architectDot === i ? 'w-4 h-1.5 bg-gray-900 dark:bg-white' : 'w-1.5 h-1.5 bg-gray-300 dark:bg-white/20'}`} />
                  ))}
                </div>
                </>
                )}
              </div>

              {/* Desktop: grid */}
              {filtered.length === 0 ? (
                <div className="hidden md:flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-gray-200 dark:border-white/10 mb-5">
                  <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No consultants found</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Try a different name or role.</p>
                </div>
              ) : (
              <div className="hidden md:grid grid-cols-4 gap-3 mb-5">
                {loadingConsultants ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl h-52 bg-gray-100 dark:bg-white/5 animate-pulse" />
                  ))
                ) : (
                  filtered.map(a => (
                    <button
                      key={a.user_id}
                      onClick={() => setSelectedArchitect(a.user_id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all bg-cover bg-center ${
                        selectedArchitect === a.user_id
                          ? "border-gray-900 dark:border-white shadow-sm"
                          : "border-transparent shadow-sm hover:border-gray-200 dark:hover:border-white/20"
                      }`}
                      style={{
                        backgroundColor: cardColor(a.role ?? ""),
                        backgroundImage: "url('/grain-bg-lg.svg')",
                        backgroundBlendMode: 'screen',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <AvatarInitials initials={a.display_name.split(" ").map(n => n[0]).join("")} size="w-12 h-12" textSize="text-sm" />
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedArchitect === a.user_id ? "border-[#07111E]" : "border-[#07111E]/30"}`}>
                          {selectedArchitect === a.user_id && <div className="w-2 h-2 bg-[#07111E] rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-[#07111E]/60 truncate">{a.display_name}</p>
                      <p className="text-sm font-bold text-[#07111E]">{a.role ?? "Consultant"}</p>
                      {a.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[#07111E]/50 mb-2">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{a.rating} ({a.review_count} Reviews)
                        </div>
                      )}
                      <div className="mb-3 mt-2">
                        <p className="text-[10px] text-[#07111E]/50 mb-1">Working hours:</p>
                        <span className="text-[10px] font-semibold bg-white/40 text-[#07111E] px-2 py-1 rounded-md block text-center">{a.working_hours ?? "Contact to confirm"}</span>
                      </div>
                      <div className="border-t border-[#07111E]/10 pt-2.5 text-center">
                        <span onClick={e => { e.stopPropagation(); openProfile(a) }} className="text-xs font-medium text-[#07111E]/60 hover:text-[#07111E] transition-colors cursor-pointer">View Profile</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={autoChoose} onCheckedChange={v => setAutoChoose(!!v)} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Please choose what suits me the best</span>
              </label>

              <StepFooter onNext={() => tryAdvance(step1Valid, () => {
                setStep(2)
                const archId = autoChoose ? (consultants[0]?.user_id ?? "") : (selectedArchitect ?? consultants[0]?.user_id ?? "")
                if (archId) fetchAvailability(archId, calYear, calMonth)
              })} />
            </div>
          )}

          {/* ═══ STEP 2 ═══ */}
          {step === 2 && (
            <div className={cardBase}>
              <ArchitectBar
                architect={activeArchitect}
                dateLabel={selectedDate ? `${ordinal(selectedDate)} ${MONTHS[calMonth]}` : "Not selected"}
                timeLabel={selectedSlotLabel}
                leftLabel="Selected date:" rightLabel="Selected time:"
                onViewProfile={() => openProfile(activeArchitect)}
              />

              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                {/* Calendar */}
                <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-4 w-full md:w-72 flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Select a date</p>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => {
                        const d = new Date(calYear, calMonth - 1, 1)
                        const now = new Date()
                        if (d >= new Date(now.getFullYear(), now.getMonth(), 1)) {
                          setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); setSelectedDate(null); setSelectedSlot(null)
                          fetchAvailability(activeArchitect.user_id, d.getFullYear(), d.getMonth())
                        }
                      }}
                      className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{MONTHS[calMonth]} {calYear}</span>
                    <button
                      onClick={() => {
                        const d = new Date(calYear, calMonth + 1, 1)
                        setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); setSelectedDate(null); setSelectedSlot(null)
                        fetchAvailability(activeArchitect.user_id, d.getFullYear(), d.getMonth())
                      }}
                      className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 mb-1">
                    {calDays.map(d => <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-600 py-1">{d}</div>)}
                  </div>
                  {buildCalendarWeeks(calYear, calMonth).map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7">
                      {week.map((cell, ci) => {
                        const fullyBooked = !cell.out && !cell.past && isDateFullyBooked(cell.d)
                        const partiallyBooked = !cell.out && !cell.past && !fullyBooked && isDatePartiallyBooked(cell.d)
                        return (
                          <button
                            key={ci}
                            disabled={!!cell.out || !!cell.past || fullyBooked}
                            onClick={() => { setSelectedDate(cell.d); setSelectedSlot(null) }}
                            className={`relative text-center text-xs py-1.5 rounded-lg transition-colors font-medium ${
                              cell.out || cell.past ? "text-gray-300 dark:text-gray-700 cursor-default" :
                              fullyBooked ? "text-gray-300 dark:text-gray-600 cursor-not-allowed line-through" :
                              selectedDate === cell.d ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" :
                              cell.today ? "ring-1 ring-gray-900 dark:ring-white text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/8" :
                              "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8"
                            }`}
                          >
                            {cell.d}
                            {partiallyBooked && selectedDate !== cell.d && (
                              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Time slots — single column for selected date */}
                <div className="w-full md:flex-1 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                    Available times
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {selectedDate ? `${MONTHS[calMonth]} ${selectedDate}, ${calYear}` : "Select a date first"}
                  </p>
                  {loadingAvail ? (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((_, i) => (
                        <div key={i} className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse h-11" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot, i) => {
                        const booked = selectedDate !== null && isSlotBooked(selectedDate, i)
                        return (
                          <button
                            key={i}
                            disabled={!selectedDate || booked}
                            onClick={() => setSelectedSlot(i)}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors text-left ${
                              booked
                                ? "bg-gray-50 dark:bg-white/3 text-gray-300 dark:text-gray-700 border border-gray-100 dark:border-white/5 cursor-not-allowed line-through"
                                : selectedSlot === i
                                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                  : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/8"
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Cannot find an appropriate date and time?{" "}
                <a href="#" className="text-orange-500 hover:underline font-medium">Call us or schedule a callback</a>
              </p>

              <StepFooter onBack={() => { setTriedNext(false); setStep(1) }} onNext={() => tryAdvance(step2Valid, () => setStep(3))} />
            </div>
          )}

          {/* ═══ STEP 3 ═══ */}
          {step === 3 && (
            <div className={cardBase}>
              <ArchitectBar
                architect={activeArchitect}
                dateLabel={selectedDate ? `${ordinal(selectedDate)} ${MONTHS[calMonth]}` : "—"} timeLabel={selectedSlotLabel}
                leftLabel="Date:" rightLabel="Time:"
                onViewProfile={() => openProfile(activeArchitect)}
              />

              <div className="space-y-5">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <label htmlFor="notes" className="text-sm font-bold text-gray-800 dark:text-white mb-0.5 block">Additional notes</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Provide any additional details that would help the consultant understand your requirements better.</p>
                  </div>
                  <Textarea
                    id="notes"
                    placeholder="e.g. I need advice on extending my kitchen into the garden"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full md:flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 resize-none min-h-[130px] text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">First name &amp; last name</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enter your full name for identification.</p>
                  </div>
                  <div className="w-full md:flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">First name</label>
                      <Input
                        id="firstName"
                        placeholder="Jane"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        onBlur={() => touch("firstName")}
                        className={`bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.firstName ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                      />
                      <FieldError msg={errors.firstName} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Last name</label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        onBlur={() => touch("lastName")}
                        className={`bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.lastName ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                      />
                      <FieldError msg={errors.lastName} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <label htmlFor="email" className="text-sm font-bold text-gray-800 dark:text-white mb-0.5 block">Email</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">We'll send confirmation and updates to this email.</p>
                  </div>
                  <div className="w-full md:flex-1">
                    <Input
                      id="email"
                      placeholder="jane@example.com"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => touch("email")}
                      className={`w-full bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.email ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                    />
                    <FieldError msg={errors.email} />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <label htmlFor="mobile" className="text-sm font-bold text-gray-800 dark:text-white mb-0.5 block">Mobile Number</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provide your number for urgent updates or contact.</p>
                  </div>
                  <div className="w-full md:flex-1">
                    <Input
                      id="mobile"
                      placeholder="+1 (555) 000-0000"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      onBlur={() => touch("mobile")}
                      className={`w-full bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.mobile ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                    />
                    <FieldError msg={errors.mobile} />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={agreedConsult} onCheckedChange={v => setAgreedConsult(!!v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to Planr{" "}
                      <a href="#" className="text-orange-500 hover:underline font-medium">Terms of Use</a>
                      {" "}and to receive electronic communication from Planr
                    </span>
                  </label>
                  {triedNext && !agreedConsult && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-6">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />You must agree to the Terms of Use to continue
                    </p>
                  )}
                </div>
              </div>

              <StepFooter onBack={() => { setTriedNext(false); setTouched({}); setStep(2) }} onNext={() => tryAdvance(step3Valid, () => setStep(4))} />
            </div>
          )}

          {/* ═══ STEP 4 ═══ */}
          {step === 4 && (
            <div className="max-w-5xl flex flex-col lg:flex-row gap-5 items-start">

              {/* Payment form */}
              <div className="flex-1 bg-white dark:bg-[#0D1B2E] border border-secondary/15 dark:border-white/8 rounded-2xl p-5 md:p-7">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-5">Payment details</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">Card number</label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      onBlur={() => touch("cardNumber")}
                      className={`bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm font-mono ${errors.cardNumber ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                    />
                    <FieldError msg={errors.cardNumber} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="expiry" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">Expiration</label>
                      <Input
                        id="expiry"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        onBlur={() => touch("expiry")}
                        className={`bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.expiry ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                      />
                      <FieldError msg={errors.expiry} />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">CVV</label>
                      <Input
                        id="cvv"
                        placeholder="000"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        onBlur={() => touch("cvv")}
                        className={`bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.cvv ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                      />
                      <FieldError msg={errors.cvv} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="zip" className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">ZIP / Postal code</label>
                    <Input
                      id="zip"
                      placeholder="00000"
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      onBlur={() => touch("zip")}
                      className={`w-40 bg-white dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm ${errors.zip ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400" : "border-gray-200 dark:border-white/10"}`}
                    />
                    <FieldError msg={errors.zip} />
                  </div>
                </div>

                <div className="space-y-3 mt-5 pt-5 border-t border-gray-100 dark:border-white/8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={saveCard} onCheckedChange={v => setSaveCard(!!v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Save card for future bookings</span>
                  </label>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={agreedPayment} onCheckedChange={v => setAgreedPayment(!!v)} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to Planr{" "}
                        <a href="#" className="text-orange-500 hover:underline font-medium">Terms of Use</a>
                        {" "}and to receive electronic communication from Planr
                      </span>
                    </label>
                    {triedNext && !agreedPayment && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 ml-6">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />You must agree to the Terms of Use to continue
                      </p>
                    )}
                  </div>
                </div>

                <StepFooter onBack={() => { setTriedNext(false); setTouched({}); setStep(3) }} onNext={handleConfirm} nextLabel={submitting ? "Processing…" : "Confirm & Pay"} />
              </div>

              {/* Booking summary */}
              <div className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-[#0D1B2E] border border-secondary/15 dark:border-white/8 rounded-2xl p-5">
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-4">Booking Summary</p>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/8">
                  <AvatarInitials initials={activeArchitect?.display_name.split(" ").map(n => n[0]).join("") ?? "?"} size="w-10 h-10" textSize="text-xs" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{activeArchitect?.display_name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{activeArchitect?.role ?? "Consultant"}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{selectedDate ? `${MONTHS[calMonth]} ${selectedDate}, ${calYear}` : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Time</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{selectedSlotLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-800 dark:text-white">1 hour</span>
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Category</span>
                      <span className="font-semibold text-gray-800 dark:text-white text-right max-w-[140px]">{selectedCategories[0]}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 dark:border-white/8 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Consultation fee</span>
                    <span className="font-semibold text-gray-800 dark:text-white">$120.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Platform fee</span>
                    <span className="font-semibold text-gray-800 dark:text-white">$5.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100 dark:border-white/8">
                    <span className="text-gray-800 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">$125.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmed && <SuccessModal onClose={() => { setConfirmed(false); window.location.href = "/dashboard" }} />}

      {profileLoading && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
      )}

      {profileDrawer && (
        <ProfileDrawer
          architect={profileDrawer}
          onClose={() => setProfileDrawer(null)}
          onSelect={() => setSelectedArchitect(profileDrawer.user_id)}
        />
      )}
    </div>
  )
}
