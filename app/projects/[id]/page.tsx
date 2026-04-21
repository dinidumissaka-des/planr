"use client"

import { use, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, CheckCircle2, Circle, Clock, AlertTriangle, Plus,
  Loader2, Pencil, Trash2, Calendar, ChevronDown, X, Check,
  FolderKanban, TrendingUp, Upload, Download, FileText, File, Paperclip,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import {
  fetchProject, fetchMilestones, updateMilestone, addMilestone,
  deleteMilestone, updateProject,
  fetchDocuments, uploadDocument, deleteDocument, getDocumentSignedUrl,
  type Project, type ProjectMilestone, type ProjectStatus, type MilestoneStatus,
  type ProjectDocument,
} from "@/lib/data"
import Link from "next/link"

function AiIcon({ size = 32 }: { size?: number }) {
  return <img src="/ai-icon.svg" alt="Planr AI" width={size} height={size} className="rounded-full flex-shrink-0" />
}

// ── Config ─────────────────────────────────────────────────

const MILESTONE_STATUS: Record<MilestoneStatus, {
  label: string
  icon: React.ReactNode
  dotClass: string
  rowClass: string
  next: MilestoneStatus
}> = {
  pending:     { label: "Pending",     icon: <Circle className="w-4 h-4" />,        dotClass: "border-gray-300 dark:border-white/15 text-gray-300 dark:text-gray-600 hover:border-blue-400 hover:text-blue-400",       rowClass: "",           next: "in_progress" },
  in_progress: { label: "In Progress", icon: <Clock className="w-4 h-4" />,         dotClass: "bg-blue-50 border-blue-400 dark:bg-blue-500/10 dark:border-blue-500 text-blue-500 dark:text-blue-400",              rowClass: "",           next: "completed" },
  completed:   { label: "Completed",   icon: <CheckCircle2 className="w-4 h-4" />, dotClass: "bg-green-500 border-green-500 text-white",                                                                             rowClass: "opacity-70", next: "pending" },
  blocked:     { label: "Blocked",     icon: <AlertTriangle className="w-4 h-4" />, dotClass: "bg-amber-50 border-amber-400 dark:bg-amber-500/10 dark:border-amber-500 text-amber-500 dark:text-amber-400",          rowClass: "",           next: "in_progress" },
}

const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planning",  label: "Planning" },
  { value: "active",    label: "Active" },
  { value: "on_hold",   label: "On Hold" },
  { value: "completed", label: "Completed" },
]

const PROJECT_STATUS_STYLE: Record<ProjectStatus, string> = {
  planning:  "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  active:    "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  on_hold:   "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  completed: "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400",
}

// ── Milestone Row ──────────────────────────────────────────

