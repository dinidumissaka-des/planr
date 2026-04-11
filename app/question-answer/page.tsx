"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Sparkles, Star, ArrowUpRight, Bot, User, MessageSquare, MessageCircleQuestion } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import Link from "next/link"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import { createClient } from "@/lib/supabase"
import { fetchConsultations, formatScheduledDate, type Consultation } from "@/lib/data"

const aiResponses: Record<string, string> = {
  default:   "Hi! I'm the Planr AI. I can answer questions about architecture, construction, permits, interior design, and more. What would you like to know?",
  fee:       "Architect fees typically range from 5–20% of total construction cost:\n\n• **Percentage of construction cost** — most common for residential\n• **Fixed fee** — good for well-defined scopes\n• **Hourly rate** — $150–$400/hr for consultations\n\nAlways ask for a detailed scope of work to avoid surprise costs.",
  permit:    "Building permits are required for most structural work. The process:\n\n1. Submit drawings to your local building department\n2. Plan review (2–8 weeks)\n3. Permit issuance and fee payment\n4. Inspections during construction\n\nYour architect can manage this entire process, often included in their fee.",
  interior:  "For interior design, expect discussions on:\n\n• Space planning and layout\n• Material and finish selections\n• Lighting design\n• Furniture specifications\n\nInitial consultations are often free.",
  timeline:  "Typical project timelines:\n\n• **Small renovation** — 3–6 months\n• **Full remodel** — 6–12 months\n• **New residential build** — 12–24 months\n• **Commercial** — 18–36 months\n\nDesign and permitting alone can take 30–40% of total time.",
  landscape: "Landscape architecture covers site planning, drainage, planting, and hardscaping:\n\n• Soil and drainage assessment\n• Local climate considerations\n• Integration with the building design\n\nFees typically run 10–15% of landscape construction cost.",
}

function getAIResponse(input: string): string {
  const l = input.toLowerCase()
  if (l.includes("fee") || l.includes("cost") || l.includes("price")) return aiResponses.fee
  if (l.includes("permit") || l.includes("approval"))                  return aiResponses.permit
  if (l.includes("interior") || l.includes("decor"))                   return aiResponses.interior
  if (l.includes("time") || l.includes("long") || l.includes("timeline")) return aiResponses.timeline
  if (l.includes("landscape") || l.includes("garden"))                 return aiResponses.landscape
  return "Great question! For specific professional advice tailored to your project, I recommend booking a consultation with one of our certified architects.\n\nIs there anything else I can help clarify?"
}

const Avatar = ({ initials, size = "w-8 h-8", textSize = "text-[10px]" }: { initials: string; size?: string; textSize?: string }) =>
  <AvatarInitials initials={initials} size={size} textSize={textSize} />

// ─── Types ────────────────────────────────────────────────

type View = "empty" | "chat"
type Mode = "consultant" | "ai"
interface Message { role: "user" | "consultant" | "ai"; text: string; time: string }

// ─── Chat bubble ──────────────────────────────────────────

function ChatBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") return (
    <div className="flex flex-col items-end gap-1 mb-5">
      <div className="bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md text-sm leading-relaxed">{msg.text}</div>
      <span className="text-[11px] text-gray-400 dark:text-gray-600">{msg.time}</span>
    </div>
  )
  if (msg.role === "ai") return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4 text-primary dark:text-secondary" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-white dark:bg-[#0D1B2E] border border-secondary/30 dark:border-secondary/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">{msg.text}</div>
        <span className="text-[11px] text-gray-400 dark:text-gray-600">{msg.time}</span>
      </div>
    </div>
  )
  return (
    <div className="flex items-start gap-0 mb-5">
      <div className="flex flex-col gap-1">
        <div className="bg-white dark:bg-[#0D1B2E] border-l-[3px] border-emerald-500 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">{msg.text}</div>
        <span className="text-[11px] text-gray-400 dark:text-gray-600">{msg.time}</span>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-primary dark:text-secondary" />
      </div>
      <div className="bg-white dark:bg-[#0D1B2E] border border-secondary/30 dark:border-secondary/20 rounded-2xl rounded-tl-sm px-4 py-3 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
      </div>
    </div>
  )
}

// ─── Right sidebar (shared) ───────────────────────────────

