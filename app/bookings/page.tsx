"use client"

import { useState } from "react"
import { Search, Star, X, BadgeCheck, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

// ─── Data ─────────────────────────────────────────────────

const categories = ["Architecture", "Interior Design", "Construction", "Urban Design", "Residential Architect", "Landscape Design"]

const architects = [
  { id: 1, name: "Kaiya Rosser",    role: "Architect",          rating: 4.9, reviews: 12, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
  { id: 2, name: "Hanna Aminoff",   role: "Interior Designer",  rating: 3.2, reviews: 12, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
  { id: 3, name: "Kierra Vetrovs",  role: "Interior Designer",  rating: 4.3, reviews: 12, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80" },
  { id: 4, name: "James Harrington",role: "Landscape Designer", rating: 4.9, reviews: 12, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
]

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
const timeDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = ["9 AM - 10 PM", "10 AM - 11 PM", "11 AM - 12 PM", "12 PM - 13 PM", "13 PM - 14 PM", "14 PM - 15 PM", "15 PM - 16 PM", "16 PM - 17 PM"]

// ─── Stepper ───────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Fill in General Info" },
    { n: 2, label: "Choose Date and time" },
    { n: 3, label: "Consultation Info" },
    { n: 4, label: "Payment" },
  ]
  return (
    <div className="flex items-center mb-8">
      {steps.map((s, i) => {
        const done = step > s.n
        const active = step === s.n
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border-2 transition-all ${
                done    ? "bg-emerald-500 border-emerald-500 text-white" :
                active  ? "bg-white dark:bg-[#0D1B2E] border-gray-900 dark:border-white text-gray-900 dark:text-white" :
                          "bg-white dark:bg-[#0D1B2E] border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-600"
              }`}>
                {done ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${active ? "text-gray-900 dark:text-white font-bold" : done ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}`}>
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div className={`h-px w-12 mx-3 ${step > s.n ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-white/15"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Architect Summary Bar ─────────────────────────────────

function ArchitectBar({ architect, dateLabel, timeLabel, leftLabel, rightLabel }: {
  architect: typeof architects[0]; dateLabel: string; timeLabel: string; leftLabel: string; rightLabel: string
}) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 flex items-center gap-6 mb-5">
      <img src={architect.photo} alt={architect.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">{architect.name}</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">{architect.role}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{architect.rating} ({architect.reviews} Reviews)
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{leftLabel}</p>
          <span className="text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg uppercase tracking-wide">{dateLabel}</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{rightLabel}</p>
          <span className="text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-lg">{timeLabel}</span>
        </div>
      </div>
      <button className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ml-4 flex-shrink-0">View Profile</button>
    </div>
  )
}

// ─── Success Modal ─────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-gray-600/60 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl shadow-2xl w-full max-w-md p-8 relative mx-4">
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
          You will get a reference number to access your answer through a notification and you will receive an email when your request is approved
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
  const [selectedSlot, setSelectedSlot] = useState<[number, number] | null>(null)
  const [nightTime, setNightTime] = useState(false)
  const [notes, setNotes] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [agreedConsult, setAgreedConsult] = useState(false)
  const [cardEmail, setCardEmail] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [zip, setZip] = useState("")
  const [agreedPayment, setAgreedPayment] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const activeArchitect = architects.find(a => a.id === selectedArchitect) ?? architects[0]
  const filtered = architects.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()))

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const StepFooter = ({ onBack, onNext, nextLabel = "Next", nextDisabled = false }: {
    onBack?: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean
  }) => (
    <div className="flex items-center justify-between mt-7 pt-5 border-t border-emerald-100 dark:border-white/8">
      <div className="flex items-center gap-3">
        {onBack ? (
          <Button variant="outline" onClick={onBack} className="px-6 h-11 border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 dark:bg-transparent dark:hover:bg-white/5">Go back</Button>
        ) : <div />}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1.5">
          {[1,2,3,4].map(n => (
            <div key={n} className={`w-2 h-2 rounded-full transition-colors ${step === n ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-white/20"}`} />
          ))}
        </div>
        <Button
          className={`px-8 h-11 rounded-xl text-sm font-semibold ${nextDisabled ? "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed" : "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"}`}
          onClick={nextDisabled ? undefined : onNext}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Booking Consultation" icon={<CalendarDays className="w-6 h-6 text-gray-700 dark:text-gray-400" />} />

        <div className="flex-1 overflow-y-auto p-8">
          <Stepper step={step} />

          {/* ═══ STEP 1 ═══ */}
          {step === 1 && (
            <div className="bg-emerald-50/50 dark:bg-[#0D1B2E] border border-emerald-100 dark:border-white/8 rounded-2xl p-7 max-w-5xl">

              <div className="flex items-start justify-between pb-6 border-b border-emerald-100 dark:border-white/8 mb-6">
                <div className="max-w-sm">
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">First time consulting?</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">If this is your first time scheduling a consultation, we'll guide you through each step to ensure you get the most out of your session.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={firstTime} onCheckedChange={setFirstTime} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{firstTime ? "Yes" : "No"}</span>
                </div>
              </div>

              <div className="flex items-start justify-between pb-6 border-b border-emerald-100 dark:border-white/8 mb-6">
                <div className="max-w-xs">
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Select an area you want information in</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">This helps us match you with the right professional based on your needs and questions.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end max-w-sm">
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

              <div className="flex items-start justify-between mb-4">
                <div className="max-w-xs">
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Consultant list</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Browse through the list of consultants and select the one that fits your needs.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {filtered.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArchitect(a.id)}
                    className={`bg-white dark:bg-white/5 rounded-xl border-2 p-4 text-left transition-all ${
                      selectedArchitect === a.id
                        ? "border-gray-900 dark:border-white shadow-sm"
                        : "border-transparent shadow-sm hover:border-gray-200 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <img src={a.photo} alt={a.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedArchitect === a.id ? "border-gray-900 dark:border-white" : "border-gray-300 dark:border-white/30"}`}>
                        {selectedArchitect === a.id && <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{a.name}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{a.role}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-4">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{a.rating} ({a.reviews} Reviews)
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">Available from:</p>
                        <span className="text-[10px] font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md uppercase block text-center">10TH FEB</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">Working hours:</p>
                        <span className="text-[10px] font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-500 px-2 py-1 rounded-md block text-center">10AM–9PM</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-white/8 pt-2.5 text-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">View Profile</span>
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
            <div className="bg-emerald-50/50 dark:bg-[#0D1B2E] border border-emerald-100 dark:border-white/8 rounded-2xl p-7 max-w-5xl">
              <ArchitectBar
                architect={activeArchitect}
                dateLabel="19th February" timeLabel="9AM – 21PM"
                leftLabel="Available from:" rightLabel="Working hours:"
              />

              <div className="flex items-start gap-6">
                <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-4 w-72 flex-shrink-0">
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
                          onClick={() => !cell.out && setSelectedDate(cell.d)}
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

                <div className="flex-1 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-4 overflow-auto">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Select a time slot</p>
                    <div className="flex items-center gap-2">
                      <Switch checked={nightTime} onCheckedChange={setNightTime} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Night time</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {timeDays.map(d => <div key={d} className="text-center text-[10px] font-semibold text-gray-500 dark:text-gray-500 py-1">{d}</div>)}
                  </div>
                  {timeSlots.map((slot, row) => (
                    <div key={row} className="grid grid-cols-7 gap-1 mb-1">
                      {timeDays.map((_, col) => {
                        const isSelected = selectedSlot?.[0] === col && selectedSlot?.[1] === row
                        return (
                          <button
                            key={col}
                            onClick={() => setSelectedSlot([col, row])}
                            className={`text-center text-[10px] font-medium py-2 px-0.5 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/8"
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  ))}
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
            <div className="bg-emerald-50/50 dark:bg-[#0D1B2E] border border-emerald-100 dark:border-white/8 rounded-2xl p-7 max-w-5xl">
              <ArchitectBar
                architect={activeArchitect}
                dateLabel="19th February" timeLabel="9AM – 21PM"
                leftLabel="Date:" rightLabel="Time:"
              />

              <div className="space-y-5">
                <div className="flex items-start gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Additional notes</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Provide any additional details that would help the consultant understand your requirements better.</p>
                  </div>
                  <Textarea
                    placeholder="Additional notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 resize-none min-h-[130px] text-sm"
                  />
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">First name &amp; last name</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enter your full name for identification.</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                    <Input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Email</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">We'll send confirmation and updates to this email.</p>
                  </div>
                  <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Mobile Number</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provide your number for urgent updates or contact.</p>
                  </div>
                  <Input placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
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
            <div className="bg-gray-50 dark:bg-[#0D1B2E] border border-gray-200 dark:border-white/8 rounded-2xl p-7 max-w-5xl">
              <ArchitectBar
                architect={activeArchitect}
                dateLabel="19th February" timeLabel="9AM – 21PM"
                leftLabel="Date:" rightLabel="Time:"
              />

              <div className="space-y-5">
                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Email</p>
                  </div>
                  <Input placeholder="example@email.com" type="email" value={cardEmail} onChange={e => setCardEmail(e.target.value)} className="flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-0.5">Card number</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enter your full name for identification.</p>
                  </div>
                  <Input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="flex-1 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm font-mono" />
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Expiration</p>
                  </div>
                  <Input placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-32 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">CVV</p>
                  </div>
                  <Input placeholder="000" value={cvv} onChange={e => setCvv(e.target.value)} className="w-24 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-64 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">ZIP / Postal code</p>
                  </div>
                  <Input placeholder="00000" value={zip} onChange={e => setZip(e.target.value)} className="w-32 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 h-11 text-sm" />
                </div>

                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={agreedPayment} onCheckedChange={v => setAgreedPayment(!!v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to Planr{" "}
                      <a href="#" className="text-orange-500 hover:underline font-medium">Terms of Use</a>
                      {" "}and to receive electronic communication from Planr
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={saveCard} onCheckedChange={v => setSaveCard(!!v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Save card information</span>
                  </label>
                </div>
              </div>

              <StepFooter onBack={() => setStep(3)} onNext={() => setConfirmed(true)} nextLabel="Next" nextDisabled={!agreedPayment} />
            </div>
          )}
        </div>
      </div>

      {confirmed && <SuccessModal onClose={() => { setConfirmed(false); window.location.href = "/dashboard" }} />}
    </div>
  )
}