function MilestoneRow({
  milestone,
  index,
  onStatusToggle,
  onUpdate,
  onDelete,
}: {
  milestone: ProjectMilestone
  index: number
  onStatusToggle: (m: ProjectMilestone) => void
  onUpdate: (id: string, patch: Partial<ProjectMilestone>) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded]   = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleVal, setTitleVal]   = useState(milestone.title)
  const [notesVal, setNotesVal]   = useState(milestone.notes ?? "")
  const [dateVal, setDateVal]     = useState(milestone.due_date ?? "")

  const cfg         = MILESTONE_STATUS[milestone.status]
  const isCompleted = milestone.status === "completed"

  function saveTitle() {
    const trimmed = titleVal.trim()
    if (trimmed && trimmed !== milestone.title) onUpdate(milestone.id, { title: trimmed })
    setEditingTitle(false)
  }

  return (
    <div className={`group border-b border-gray-50 dark:border-white/5 last:border-0 ${cfg.rowClass}`}>
      {/* Main row */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
        onClick={() => setExpanded(x => !x)}
      >
        {/* Status toggle */}
        <button
          onClick={e => { e.stopPropagation(); onStatusToggle(milestone) }}
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 z-10 ${cfg.dotClass}`}
          title={`Mark as ${MILESTONE_STATUS[cfg.next].label}`}
        >
          {isCompleted ? <Check className="w-3 h-3" /> : cfg.icon}
        </button>

        {/* Step number */}
        <span className="text-[10px] font-bold text-gray-300 dark:text-gray-700 w-4 flex-shrink-0 tabular-nums">{index + 1}</span>

        {/* Title */}
        {editingTitle ? (
          <input
            value={titleVal}
            onChange={e => setTitleVal(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => {
              if (e.key === "Enter") saveTitle()
              if (e.key === "Escape") { setTitleVal(milestone.title); setEditingTitle(false) }
            }}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-secondary focus:outline-none"
            autoFocus
          />
        ) : (
          <span className={`flex-1 text-sm font-medium truncate ${isCompleted ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-800 dark:text-gray-200"}`}>
            {milestone.title}
          </span>
        )}

        {/* Status pill */}
        <span className={`hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
          milestone.status === "completed"   ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" :
          milestone.status === "in_progress" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
          milestone.status === "blocked"     ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
          "bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-600"
        }`}>
          {cfg.label}
        </span>

        {/* Due date */}
        {milestone.due_date && (
          <span className="hidden md:flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
            <Calendar className="w-2.5 h-2.5" />
            {new Date(milestone.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-5 pb-4 pt-1 space-y-3 bg-gray-50/50 dark:bg-white/[0.02]">

          {/* Status tabs */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 w-14">Status</span>
            <div className="flex gap-1.5 flex-wrap">
              {(["pending", "in_progress", "completed", "blocked"] as MilestoneStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate(milestone.id, { status: s })}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    milestone.status === s
                      ? s === "completed" ? "border-green-400 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/50"
                      : s === "in_progress" ? "border-blue-400 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/50"
                      : s === "blocked" ? "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/50"
                      : "border-gray-300 bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-400 dark:border-white/15"
                      : "border-transparent text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                  }`}
                >
                  {MILESTONE_STATUS[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 w-14">Due date</span>
            <input
              type="date"
              value={dateVal}
              onChange={e => setDateVal(e.target.value)}
              onBlur={() => onUpdate(milestone.id, { due_date: dateVal || null })}
              onClick={e => e.stopPropagation()}
              className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-secondary/40"
            />
          </div>

          {/* Notes */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-semibold text-gray-400 w-14 mt-1.5">Notes</span>
            <textarea
              value={notesVal}
              onChange={e => setNotesVal(e.target.value)}
              onBlur={() => onUpdate(milestone.id, { notes: notesVal.trim() || null })}
              onClick={e => e.stopPropagation()}
              placeholder="Add notes..."
              rows={2}
              className="flex-1 text-xs text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-700 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-secondary/40"
            />
          </div>

          {/* Row actions */}
          <div className="flex gap-4 pt-0.5">
            <button
              onClick={e => { e.stopPropagation(); setEditingTitle(true); setExpanded(false) }}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Pencil className="w-2.5 h-2.5" /> Rename
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(milestone.id) }}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-2.5 h-2.5" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Document Vault ─────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DocFileIcon({ mimeType }: { mimeType: string | null }) {
  const m = mimeType ?? ""
  if (m.includes("pdf")) return <FileText className="w-4 h-4 text-red-400" />
  if (m.startsWith("image/")) return <FileText className="w-4 h-4 text-blue-400" />
  if (m.includes("word") || m.includes("document")) return <FileText className="w-4 h-4 text-blue-600" />
  if (m.includes("sheet") || m.includes("excel")) return <FileText className="w-4 h-4 text-green-500" />
  return <File className="w-4 h-4 text-gray-400" />
}

function DocRow({
  doc,
  onDownload,
  onDelete,
}: {
  doc: ProjectDocument
  onDownload: (doc: ProjectDocument) => void
  onDelete: (doc: ProjectDocument) => void
}) {
  return (
    <div className="group flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors">
      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
        <DocFileIcon mimeType={doc.mime_type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.name}</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
          {formatFileSize(doc.size)} · {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onDownload(doc)}
          title="Download"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(doc)}
          title="Delete"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/8 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function DocumentVault({ projectId, userId }: { projectId: string; userId: string }) {
  const [docs, setDocs]         = useState<ProjectDocument[]>([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchDocuments(projectId).then(d => { setDocs(d); setLoading(false) })
  }, [projectId])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const doc = await uploadDocument(projectId, userId, file)
    if (doc) setDocs(prev => [doc, ...prev])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function handleDownload(doc: ProjectDocument) {
    const url = await getDocumentSignedUrl(doc.storage_path)
    if (url) window.open(url, "_blank")
  }

  async function handleDelete(doc: ProjectDocument) {
    setDocs(prev => prev.filter(d => d.id !== doc.id))
    await deleteDocument(doc)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Upload bar */}
      <div className="px-5 py-3 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">{docs.length} document{docs.length !== 1 ? "s" : ""}</p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.zip,.dwg,.dxf"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
        >
          {uploading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
            : <><Upload className="w-3.5 h-3.5" /> Upload</>}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-gray-300 dark:text-gray-700" />
          </div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-8">
            <Paperclip className="w-8 h-8 text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-600">No documents yet</p>
            <p className="text-xs text-gray-300 dark:text-gray-700 mt-1 leading-relaxed">Upload blueprints, permits, contracts, invoices, and more</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 text-xs font-semibold text-secondary hover:opacity-70 transition-opacity"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          docs.map(doc => (
            <DocRow
              key={doc.id}
              doc={doc}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Right Sidebar ──────────────────────────────────────────

function RightSidebar({ project, milestones }: { project: Project; milestones: ProjectMilestone[] }) {
  const done       = milestones.filter(m => m.status === "completed").length
  const inProgress = milestones.filter(m => m.status === "in_progress").length
  const blocked    = milestones.filter(m => m.status === "blocked").length
  const pending    = milestones.filter(m => m.status === "pending").length
  const total      = milestones.length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="hidden lg:flex w-72 flex-col gap-4 flex-shrink-0">

      {/* Progress card */}
      <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{project.name}</p>
        {project.location && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{project.location}</p>
        )}

        {/* Progress circle-ish summary */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Overall progress</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? "#22c55e" : "var(--color-secondary, #6366f1)",
              }}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            { label: "Completed",   count: done,       color: "text-green-500 bg-green-50 dark:bg-green-500/10" },
            { label: "In Progress", count: inProgress, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
            { label: "Blocked",     count: blocked,    color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
            { label: "Pending",     count: pending,    color: "text-gray-400 bg-gray-50 dark:bg-white/5" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Planr AI card */}
      <div
        className="rounded-2xl pt-5 px-5 text-white relative overflow-hidden self-start w-full"
        style={{
          paddingBottom: "20px",
          backgroundImage: `url('/bg-gradient.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover, cover",
        }}
      >
        <div className="mb-4"><AiIcon size={28} /></div>
        <p className="text-base font-bold mb-1.5">Need guidance?</p>
        <p className="text-sm text-white/55 leading-relaxed mb-5">
          Ask Planr AI about permits, costs, materials, and what to expect at each phase.
        </p>
        <Link
          href="/question-answer"
          className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Ask Planr AI
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [userId, setUserId]         = useState<string | null>(null)
  const [project, setProject]       = useState<Project | null>(null)
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [loading, setLoading]       = useState(true)
  const [addingNew, setAddingNew]   = useState(false)
  const [newTitle, setNewTitle]     = useState("")
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeTab, setActiveTab]   = useState<"milestones" | "documents">("milestones")
  const newTitleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return }
      setUserId(data.user.id)
      await loadAll(data.user.id)
    })
  }, [id])

  async function loadAll(uid?: string) {
    const uid_ = uid ?? userId
    if (!uid_) return
    setLoading(true)
    const [p, ms] = await Promise.all([fetchProject(id), fetchMilestones(id)])
    if (!p) { router.push("/projects"); return }
    setProject(p)
    setMilestones(ms)
    setLoading(false)
  }

  async function handleStatusToggle(m: ProjectMilestone) {
    const next = MILESTONE_STATUS[m.status].next
    setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, status: next } : x))
    await updateMilestone(m.id, userId!, { status: next })
  }

  async function handleUpdate(milestoneId: string, patch: Partial<ProjectMilestone>) {
    setMilestones(prev => prev.map(x => x.id === milestoneId ? { ...x, ...patch } : x))
    await updateMilestone(milestoneId, userId!, patch as Parameters<typeof updateMilestone>[2])
  }

  async function handleDelete(milestoneId: string) {
    setMilestones(prev => prev.filter(x => x.id !== milestoneId))
    await deleteMilestone(milestoneId, userId!)
  }

  async function handleAddMilestone() {
    const title = newTitle.trim()
    if (!title || !userId) return
    setAddingNew(false)
    setNewTitle("")
    await addMilestone(id, userId, title, milestones.length)
    await loadAll()
  }

  async function handleProjectStatus(status: ProjectStatus) {
    if (!project || !userId) return
    setProject(p => p ? { ...p, status } : p)
    setStatusOpen(false)
    await updateProject(id, userId, { status })
  }

  const done       = milestones.filter(m => m.status === "completed").length
  const total      = milestones.length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0
  const inProgress = milestones.filter(m => m.status === "in_progress").length
  const blocked    = milestones.filter(m => m.status === "blocked").length

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#07111E]">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Project Tracker" />

        <div className="flex-1 overflow-hidden flex gap-5 p-4 md:p-6 pb-20 md:pb-6">

          {/* ── Main panel ── */}
          <div className="flex-1 bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 flex flex-col overflow-hidden shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] min-w-0">

            {/* Panel header */}
            <div className="px-5 py-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
              </button>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{project.cover_emoji}</span>
                  <div className="min-w-0">
                    <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">{project.name}</h1>
                    {project.location && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">{project.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Stats pills */}
                  {inProgress > 0 && (
                    <span className="hidden sm:inline text-[10px] font-semibold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
                      {inProgress} active
                    </span>
                  )}
                  {blocked > 0 && (
                    <span className="hidden sm:inline text-[10px] font-semibold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {blocked} blocked
                    </span>
                  )}

                  {/* Status dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setStatusOpen(x => !x)}
                      className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-full ${PROJECT_STATUS_STYLE[project.status]}`}
                    >
                      {PROJECT_STATUS_OPTIONS.find(o => o.value === project.status)?.label}
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {statusOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#0D1B2E] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden z-20 w-32">
                        {PROJECT_STATUS_OPTIONS.map(o => (
                          <button
                            key={o.value}
                            onClick={() => handleProjectStatus(o.value)}
                            className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                              project.status === o.value ? "text-secondary" : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">{done} of {total} milestones complete</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? "#22c55e" : "var(--color-secondary, #6366f1)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 px-5 border-b border-gray-100 dark:border-white/8">
              {(["milestones", "documents"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-semibold py-2.5 px-1 border-b-2 -mb-px capitalize transition-colors ${
                    activeTab === tab
                      ? "border-secondary text-secondary"
                      : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {tab === "milestones" ? "Milestones" : "Documents"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "milestones" ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  {milestones.length === 0 && !addingNew ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                      <FolderKanban className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-400 dark:text-gray-600">No milestones yet</p>
                    </div>
                  ) : (
                    <div>
                      {milestones.map((m, i) => (
                        <MilestoneRow
                          key={m.id}
                          milestone={m}
                          index={i}
                          onStatusToggle={handleStatusToggle}
                          onUpdate={handleUpdate}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}

                  {/* Add new inline */}
                  {addingNew && (
                    <div className="flex items-center gap-3 px-5 py-3.5 border-t border-gray-50 dark:border-white/5">
                      <div className="w-7 h-7 rounded-full border-2 border-dashed border-secondary/40 flex items-center justify-center flex-shrink-0">
                        <Plus className="w-3 h-3 text-secondary/60" />
                      </div>
                      <input
                        ref={newTitleRef}
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleAddMilestone()
                          if (e.key === "Escape") { setAddingNew(false); setNewTitle("") }
                        }}
                        placeholder="Milestone name…"
                        className="flex-1 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddMilestone}
                          disabled={!newTitle.trim()}
                          className="text-xs font-semibold text-green-600 dark:text-green-400 disabled:opacity-40"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => { setAddingNew(false); setNewTitle("") }}
                          className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer add button */}
                <div className="px-5 py-3 border-t border-gray-100 dark:border-white/8">
                  <button
                    onClick={() => { setAddingNew(true); setTimeout(() => newTitleRef.current?.focus(), 50) }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add milestone
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {userId && <DocumentVault projectId={id} userId={userId} />}
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <RightSidebar project={project} milestones={milestones} />
        </div>
      </div>

      {statusOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
      )}
    </div>
  )
}
