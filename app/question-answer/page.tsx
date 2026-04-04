"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Sparkles, Star, ArrowUpRight, Bot, User, MessageSquare, MessageCircleQuestion } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import Link from "next/link"

// ─── Data ─────────────────────────────────────────────────

const initialConsultMessages: Message[] = [
  { role: "user",       text: "What's your fee structure and what can I expect in costs?", time: "10 minutes ago" },
  { role: "consultant", text: `Architects use different fee structures to charge for their services, and any reputable firm will be able to lay this out right away. On your end, "Be open about your budget," suggests Geyer. "Cost limitations are extremely critical, since quality work can be very expensive."\n\nYou also want to make sure your architect is open with you about the additional costs that may not be spelled out in your contract. "These are often additional construction administration hours or amendments to the drawings due to changes during construction," says Safyan. "If the client anticipates these costs, then it doesn't come as a surprise later, so it helps to ask the question and get a detailed response from the architect of these potential scenarios."`, time: "14 seconds ago" },
  { role: "user",       text: "Thank you! This is really helpful", time: "10 minutes ago" },
]

const previousConsultations = [
  { name: "Cooper Philips", date: "2022/01/18", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
  { name: "Davis Calzoni",  date: "2022/01/18", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
]

const aiResponses: Record<string, string> = {
  default:   "Hi! I'm the BuildingHelp AI. I can answer questions about architecture, construction, permits, interior design, and more. What would you like to know?",
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

// ─── Types ────────────────────────────────────────────────

type View = "empty" | "chat"
type Mode = "consultant" | "ai"
interface Message { role: "user" | "consultant" | "ai"; text: string; time: string }

// ─── Chat bubble ──────────────────────────────────────────

function ChatBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") return (
    <div className="flex flex-col items-end gap-1 mb-5">
      <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md text-sm leading-relaxed">{msg.text}</div>
      <span className="text-[11px] text-gray-400">{msg.time}</span>
    </div>
  )
  if (msg.role === "ai") return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4 text-indigo-600" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-white border border-indigo-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">{msg.text}</div>
        <span className="text-[11px] text-gray-400">{msg.time}</span>
      </div>
    </div>
  )
  return (
    <div className="flex items-start gap-0 mb-5">
      <div className="flex flex-col gap-1">
        <div className="bg-white border-l-[3px] border-emerald-500 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">{msg.text}</div>
        <span className="text-[11px] text-gray-400">{msg.time}</span>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-indigo-600" />
      </div>
      <div className="bg-white border border-indigo-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
      </div>
    </div>
  )
}

// ─── Right sidebar (shared) ───────────────────────────────

function RightSidebar({ onAI, onView }: { onAI: () => void; onView: () => void }) {
  return (
    <div className="w-72 flex flex-col gap-4 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm font-bold text-gray-900 mb-3">Book a consultation</p>
        <Link href="/bookings" className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-sm font-bold py-3 rounded-full transition-colors">
          Consult Now
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-900">Previous consultations</p>
          <button className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-0.5 transition-colors">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] text-xs text-gray-400 font-medium pb-2 border-b border-gray-100 gap-3">
          <span>Consult</span><span>Date</span><span />
        </div>
        {previousConsultations.map((c, i) => (
          <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] items-center py-3 gap-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 rounded-lg transition-colors px-1 -mx-1">
            <img src={c.photo} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-medium text-gray-700 truncate">{c.name}</span>
            <span className="text-xs text-gray-400 whitespace-nowrap">{c.date}</span>
            <button onClick={onView} className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">View</button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <p className="text-sm font-bold text-indigo-900">AI Assistant</p>
        </div>
        <p className="text-xs text-indigo-600 leading-relaxed mb-4">
          Get instant answers about architecture, permits, costs, and timelines — available 24/7.
        </p>
        <button onClick={onAI} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
          Try AI Assistant
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────

function EmptyState({ onStart, onAI }: { onStart: () => void; onAI: () => void }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center px-8 text-center min-h-0">
      {/* Illustration */}
      <div className="relative mb-7">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <MessageCircleQuestion className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-gray-900" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">No active consultation</h2>
      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
        You don't have an active question thread yet. Start by asking a question or pick up a previous conversation.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Ask a Question
        </button>
        <button
          onClick={onAI}
          className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold py-3 rounded-xl transition-colors border border-indigo-100"
        >
          <Sparkles className="w-4 h-4" /> Try AI Assistant
        </button>
        <Link
          href="/bookings"
          className="w-full text-center text-sm text-gray-500 hover:text-gray-800 py-2 transition-colors"
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
  const [consultChat, setConsultChat] = useState<Message[]>(initialConsultMessages)
  const [aiChat, setAiChat]           = useState<Message[]>([{ role: "ai", text: aiResponses.default, time: "just now" }])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
  function openChat() { setMode("consultant"); setView("chat") }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Question Answer" icon={<MessageSquare className="w-5 h-5 text-gray-700" />} />

        <div className="flex-1 overflow-hidden flex gap-5 p-6">

          {/* ── Empty state ── */}
          {view === "empty" && (
            <EmptyState onStart={openChat} onAI={openAI} />
          )}

          {/* ── Chat view ── */}
          {view === "chat" && (
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden shadow-sm min-w-0">
              {/* Tabs */}
              <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-gray-100">
                <button
                  onClick={() => setMode("consultant")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === "consultant" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <User className="w-3.5 h-3.5" /> Consultant Chat
                </button>
                <button
                  onClick={() => setMode("ai")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === "ai" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:bg-gray-100"}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Assistant
                </button>
              </div>

              {/* Consultant header */}
              {mode === "consultant" && (
                <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-50">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Davis" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium leading-none mb-0.5">Consult</p>
                    <p className="text-base font-bold text-gray-900 leading-tight">Davis Calzoni</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">Architect</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />4.9 (12 Reviews)
                    </p>
                  </div>
                  <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-2">View Profile</button>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-red-500">Live</span>
                  </div>
                </div>
              )}

              {/* AI header */}
              {mode === "ai" && (
                <div className="flex items-center gap-3 px-6 py-3 border-b border-indigo-50 bg-indigo-50/30">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">BuildingHelp AI</p>
                    <p className="text-xs text-indigo-500 font-medium">Available 24/7 · Instant answers</p>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">Beta</span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
                {isTyping && <TypingDots />}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
                  <input
                    type="text"
                    placeholder={mode === "ai" ? "Ask the AI about architecture, costs, permits..." : "Type here"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                  <button className="text-gray-400 hover:text-gray-600 transition-colors"><Mic className="w-4 h-4" /></button>
                  <button onClick={handleSend} disabled={!input.trim()} className={`text-sm font-semibold px-1 transition-colors disabled:text-gray-300 ${mode === "ai" ? "text-indigo-600 hover:text-indigo-800" : "text-gray-700 hover:text-gray-900"}`}>
                    Send
                  </button>
                </div>
                {mode === "ai" && (
                  <p className="text-[10px] text-gray-400 text-center mt-1.5">For professional advice, book a consultation with a certified architect.</p>
                )}
              </div>
            </div>
          )}

          {/* ── Right sidebar ── */}
          <RightSidebar onAI={openAI} onView={openChat} />
        </div>
      </div>
    </div>
  )
}
