"use client"

import { MessageSquare, CheckCircle2, ChevronDown, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConsultantSidebar } from "@/components/consultant-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import { timeAgo, fetchAllQuestions, replyToQuestion, type ConsultantQuestion } from "@/lib/data"

const TABS = [
  { label: "All",      value: "all" },
  { label: "Pending",  value: "pending" },
  { label: "Answered", value: "answered" },
]

function QuestionCard({
  question,
  consultantName,
  onReply,
}: {
  question: ConsultantQuestion
  consultantName: string
  onReply: (id: string, reply: string) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [reply, setReply]       = useState(question.reply ?? "")
  const [sending, setSending]   = useState(false)
  const [done, setDone]         = useState(question.is_answered)

  async function submit() {
    if (!reply.trim()) return
    setSending(true)
    await onReply(question.id, reply.trim())
    setSending(false)
    setDone(true)
    setExpanded(false)
  }

  return (
    <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
      {/* Row */}
      <button
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-gray-50/50 dark:hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-shrink-0 mt-0.5">
          {done
            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            : <MessageSquare className="w-5 h-5 text-secondary" />
          }
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{question.question}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {question.category && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/15 text-primary dark:text-secondary">{question.category}</span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-600">{timeAgo(question.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${done ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"}`}>
            {done ? "Answered" : "Pending"}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-white/8 px-5 py-4 flex flex-col gap-4">
          {question.description && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 mb-1 uppercase tracking-wide">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{question.description}</p>
            </div>
          )}

          {/* Existing reply */}
          {done && question.reply && (
            <div className="bg-secondary/10 dark:bg-secondary/8 rounded-xl p-4">
              <p className="text-xs font-semibold text-secondary mb-1 uppercase tracking-wide">Your reply</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{question.reply}</p>
              {question.replied_at && (
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2">{timeAgo(question.replied_at)}</p>
              )}
            </div>
          )}

          {/* Reply textarea */}
          {!done && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Write your reply</p>
              <textarea
                rows={4}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply…"
                className="w-full resize-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <div className="flex justify-end">
                <button
                  onClick={submit}
                  disabled={sending || !reply.trim()}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  {sending
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Sending…</>
                    : <><Send className="w-4 h-4" /> Send reply</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ConsultantQuestionsPage() {
  const router = useRouter()
  const [loading, setLoading]         = useState(true)
  const [questions, setQuestions]     = useState<ConsultantQuestion[]>([])
  const [consultantId, setConsultantId] = useState("")
  const [consultantName, setConsultantName] = useState("")
  const [tab, setTab]                 = useState("all")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      setConsultantId(user.id)
      const first = user.user_metadata?.first_name ?? ""
      const last  = user.user_metadata?.last_name  ?? ""
      setConsultantName(first && last ? `${first} ${last}` : (user.email ?? "Consultant"))

      const data = await fetchAllQuestions(100)
      setQuestions(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleReply(questionId: string, reply: string) {
    await replyToQuestion(questionId, reply, consultantId, consultantName)
    const q = questions.find(x => x.id === questionId)
    setQuestions(prev => prev.map(x =>
      x.id === questionId
        ? { ...x, reply, replied_at: new Date().toISOString(), replied_by: consultantId, is_answered: true, consultant_name: consultantName }
        : x
    ))

    // Send reply notification email (fire-and-forget)
    if (q?.asker_email) {
      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa_reply",
          clientEmail: q.asker_email,
          clientName: q.asker_name ?? q.asker_email,
          consultantName,
          question: q.question,
          reply,
        }),
      }).catch(() => {})
    }
  }

  const filtered = questions.filter(q => {
    if (tab === "pending")  return !q.is_answered
    if (tab === "answered") return q.is_answered
    return true
  })

  const pendingCount  = questions.filter(q => !q.is_answered).length
  const answeredCount = questions.filter(q =>  q.is_answered).length

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <ConsultantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Questions" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-5">

            {/* Stats row */}
            {!loading && (
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded-2xl p-5 flex items-center justify-between"
                  style={{ backgroundColor: "#81B9E9", backgroundImage: "url('/bg-grain-3.png')", backgroundBlendMode: "screen", backgroundSize: "cover" }}
                >
                  <div>
                    <p className="text-2xl font-bold text-[#07111E]">{pendingCount}</p>
                    <p className="text-sm font-medium text-[#07111E]/70 mt-0.5">Pending replies</p>
                  </div>
                  <MessageSquare className="w-7 h-7 text-[#07111E]/40" />
                </div>
                <div
                  className="rounded-2xl p-5 flex items-center justify-between"
                  style={{ backgroundColor: "#E1C1A5", backgroundImage: "url('/bg-grain-2.png')", backgroundBlendMode: "screen", backgroundSize: "cover" }}
                >
                  <div>
                    <p className="text-2xl font-bold text-[#07111E]">{answeredCount}</p>
                    <p className="text-sm font-medium text-[#07111E]/70 mt-0.5">Answered</p>
                  </div>
                  <CheckCircle2 className="w-7 h-7 text-[#07111E]/40" />
                </div>
              </div>
            )}

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

            {/* Question list */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filtered.map(q => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    consultantName={consultantName}
                    onReply={handleReply}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {tab === "pending" ? "No pending questions" : tab === "answered" ? "No answered questions yet" : "No questions yet"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 max-w-xs">
                  Client questions will appear here as they come in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
