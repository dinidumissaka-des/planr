"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Mic, Star, ArrowUpRight, User, MessageSquare, MessageCircleQuestion } from "lucide-react"

function AiIcon({ size = 32 }: { size?: number }) {
  return <img src="/ai-icon.svg" alt="Planr AI" width={size} height={size} className="rounded-full flex-shrink-0" />
}
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import Link from "next/link"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import { createClient } from "@/lib/supabase"
import { fetchConsultations, formatScheduledDate, fetchAiChats, upsertAiChat, deleteAiChat, type Consultation, type AiChat, type AiChatMessage } from "@/lib/data"

const AI_GREETING = "Hi! I'm the Planr AI. I can answer questions about architecture, construction, permits, interior design, and more. What would you like to know?"

const Avatar = ({ initials, size = "w-8 h-8", textSize = "text-[10px]" }: { initials: string; size?: string; textSize?: string }) =>
  <AvatarInitials initials={initials} size={size} textSize={textSize} />

// ─── Types ────────────────────────────────────────────────

type View = "empty" | "chat"
type Mode = "consultant" | "ai"
type Message = AiChatMessage | { role: "consultant"; text: string; time: string }

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
      <div className="flex-shrink-0 mt-0.5">
        <AiIcon size={32} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-secondary/10 dark:bg-secondary/15 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-3 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 mt-3 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 mt-2 first:mt-0">{children}</h3>,
              ul: ({ children }) => <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-outside pl-4 mb-2 space-y-0.5">{children}</ul>,
              ol: ({ children }) => <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-outside pl-4 mb-2 space-y-0.5">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => <code className="bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
              hr: () => <hr className="border-gray-200 dark:border-white/10 my-2" />,
            }}
          >
            {msg.text}
          </ReactMarkdown>
        </div>
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
      <div className="flex-shrink-0">
        <AiIcon size={32} />
      </div>
      <div className="bg-secondary/10 dark:bg-secondary/15 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
      </div>
    </div>
  )
}

// ─── Right sidebar (shared) ───────────────────────────────

