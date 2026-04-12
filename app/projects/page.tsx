"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus, FolderKanban, MapPin, ChevronRight, Loader2, Trash2, X,
  CheckCircle2, Clock, AlertTriangle, TrendingUp,
  Home, UtensilsCrossed, BedDouble, Building2, Hammer, HardHat, type LucideIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import {
  fetchProjects, createProject, deleteProject,
  type Project, type ProjectType, type ProjectStatus,
  PROJECT_TYPE_EMOJI,
} from "@/lib/data"
import Link from "next/link"

function AiIcon({ size = 32 }: { size?: number }) {
  return <img src="/ai-icon.svg" alt="Planr AI" width={size} height={size} className="rounded-full flex-shrink-0" />
}

// ── Status config ──────────────────────────────────────────

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  planning:  { label: "Planning",  className: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  active:    { label: "Active",    className: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
  on_hold:   { label: "On Hold",   className: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  completed: { label: "Completed", className: "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400" },
}

const PROJECT_TYPES: { value: ProjectType; label: string; icon: LucideIcon; image: string; description: string }[] = [
  { value: "home",        label: "Home Build",  icon: Home,             image: "/onboarding1.webp", description: "Build from the ground up" },
  { value: "restaurant",  label: "Restaurant",  icon: UtensilsCrossed,  image: "/onboarding3.webp", description: "Design a dining space" },
  { value: "hotel",       label: "Hotel",       icon: BedDouble,        image: "/onboarding4.webp", description: "Develop a hospitality venue" },
  { value: "commercial",  label: "Commercial",  icon: Building2,        image: "/onboarding4.webp", description: "Office or retail build" },
  { value: "renovation",  label: "Renovation",  icon: Hammer,           image: "/onboarding2.webp", description: "Update an existing space" },
  { value: "other",       label: "Other",       icon: HardHat,          image: "/onboarding1.webp", description: "Any other project type" },
]

// ── New Project Modal ──────────────────────────────────────

function NewProjectModal({
  userId,
  onClose,
  onCreate,
}: {
  userId: string
  onClose: () => void
  onCreate: (id: string) => void
}) {
  const [name, setName]               = useState("")
  const [type, setType]               = useState<ProjectType>("home")
  const [description, setDescription] = useState("")
  const [location, setLocation]       = useState("")
  const [loading, setLoading]         = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    const id = await createProject(userId, {
      name: name.trim(),
      type,
      description: description.trim() || undefined,
      location: location.trim() || undefined,
    })
    setLoading(false)
    if (id) onCreate(id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Our Dream Home in Colombo"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Project Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`relative rounded-xl border text-left transition-all overflow-hidden ${
                    type === t.value
                      ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white"
                      : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${t.image}')` }} />
                  <div className={`absolute inset-0 transition-all ${type === t.value ? "bg-white/15" : "bg-white/40"}`} />
                  <div className="relative p-3">
                    <t.icon className="w-5 h-5 mb-2 text-gray-900" />
                    <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                    <p className="text-xs text-gray-700 mt-0.5">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Nugegoda, Sri Lanka"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Brief Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A few words about your project..."
              rows={2}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="flex-1 h-11 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Modal ───────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => Promise<void>; onCancel: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-xs rounded-t-3xl md:rounded-2xl p-7 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Delete project?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">All milestones will be permanently deleted. This can't be undone.</p>
        <button
          onClick={async () => { setLoading(true); await onConfirm() }}
          disabled={loading}
          className="w-full h-11 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl mb-2.5 transition-colors"
        >
          {loading ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={onCancel}
          className="w-full h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Project Row ────────────────────────────────────────────

function ProjectRow({
  project,
  progress,
  onDelete,
}: {
  project: Project
  progress: { done: number; total: number }
  onDelete: (id: string) => void
}) {
  const router = useRouter()
  const status = STATUS_CONFIG[project.status]
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group flex items-center gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] cursor-pointer transition-colors rounded-xl -mx-1 px-[calc(1.25rem+4px)]"
    >
      {/* Emoji */}
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
        {project.cover_emoji}
      </div>

      {/* Name + location */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{project.name}</p>
        {project.location && (
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5 mt-0.5">
            <MapPin className="w-2.5 h-2.5" /> {project.location}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="hidden sm:flex flex-col gap-1 w-28 flex-shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{progress.done}/{progress.total}</span>
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? "#22c55e" : "var(--color-secondary, #6366f1)",
              opacity: pct === 0 ? 0.3 : 1,
            }}
          />
        </div>
      </div>

      {/* Status badge */}
      <span className={`hidden md:inline text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${status.className}`}>
        {status.label}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onDelete(project.id) }}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-all p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400 transition-colors" />
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────

function EmptyProjectsState({ onNew }: { onNew: () => void }) {
  return (
    <div className="relative flex-1 rounded-2xl border border-gray-100 dark:border-white/8 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] flex flex-col items-center justify-center px-8 text-center min-h-0 bg-[#EAF3FB] dark:bg-[#0D1B2E] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-20 pointer-events-none" style={{ backgroundImage: "url('/grain-bg-lg.png')" }} />
      <div className="relative mb-7">
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(129, 185, 233, 0.18)' }}>
          <FolderKanban className="w-12 h-12" style={{ color: '#3B83BE' }} />
        </div>
      </div>

      <h2 className="relative text-xl font-bold text-gray-900 dark:text-white mb-2">No projects yet</h2>
      <p className="relative text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mb-8">
        Create your first project to start tracking milestones from planning to handover.
      </p>

      <div className="relative flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onNew}
          className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          New Project
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

// ── Right Sidebar ──────────────────────────────────────────

function RightSidebar({
  projects,
  progress,
  onNew,
}: {
  projects: Project[]
  progress: Record<string, { done: number; total: number }>
  onNew: () => void
}) {
  const active    = projects.filter(p => p.status === "active").length
  const completed = projects.filter(p => p.status === "completed").length
  const planning  = projects.filter(p => p.status === "planning").length

  const totalDone  = Object.values(progress).reduce((a, p) => a + p.done, 0)
  const totalMiles = Object.values(progress).reduce((a, p) => a + p.total, 0)

  return (
    <div className="hidden lg:flex w-72 flex-col gap-4 flex-shrink-0">

      {/* Stats card */}
      <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Overview</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-6 h-6 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
              Completed
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{completed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
              </div>
              Active
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{active}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
              </div>
              Planning
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{planning}</span>
          </div>

          {totalMiles > 0 && (
            <>
              <div className="border-t border-gray-100 dark:border-white/8 pt-3 mt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-lg bg-secondary/10 dark:bg-secondary/15 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    Milestones
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{totalDone}/{totalMiles}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden ml-8">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${totalMiles > 0 ? Math.round((totalDone / totalMiles) * 100) : 0}%`,
                      background: "var(--color-secondary, #6366f1)",
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Planr AI gradient card */}
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
        <p className="text-base font-bold mb-1.5">Need help planning?</p>
        <p className="text-sm text-white/55 leading-relaxed mb-5">
          Ask Planr AI about permits, timelines, budgets, and construction best practices.
        </p>
        <Link
          href="/question-answer"
          className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Try Planr AI
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────

export default function ProjectsPage() {
  const router = useRouter()
  const [userId, setUserId]     = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [progress, setProgress] = useState<Record<string, { done: number; total: number }>>({})
  const [loading, setLoading]   = useState(true)
  const [showNew, setShowNew]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return }
      setUserId(data.user.id)
      await loadProjects(data.user.id)
    })
  }, [])

  async function loadProjects(uid: string) {
    setLoading(true)
    const ps = await fetchProjects(uid)
    setProjects(ps)

    if (ps.length > 0) {
      const supabase = createClient()
      const { data } = await supabase
        .from("project_milestones")
        .select("project_id, status")
        .in("project_id", ps.map(p => p.id))

      const prog: Record<string, { done: number; total: number }> = {}
      for (const p of ps) prog[p.id] = { done: 0, total: 0 }
      for (const m of data ?? []) {
        prog[m.project_id].total++
        if (m.status === "completed") prog[m.project_id].done++
      }
      setProgress(prog)
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!deleteId || !userId) return
    await deleteProject(deleteId, userId)
    setDeleteId(null)
    await loadProjects(userId)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Projects" />

        <div className="flex-1 overflow-hidden flex gap-5 p-4 md:p-6 pb-20 md:pb-6">

          {/* ── Empty state (no projects) ── */}
          {!loading && projects.length === 0 ? (
            <EmptyProjectsState onNew={() => setShowNew(true)} />
          ) : (
            /* ── Main panel ── */
            <div className="flex-1 bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 flex flex-col overflow-hidden shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] min-w-0">

              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
                <div>
                  <h1 className="text-sm font-bold text-gray-900 dark:text-white">My Projects</h1>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Track your builds from planning to handover</p>
                </div>
                <button
                  onClick={() => setShowNew(true)}
                  className="flex items-center gap-1.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> New Project
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-white/5">
                    {projects.map(project => (
                      <ProjectRow
                        key={project.id}
                        project={project}
                        progress={progress[project.id] ?? { done: 0, total: 0 }}
                        onDelete={id => setDeleteId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Right sidebar ── */}
          <RightSidebar
            projects={projects}
            progress={progress}
            onNew={() => setShowNew(true)}
          />
        </div>
      </div>

      {showNew && userId && (
        <NewProjectModal
          userId={userId}
          onClose={() => setShowNew(false)}
          onCreate={id => { setShowNew(false); router.push(`/projects/${id}`) }}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
