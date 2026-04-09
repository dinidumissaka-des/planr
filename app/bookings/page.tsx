"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Star, X, BadgeCheck, Check, ChevronLeft, ChevronRight, MapPin, Briefcase, GraduationCap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { CalendarDays } from "lucide-react"
import { architects, type Architect } from "@/lib/architects"
import { AvatarInitials } from "@/components/ui/avatar-initials"

// ─── Data ─────────────────────────────────────────────────

const categories = ["Architecture", "Interior Design", "Construction", "Urban Design", "Residential Architect", "Landscape Design"]

// ─── Profile Drawer ────────────────────────────────────────

function ProfileDrawer({ architect, onClose, onSelect }: { architect: Architect; onClose: () => void; onSelect: () => void }) {
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
            <AvatarInitials initials={architect.name.split(" ").map(n => n[0]).join("")} size="w-16 h-16" textSize="text-lg" rounded="rounded-2xl" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{architect.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{architect.role}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(architect.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{architect.rating}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">({architect.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta pills */}
        <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0 flex-wrap border-b border-gray-100 dark:border-white/8">
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Briefcase className="w-3.5 h-3.5" />{architect.company}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5" />{architect.location}
          </span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* About */}
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">About</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{architect.about}</p>
          </div>

          {/* Specializations */}
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2.5">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {architect.specializations.map(s => (
                <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary/15 dark:bg-secondary/10 text-primary dark:text-secondary">{s}</span>
              ))}
            </div>
          </div>

          {/* Experience */}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
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

          {/* Reviews */}
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

        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/8 flex-shrink-0">
          <button
            onClick={() => { onSelect(); onClose() }}
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
          >
            Select {architect.name.split(" ")[0]}
          </button>
        </div>
      </div>
    </>
  )
}