function RightSidebar({ onAI, onView, previousConsultations, loadingPrev }: {
  onAI: () => void
  onView: (c: Consultation) => void
  previousConsultations: Consultation[]
  loadingPrev: boolean
}) {
  return (
    <div className="hidden lg:flex w-72 flex-col gap-4 flex-shrink-0">
      <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Previous consultations</p>
          {previousConsultations.length > 0 && (
            <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-0.5 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
        {loadingPrev ? (
          <div className="space-y-3 py-1">
            {[0, 1].map(i => (
              <div key={i} className="flex items-center gap-2.5 py-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0" />
                <div className="flex-1 h-3 rounded bg-gray-200 dark:bg-white/10" />
                <div className="w-16 h-3 rounded bg-gray-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : previousConsultations.length > 0 ? (
          <>
            <div className="grid grid-cols-[1fr_auto_auto] text-xs text-gray-400 dark:text-gray-600 font-medium pb-2 border-b border-gray-100 dark:border-white/8 gap-3">
              <span>Consult</span><span>Date</span><span />
            </div>
            {previousConsultations.map((c) => (
              <div key={c.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center py-3 gap-2.5 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/4 rounded-lg transition-colors px-1 -mx-1">
                <Avatar initials={c.architect_initials} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{c.architect_name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap">{formatScheduledDate(c.scheduled_at)}</span>
                <button onClick={() => onView(c)} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">View</button>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MessageSquare className="w-7 h-7 text-gray-300 dark:text-gray-700 mb-2.5" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No previous consultations</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Past sessions will appear here.</p>
          </div>
        )}
      </div>

      <div
        className="rounded-2xl pt-5 px-5 text-white relative overflow-hidden self-start w-full"
        style={{
          paddingBottom: '20px',
          backgroundImage: `url('/bg-gradient.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover, cover',
        }}
      >
        <Sparkles className="w-5 h-5 text-white mb-4" />
        <p className="text-base font-bold mb-1.5">AI Assistant</p>
        <p className="text-sm text-white/55 leading-relaxed mb-5">
          Get instant answers about architecture, permits, costs, and timelines — available 24/7.
        </p>
        <button
          onClick={onAI}
          className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Try AI Assistant
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────

function EmptyState({ onStart, onAI }: { onStart: () => void; onAI: () => void }) {
  return (
    <div className="relative flex-1 rounded-2xl border border-gray-100 dark:border-white/8 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] flex flex-col items-center justify-center px-8 text-center min-h-0 bg-[#EAF3FB] dark:bg-[#0D1B2E] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-20 pointer-events-none" style={{ backgroundImage: "url('/grain-bg-lg.png')" }} />
      <div className="relative mb-7">
        <div className="w-24 h-24 bg-gray-100 dark:bg-white/8 rounded-full flex items-center justify-center">
          <MessageCircleQuestion className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
      </div>

      <h2 className="relative text-xl font-bold text-gray-900 dark:text-white mb-2">No active consultation</h2>
      <p className="relative text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mb-8">
        You don't have an active question thread yet. Start by asking a question or pick up a previous conversation.
      </p>

      <div className="relative flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Ask a Question
        </button>
        <button
          onClick={onAI}
          className="w-full flex items-center justify-center gap-2 bg-secondary/15 hover:bg-secondary/25 text-primary dark:text-secondary text-sm font-semibold py-3 rounded-xl transition-colors border border-secondary/30"
        >
          Try AI Assistant
        </button>
        <Link
          href="/bookings"
          className="w-full text-center text-sm text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 py-2 transition-colors"
        >
          Or book a consultation →
        </Link>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────

export default function QuestionAnswerPage() {
  const [view, setView]   = useState<View>("empty")
  const [mode, setMode]   = useState<Mode>("consultant")
  const [consultChat, setConsultChat] = useState<Message[]>([])
  const [aiChat, setAiChat]           = useState<Message[]>([{ role: "ai", text: aiResponses.default, time: "just now" }])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [allConsultations, setAllConsultations] = useState<Consultation[]>([])
  const [loadingPrev, setLoadingPrev] = useState(true)
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)

  useEffect(() => {
    async function loadConsultations() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoadingPrev(false); return }
      const all = await fetchConsultations(user.id)
      setAllConsultations(all)
      setLoadingPrev(false)
    }
    loadConsultations()
  }, [])

  const previousConsultations = allConsultations.filter(c => c.status === "completed")
  const ongoingConsultation   = allConsultations.find(c => c.status === "ongoing") ?? null

  const messages = mode === "consultant" ? consultChat : aiChat

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, isTyping])

  function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }

  function handleSend() {
    if (!input.trim()) return
    const msg: Message = { role: "user", text: input.trim(), time: now() }
    if (mode === "consultant") {
      setConsultChat(p => [...p, msg])
    } else {
      setAiChat(p => [...p, msg])
      const reply = getAIResponse(input)
      setIsTyping(true)
      setTimeout(() => { setIsTyping(false); setAiChat(p => [...p, { role: "ai", text: reply, time: now() }]) }, 1400)
    }
    setInput("")
  }

  function openAI() { setMode("ai"); setView("chat") }
  function openChat(consultation?: Consultation) {
    setActiveConsultation(consultation ?? ongoingConsultation)
    setConsultChat([])
    setMode("consultant")
    setView("chat")
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Question Answer" />

        <div className="flex-1 overflow-hidden flex gap-5 p-4 md:p-6 pb-20 md:pb-6">

          {/* ── Empty state ── */}
          {view === "empty" && (
            <EmptyState onStart={openChat} onAI={openAI} />
          )}

          {/* ── Chat view ── */}
          {view === "chat" && (
            <div className="flex-1 bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 flex flex-col overflow-hidden shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] min-w-0">
              {/* Tabs */}
              <div className="flex items-end gap-4 px-5 pt-5 pb-0 border-b border-gray-100 dark:border-white/8">
                <button
                  onClick={() => setMode("consultant")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all border-b-2 ${mode === "consultant" ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <User className="w-3.5 h-3.5" /> Consultant Chat
                </button>
                <button
                  onClick={() => setMode("ai")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all border-b-2 ${mode === "ai" ? "border-primary dark:border-secondary text-primary dark:text-secondary" : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Assistant
                </button>
              </div>

              {/* Consultant header */}
              {mode === "consultant" && (
                <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-gray-50 dark:border-white/5 flex-wrap">
                  {activeConsultation?.architect_name ? (
                    <>
                      <AvatarInitials initials={activeConsultation.architect_initials} size="w-10 h-10" textSize="text-xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 dark:text-gray-600 font-medium leading-none mb-0.5">Consult</p>
                        <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight">{activeConsultation.architect_name}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{activeConsultation.consultation_type}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatScheduledDate(activeConsultation.scheduled_at)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-red-500">Live</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/8 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 dark:text-gray-600 font-medium leading-none mb-0.5">Consult</p>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-tight">No active consultant</p>
                      </div>
                      <Link href="/bookings" className="flex items-center gap-1.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex-shrink-0">
                        Book a session
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* AI header */}
              {mode === "ai" && (
                <div className="flex items-center gap-3 px-6 py-3 border-b border-secondary/20 bg-secondary/10 dark:bg-secondary/8">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary dark:text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Planr AI</p>
                    <p className="text-xs text-secondary font-medium">Available 24/7 · Instant answers</p>
                  </div>
                  <span className="text-xs bg-secondary/20 text-primary dark:text-secondary font-semibold px-2.5 py-1 rounded-full">Beta</span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
                {isTyping && <TypingDots />}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-gray-100 dark:border-white/8">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2.5">
                  <input
                    type="text"
                    placeholder={mode === "ai" ? "Ask the AI about architecture, costs, permits..." : "Type here"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
                  />
                  <button className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"><Mic className="w-4 h-4" /></button>
                  <button onClick={handleSend} disabled={!input.trim()} className={`text-sm font-semibold px-1 transition-colors disabled:text-gray-300 dark:disabled:text-gray-700 ${mode === "ai" ? "text-primary dark:text-secondary hover:opacity-70" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
                    Send
                  </button>
                </div>
                {mode === "ai" && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-1.5">For professional advice, book a consultation with a certified architect.</p>
                )}
              </div>
            </div>
          )}

          {/* ── Right sidebar ── */}
          <RightSidebar
            onAI={openAI}
            onView={(c) => openChat(c)}
            previousConsultations={previousConsultations}
            loadingPrev={loadingPrev}
          />
        </div>
      </div>
    </div>
  )
}