function RightSidebar({ onAI, onView, previousConsultations, loadingPrev, mode, aiChats, loadingAiChats, onLoadChat, onNewChat, onDeleteChat }: {
  onAI: () => void
  onView: (c: Consultation) => void
  previousConsultations: Consultation[]
  loadingPrev: boolean
  mode: Mode
  aiChats: AiChat[]
  loadingAiChats: boolean
  onLoadChat: (chat: AiChat) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
}) {
  return (
    <div className="hidden lg:flex w-72 flex-col gap-4 flex-shrink-0">
      {/* AI chat history */}
      {mode === "ai" ? (
        <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Previous chats</p>
            <button onClick={onNewChat} className="text-xs font-semibold text-primary dark:text-secondary hover:opacity-70 transition-opacity">
              + New chat
            </button>
          </div>
          {loadingAiChats ? (
            <div className="space-y-2 py-1">
              {[0,1,2].map(i => <div key={i} className="h-8 rounded-lg bg-gray-100 dark:bg-white/8 animate-pulse" />)}
            </div>
          ) : aiChats.length > 0 ? (
            <div className="space-y-1">
              {aiChats.map(chat => (
                <div key={chat.id} className="group flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onLoadChat(chat)}>
                  <AiIcon size={20} />
                  <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">{chat.title}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteChat(chat.id) }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AiIcon size={28} />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2.5">No previous chats</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Your AI conversations will appear here.</p>
            </div>
          )}
        </div>
      ) : (
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
      )}

      <div
        className="rounded-2xl pt-5 px-5 text-white relative overflow-hidden self-start w-full"
        style={{
          paddingBottom: '20px',
          backgroundImage: `url('/bg-gradient.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover, cover',
        }}
      >
        <div className="mb-4"><AiIcon size={28} /></div>
        <p className="text-base font-bold mb-1.5">Planr AI</p>
        <p className="text-sm text-white/55 leading-relaxed mb-5">
          Get instant answers about architecture, permits, costs, and timelines — available 24/7.
        </p>
        <button
          onClick={onAI}
          className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Try Planr AI
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
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(219, 207, 99, 0.18)' }}>
          <MessageCircleQuestion className="w-12 h-12" style={{ color: '#A89A30' }} />
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
        <Link
          href="/bookings"
          className="w-full flex items-center justify-center gap-2 bg-secondary/15 hover:bg-secondary/25 text-primary dark:text-secondary text-sm font-semibold py-3 rounded-xl transition-colors border border-secondary/30"
        >
          Book a Consultation
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
  const [aiChat, setAiChat]           = useState<Message[]>([{ role: "ai", text: AI_GREETING, time: "just now" }])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping]       = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const streamingTimeRef = useRef("")
  const bottomRef = useRef<HTMLDivElement>(null)

  async function callAI(userMessage: string, history: Message[]) {
    setIsTyping(true)
    setStreamingText("")
    streamingTimeRef.current = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const allMapped = [
      ...history.filter(m => m.text).map(m => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user" as const, content: userMessage },
    ]
    // Anthropic requires the first message to be from "user"
    const firstUserIdx = allMapped.findIndex(m => m.role === "user")
    const apiMessages = firstUserIdx > 0 ? allMapped.slice(firstUserIdx) : allMapped

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok || !response.body) {
        const errText = await response.text()
        throw new Error(errText || "Request failed")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamingText(accumulated)
        setIsTyping(false)
      }

      const aiMsg: AiChatMessage = { role: "ai", text: accumulated, time: streamingTimeRef.current }
      const userMsg: AiChatMessage = { role: "user", text: userMessage, time: streamingTimeRef.current }
      const updatedChat = [...history.filter(m => m.role !== "consultant") as AiChatMessage[], userMsg, aiMsg]
      setAiChat(p => [...p, aiMsg])

      // Auto-save to Supabase
      if (userIdRef.current) {
        const title = userMessage.slice(0, 60)
        const newId = await upsertAiChat(userIdRef.current, activeChatId, title, updatedChat)
        if (newId && !activeChatId) {
          setActiveChatId(newId)
          setAiChats(prev => [{ id: newId, title, messages: updatedChat, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...prev])
        } else if (newId) {
          setAiChats(prev => prev.map(c => c.id === newId ? { ...c, messages: updatedChat, updated_at: new Date().toISOString() } : c))
        }
      }
    } catch {
      const fallback = "I'm having trouble connecting right now. Please try again in a moment."
      setAiChat(p => [...p, { role: "ai", text: fallback, time: streamingTimeRef.current }])
    } finally {
      setStreamingText("")
      setIsTyping(false)
    }
  }

  function handleLoadChat(chat: AiChat) {
    setActiveChatId(chat.id)
    setAiChat(chat.messages)
    setView("chat")
    setMode("ai")
  }

  function handleNewChat() {
    setActiveChatId(null)
    setAiChat([{ role: "ai", text: AI_GREETING, time: "just now" }])
  }

  async function handleDeleteChat(id: string) {
    setAiChats(prev => prev.filter(c => c.id !== id))
    if (activeChatId === id) handleNewChat()
    if (userIdRef.current) await deleteAiChat(userIdRef.current, id)
  }

  const [allConsultations, setAllConsultations] = useState<Consultation[]>([])
  const [loadingPrev, setLoadingPrev] = useState(true)
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)

  // ── AI chat history ───────────────────────────────────────
  const [aiChats, setAiChats] = useState<AiChat[]>([])
  const [loadingAiChats, setLoadingAiChats] = useState(true)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoadingPrev(false); setLoadingAiChats(false); return }
      userIdRef.current = user.id
      const [all, chats] = await Promise.all([
        fetchConsultations(user.id),
        fetchAiChats(user.id),
      ])
      setAllConsultations(all)
      setAiChats(chats)
      setLoadingPrev(false)
      setLoadingAiChats(false)
    }
    load()
  }, [])

  const previousConsultations = allConsultations.filter(c => c.status === "completed")
  const ongoingConsultation   = allConsultations.find(c => c.status === "ongoing") ?? null

  const messages = mode === "consultant" ? consultChat : aiChat

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, isTyping, streamingText])

  function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }

  async function handleSend() {
    if (!input.trim() || isTyping) return
    const userText = input.trim()
    const userMsg: Message = { role: "user", text: userText, time: now() }
    setInput("")
    if (mode === "consultant") {
      setConsultChat(p => [...p, userMsg])
    } else {
      const history = aiChat
      setAiChat(p => [...p, userMsg])
      await callAI(userText, history)
    }
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
        <AppHeader title="Ask Planr" />

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
                  <AiIcon size={16} /> Planr AI
                  <span className="text-[10px] font-semibold bg-secondary/20 text-primary dark:text-secondary px-1.5 py-0.5 rounded-full ml-0.5">Beta</span>
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


              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
                {mode === "ai" && isTyping && !streamingText && <TypingDots />}
                {mode === "ai" && streamingText && (
                  <ChatBubble msg={{ role: "ai", text: streamingText, time: "" }} />
                )}
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
                    onKeyDown={e => e.key === "Enter" && !isTyping && handleSend()}
                    disabled={mode === "ai" && isTyping}
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none disabled:opacity-50"
                  />
                  <button className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"><Mic className="w-4 h-4" /></button>
                  <button onClick={handleSend} disabled={!input.trim() || (mode === "ai" && isTyping)} className={`text-sm font-semibold px-1 transition-colors disabled:text-gray-300 dark:disabled:text-gray-700 ${mode === "ai" ? "text-primary dark:text-secondary hover:opacity-70" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Right sidebar ── */}
          <RightSidebar
            onAI={openAI}
            onView={(c) => openChat(c)}
            previousConsultations={previousConsultations}
            loadingPrev={loadingPrev}
            mode={mode}
            aiChats={aiChats}
            loadingAiChats={loadingAiChats}
            onLoadChat={handleLoadChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      </div>
    </div>
  )
}