type CalDay = { d: number; out?: boolean; highlight?: boolean }
const calendarWeeks: CalDay[][] = [
  [{ d: 26, out: true }, { d: 27, out: true }, { d: 28, out: true }, { d: 29, out: true }, { d: 30, out: true }, { d: 31, out: true }, { d: 1 }],
  [{ d: 2 }, { d: 3 }, { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }],
  [{ d: 9 }, { d: 10 }, { d: 11 }, { d: 12 }, { d: 13, highlight: true }, { d: 14 }, { d: 15 }],
  [{ d: 16 }, { d: 17 }, { d: 18 }, { d: 19 }, { d: 20 }, { d: 21 }, { d: 22 }],
  [{ d: 23 }, { d: 24 }, { d: 25 }, { d: 26 }, { d: 27 }, { d: 28 }, { d: 29 }],
  [{ d: 1, out: true }, { d: 2, out: true }, { d: 3, out: true }, { d: 4, out: true }, { d: 5, out: true }, { d: 6, out: true }, { d: 7, out: true }],
]
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
  architect: typeof architects[0]; dateLabel: string; timeLabel: string; leftLabel: string; rightLabel: string; onViewProfile: () => void
}) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 mb-5">
      {/* Row 1: avatar + name + view profile */}
      <div className="flex items-center gap-3 mb-4">
        <AvatarInitials initials={architect.name.split(" ").map(n => n[0]).join("")} size="w-10 h-10" textSize="text-xs" />
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{architect.name}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{architect.role}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{architect.rating} ({architect.reviewCount} Reviews)
          </p>
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
  const [step, setStep] = useState(1)
  const [firstTime, setFirstTime] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedArchitect, setSelectedArchitect] = useState<number | null>(null)
  const [autoChoose, setAutoChoose] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState<number | null>(19)
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

  const activeArchitect = architects.find(a => a.id === selectedArchitect) ?? architects[0]
  const filtered = architects.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()))
  const selectedSlotLabel = selectedSlot !== null ? timeSlots[selectedSlot] : "—"
  const [architectDot, setArchitectDot] = useState(0)
  const architectScrollRef = useRef<HTMLDivElement>(null)
  const [profileDrawer, setProfileDrawer] = useState<Architect | null>(null)

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const cardBase = "bg-white dark:bg-[#0D1B2E] border border-secondary/15 dark:border-white/8 rounded-2xl p-5 md:p-7 max-w-5xl"

  const footerContent = (onBack: (() => void) | undefined, onNext: () => void, nextLabel: string, nextDisabled: boolean) => (
    <>
      <div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="px-6 h-11 border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 dark:bg-transparent dark:hover:bg-white/5">Go back</Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1.5">
          {[1,2,3,4].map(n => (
            <div key={n} className={`rounded-full transition-all ${step === n ? "w-4 h-2 bg-gray-900 dark:bg-white" : "w-2 h-2 bg-gray-300 dark:bg-white/20"}`} />
          ))}
        </div>
        <Button
          className={`px-8 h-11 rounded-xl text-sm font-semibold ${nextDisabled ? "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed" : "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"}`}
          onClick={nextDisabled ? undefined : onNext}
        >
          {nextLabel}
        </Button>
      </div>
    </>
  )

  const StepFooter = ({ onBack, onNext, nextLabel = "Next", nextDisabled = false }: {
    onBack?: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean
  }) => (
    <>
      {/* Desktop: inline footer */}
      <div className="hidden md:flex items-center justify-between mt-7 pt-5 border-t border-gray-100 dark:border-white/8">
        {footerContent(onBack, onNext, nextLabel, nextDisabled)}
      </div>
      {/* Mobile: sticky footer above bottom nav */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white dark:bg-[#0D1B2E] border-t border-gray-100 dark:border-white/8 px-4 py-3 flex items-center justify-between">
        {footerContent(onBack, onNext, nextLabel, nextDisabled)}
      </div>
      {/* Spacer so content isn't hidden under sticky footer on mobile */}
      <div className="h-20 md:hidden" />
    </>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Booking Consultation" icon={<CalendarDays className="w-6 h-6 text-gray-700 dark:text-gray-400" />} />

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
                      key={a.id}
                      onClick={() => setSelectedArchitect(a.id)}
                      className={`flex-shrink-0 w-[72%] snap-start rounded-xl border-2 p-4 text-left transition-all ${
                        selectedArchitect === a.id
                          ? "border-gray-900 dark:border-white shadow-sm"
                          : "border-transparent shadow-sm"
                      }`}
                      style={{
                        backgroundColor: a.role === "Interior Designer" ? '#E1C1A5' : a.role === "Landscape Designer" ? '#BDC7D9' : '#81B9E9',
                        backgroundImage: "url('/grain-bg-lg.svg')",
                        backgroundBlendMode: 'screen',
                        backgroundSize: 'cover',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <AvatarInitials initials={a.name.split(" ").map(n => n[0]).join("")} size="w-12 h-12" textSize="text-sm" rounded="rounded-full" />
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedArchitect === a.id ? "border-[#07111E]" : "border-[#07111E]/30"}`}>
                          {selectedArchitect === a.id && <div className="w-2 h-2 bg-[#07111E] rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-[#07111E]/60 truncate">{a.name}</p>
                      <p className="text-sm font-bold text-[#07111E]">{a.role}</p>
                      <div className="flex items-center gap-1 text-xs text-[#07111E]/50 mb-4">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{a.rating} ({a.reviewCount} Reviews)
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        <div>
                          <p className="text-[10px] text-[#07111E]/50 mb-1">Available from:</p>
                          <span className="text-[10px] font-semibold bg-white/40 text-[#07111E] px-2 py-1 rounded-md uppercase block text-center">10TH FEB</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#07111E]/50 mb-1">Working hours:</p>
                          <span className="text-[10px] font-semibold bg-white/40 text-[#07111E] px-2 py-1 rounded-md block text-center">10AM–9PM</span>
                        </div>
                      </div>
                      <div className="border-t border-[#07111E]/10 pt-2.5 text-center">
                        <span onClick={e => { e.stopPropagation(); setProfileDrawer(a) }} className="text-xs font-medium text-[#07111E]/60 hover:text-[#07111E] transition-colors cursor-pointer">View Profile</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 mt-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`rounded-full transition-all ${architectDot === i ? 'w-4 h-1.5 bg-gray-900 dark:bg-white' : 'w-1.5 h-1.5 bg-gray-300 dark:bg-white/20'}`} />
                  ))}
                </div>
              </div>

              {/* Desktop: grid */}
              <div className="hidden md:grid grid-cols-4 gap-3 mb-5">
                {filtered.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArchitect(a.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all bg-cover bg-center ${
                      selectedArchitect === a.id
                        ? "border-gray-900 dark:border-white shadow-sm"
                        : "border-transparent shadow-sm hover:border-gray-200 dark:hover:border-white/20"
                    }`}
                    style={{
                      backgroundColor:
                        a.role === "Interior Designer"  ? '#E1C1A5' :
                        a.role === "Landscape Designer" ? '#BDC7D9' : '#81B9E9',
                      backgroundImage: "url('/grain-bg-lg.svg')",
                      backgroundBlendMode: 'screen',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <AvatarInitials initials={a.name.split(" ").map(n => n[0]).join("")} size="w-12 h-12" textSize="text-sm" />
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedArchitect === a.id ? "border-[#07111E]" : "border-[#07111E]/30"}`}>
                        {selectedArchitect === a.id && <div className="w-2 h-2 bg-[#07111E] rounded-full" />}
                      </div>
                    </div>
                    <p className="text-sm text-[#07111E]/60 truncate">{a.name}</p>
                    <p className="text-sm font-bold text-[#07111E]">{a.role}</p>
                    <div className="flex items-center gap-1 text-xs text-[#07111E]/50 mb-4">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{a.rating} ({a.reviewCount} Reviews)
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      <div>
                        <p className="text-[10px] text-[#07111E]/50 mb-1">Available from:</p>
                        <span className="text-[10px] font-semibold bg-white/40 text-[#07111E] px-2 py-1 rounded-md uppercase block text-center">10TH FEB</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#07111E]/50 mb-1">Working hours:</p>
                        <span className="text-[10px] font-semibold bg-white/40 text-[#07111E] px-2 py-1 rounded-md block text-center">10AM–9PM</span>
                      </div>
                    </div>
                    <div className="border-t border-[#07111E]/10 pt-2.5 text-center">
                      <span onClick={e => { e.stopPropagation(); setProfileDrawer(a) }} className="text-xs font-medium text-[#07111E]/60 hover:text-[#07111E] transition-colors cursor-pointer">View Profile</span>
                    </div>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={autoChoose} onCheckedChange={v => setAutoChoose(!!v)} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Please choose what suits me the best</span>
              </label>

              <StepFooter onNext={() => setStep(2)} nextDisabled={selectedArchitect === null && !autoChoose} />
            </div>
          )}

          {/* ═══ STEP 2 ═══ */}
          {step === 2 && (
            <div className={cardBase}>
              <ArchitectBar
                architect={activeArchitect}
                dateLabel="19th February" timeLabel="9AM – 9PM"
                leftLabel="Available from:" rightLabel="Working hours:"
                onViewProfile={() => setProfileDrawer(architects.find(a => a.id === activeArchitect.id) ?? null)}
              />

              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                {/* Calendar */}
                <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-4 w-full md:w-72 flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Select a date</p>
                  <div className="flex items-center justify-between mb-3">
                    <button className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">February 2020</span>
                    <button className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-7 mb-1">
                    {calDays.map(d => <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-600 py-1">{d}</div>)}
                  </div>
                  {calendarWeeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7">
                      {week.map((cell, ci) => (
                        <button
                          key={ci}
                          onClick={() => { if (!cell.out) { setSelectedDate(cell.d); setSelectedSlot(null) } }}
                          className={`text-center text-xs py-1.5 rounded-lg transition-colors font-medium ${
                            cell.out ? "text-gray-300 dark:text-gray-700 cursor-default" :
                            selectedDate === cell.d ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" :
                            cell.highlight ? "text-blue-600 font-semibold" :
                            "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8"
                          }`}
                        >
                          {cell.d}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Time slots — single column for selected date */}
                <div className="w-full md:flex-1 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                    Available times
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {selectedDate ? `February ${selectedDate}, 2020` : "Select a date first"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(i)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors text-left ${
                          selectedSlot === i
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                            : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/8"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Cannot find an appropriate date and time?{" "}
                <a href="#" className="text-orange-500 hover:underline font-medium">Call us or schedule a callback</a>
              </p>

              <StepFooter onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={selectedSlot === null} />
            </div>
          )}

          {/* ═══ STEP 3 ═══ */}
          {step === 3 && (
            <div className={cardBase}>
              <ArchitectBar
                architect={activeArchitect}
                dateLabel={selectedDate ? `Feb ${selectedDate}` : "—"} timeLabel={selectedSlotLabel}
                leftLabel="Date:" rightLabel="Time:"
                onViewProfile={() => setProfileDrawer(architects.find(a => a.id === activeArchitect.id) ?? null)}
              />

              <div className="space-y-5">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Additional notes</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Provide any additional details that would help the consultant understand your requirements better.</p>
                  </div>
                  <Textarea
                    placeholder="Additional notes"
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
                    <Input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                    <Input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Email</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">We'll send confirmation and updates to this email.</p>
                  </div>
                  <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full md:flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Mobile Number</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provide your number for urgent updates or contact.</p>
                  </div>
                  <Input placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full md:flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <Checkbox checked={agreedConsult} onCheckedChange={v => setAgreedConsult(!!v)} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to Planr{" "}
                    <a href="#" className="text-orange-500 hover:underline font-medium">Terms of Use</a>
                    {" "}and to receive electronic communication from Planr
                  </span>
                </label>
              </div>

              <StepFooter onBack={() => setStep(2)} onNext={() => setStep(4)} nextDisabled={!agreedConsult} />
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
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Card number</p>
                    <Input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm font-mono" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Expiration</p>
                      <Input placeholder="MM / YY" value={expiry} onChange={e => setExpiry(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">CVV</p>
                      <Input placeholder="000" value={cvv} onChange={e => setCvv(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">ZIP / Postal code</p>
                    <Input placeholder="00000" value={zip} onChange={e => setZip(e.target.value)} className="w-40 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                  </div>
                </div>

                <div className="space-y-3 mt-5 pt-5 border-t border-gray-100 dark:border-white/8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={saveCard} onCheckedChange={v => setSaveCard(!!v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Save card for future bookings</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={agreedPayment} onCheckedChange={v => setAgreedPayment(!!v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to Planr{" "}
                      <a href="#" className="text-orange-500 hover:underline font-medium">Terms of Use</a>
                      {" "}and to receive electronic communication from Planr
                    </span>
                  </label>
                </div>

                <StepFooter onBack={() => setStep(3)} onNext={() => setConfirmed(true)} nextLabel="Confirm & Pay" nextDisabled={!agreedPayment} />
              </div>

              {/* Booking summary */}
              <div className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-[#0D1B2E] border border-secondary/15 dark:border-white/8 rounded-2xl p-5">
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-4">Booking Summary</p>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/8">
                  <AvatarInitials initials={activeArchitect.name.split(" ").map(n => n[0]).join("")} size="w-10 h-10" textSize="text-xs" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{activeArchitect.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{activeArchitect.role}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{selectedDate ? `Feb ${selectedDate}, 2020` : "—"}</span>
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

      {profileDrawer && (
        <ProfileDrawer
          architect={profileDrawer}
          onClose={() => setProfileDrawer(null)}
          onSelect={() => setSelectedArchitect(profileDrawer.id)}
        />
      )}
    </div>
  )
}
