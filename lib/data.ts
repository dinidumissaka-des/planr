import { createClient } from "./supabase"

// ─── Types ─────────────────────────────────────────────────

export type AiChatMessage = { role: "user" | "ai"; text: string; time: string }

export type AiChat = {
  id: string
  title: string
  messages: AiChatMessage[]
  created_at: string
  updated_at: string
}

export type ConsultationStatus = "upcoming" | "ongoing" | "completed"

export type Consultation = {
  id: string
  architect_id: number | null
  architect_name: string
  architect_initials: string
  consultation_type: string
  scheduled_at: string
  status: ConsultationStatus
}

export type RecentQuestion = {
  id: string
  question: string
  consultant_name: string
  consultant_initials: string
  consultant_role: string
  created_at: string
}

// ─── Helpers ───────────────────────────────────────────────

export function formatScheduledDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return `${seconds} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? "s" : ""} ago`
}

export type Notification = {
  id: string
  type: "success" | "info" | "warning"
  title: string
  body: string
  read: boolean
  created_at: string
}

// ─── Fetch functions ───────────────────────────────────────

/**
 * Fetches all consultations for a user, ordered by scheduled_at ascending.
 * Returns [] gracefully if the table doesn't exist yet.
 *
 * Expected schema:
 *   consultations (
 *     id uuid primary key,
 *     user_id uuid references auth.users,
 *     architect_name text,
 *     architect_initials text,
 *     consultation_type text,
 *     scheduled_at timestamptz,
 *     status text  -- 'upcoming' | 'ongoing' | 'completed'
 *   )
 */
export async function fetchConsultations(userId: string): Promise<Consultation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("consultations")
    .select("id, architect_id, architect_name, architect_initials, consultation_type, scheduled_at, status")
    .eq("user_id", userId)
    .order("scheduled_at", { ascending: true })
  if (error) return []
  return (data ?? []) as Consultation[]
}

/**
 * Fetches the most recent questions asked by a user.
 * Returns [] gracefully if the table doesn't exist yet.
 *
 * Expected schema:
 *   questions (
 *     id uuid primary key,
 *     user_id uuid references auth.users,
 *     question text,
 *     consultant_name text,
 *     consultant_initials text,
 *     consultant_role text,
 *     created_at timestamptz default now()
 *   )
 */
/**
 * Fetches all notifications for a user, newest first.
 * Returns [] gracefully if the table doesn't exist yet.
 *
 * Expected schema: see SQL migration in docs/notifications.sql
 */
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) return []
  return (data ?? []) as Notification[]
}

/**
 * Deletes a notification by id (dismiss).
 */
export async function dismissNotification(id: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("notifications").delete().eq("id", id)
}

export async function fetchRecentQuestions(
  userId: string,
  limit = 2
): Promise<RecentQuestion[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("questions")
    .select("id, question, consultant_name, consultant_initials, consultant_role, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []) as RecentQuestion[]
}

/**
 * Inserts a new consultation row for a user (status defaults to 'upcoming').
 */
export async function insertConsultation(
  userId: string,
  payload: {
    architect_id: number
    architect_name: string
    architect_initials: string
    consultation_type: string
    scheduled_at: string
    notes?: string
    categories?: string[]
  }
): Promise<void> {
  const supabase = createClient()
  await supabase.from("consultations").insert({
    user_id: userId,
    architect_id: payload.architect_id,
    architect_name: payload.architect_name,
    architect_initials: payload.architect_initials,
    consultation_type: payload.consultation_type,
    scheduled_at: payload.scheduled_at,
    status: "upcoming",
    notes: payload.notes ?? null,
    categories: payload.categories ?? [],
  })
}

/**
 * Fetches all AI chat sessions for a user, newest first.
 */
export async function fetchAiChats(userId: string): Promise<AiChat[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("ai_chats")
    .select("id, title, messages, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(20)
  return (data ?? []) as AiChat[]
}

/**
 * Creates or updates an AI chat session.
 * Pass chatId=null to create a new one; returns the id.
 */
export async function upsertAiChat(
  userId: string,
  chatId: string | null,
  title: string,
  messages: AiChatMessage[]
): Promise<string | null> {
  const supabase = createClient()
  if (chatId) {
    await supabase
      .from("ai_chats")
      .update({ messages, updated_at: new Date().toISOString() })
      .eq("id", chatId)
      .eq("user_id", userId)
    return chatId
  }
  const { data } = await supabase
    .from("ai_chats")
    .insert({ user_id: userId, title, messages })
    .select("id")
    .single()
  return data?.id ?? null
}

/**
 * Deletes an AI chat session.
 */
export async function deleteAiChat(userId: string, chatId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("ai_chats").delete().eq("id", chatId).eq("user_id", userId)
}

// ─── Project Board Types ────────────────────────────────────

export type ProjectType = "home" | "restaurant" | "hotel" | "commercial" | "renovation"
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed"
export type MilestoneStatus = "pending" | "in_progress" | "completed" | "blocked"

export type Project = {
  id: string
  user_id: string
  name: string
  type: ProjectType
  description: string | null
  location: string | null
  status: ProjectStatus
  cover_emoji: string
  created_at: string
  updated_at: string
}

export type ProjectMilestone = {
  id: string
  project_id: string
  user_id: string
  title: string
  status: MilestoneStatus
  due_date: string | null
  notes: string | null
  order_index: number
  created_at: string
}

// ─── Project Board Data ─────────────────────────────────────

const DEFAULT_MILESTONES: Record<ProjectType, string[]> = {
  home: [
    "Planning & Design",
    "Permits & Approvals",
    "Site Preparation",
    "Foundation",
    "Framing & Structure",
    "Roofing",
    "Electrical & Plumbing",
    "Interior Finishing",
    "Exterior & Landscaping",
    "Final Inspection & Handover",
  ],
  restaurant: [
    "Concept & Planning",
    "Permits & Health Approvals",
    "Site Preparation",
    "Structural Work",
    "Kitchen & Ventilation",
    "Electrical & Plumbing",
    "Interior Design & Fit-out",
    "Signage & Exterior",
    "Equipment Installation",
    "Soft Opening & Handover",
  ],
  hotel: [
    "Feasibility & Design",
    "Permits & Approvals",
    "Site Preparation",
    "Foundation & Structure",
    "Roofing & Waterproofing",
    "MEP (Mechanical, Electrical, Plumbing)",
    "Interior Fit-out",
    "Pool, Landscaping & Exterior",
    "FF&E (Furniture, Fixtures & Equipment)",
    "Commissioning & Handover",
  ],
  commercial: [
    "Feasibility & Planning",
    "Permits & Regulatory Approvals",
    "Site Preparation",
    "Foundation & Structure",
    "Roofing & Facade",
    "MEP Systems",
    "Interior Fit-out",
    "Parking & Exterior",
    "Final Inspections",
    "Handover",
  ],
  renovation: [
    "Assessment & Planning",
    "Permits (if required)",
    "Demolition & Strip-out",
    "Structural Repairs",
    "Electrical & Plumbing Updates",
    "Walls, Floors & Ceilings",
    "Joinery & Built-ins",
    "Painting & Finishing",
    "Fixtures & Fittings",
    "Final Cleanup & Handover",
  ],
}

export const PROJECT_TYPE_EMOJI: Record<ProjectType, string> = {
  home: "🏠",
  restaurant: "🍽️",
  hotel: "🏨",
  commercial: "🏢",
  renovation: "🔨",
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
  return (data ?? []) as Project[]
}

export async function fetchProject(projectId: string): Promise<Project | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()
  return (data ?? null) as Project | null
}

export async function createProject(
  userId: string,
  payload: { name: string; type: ProjectType; description?: string; location?: string }
): Promise<string | null> {
  const supabase = createClient()
  const emoji = PROJECT_TYPE_EMOJI[payload.type]
  const { data } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: payload.name,
      type: payload.type,
      description: payload.description ?? null,
      location: payload.location ?? null,
      status: "planning",
      cover_emoji: emoji,
    })
    .select("id")
    .single()

  const projectId = data?.id ?? null
  if (!projectId) return null

  // Seed default milestones
  const milestones = DEFAULT_MILESTONES[payload.type].map((title, i) => ({
    project_id: projectId,
    user_id: userId,
    title,
    status: "pending",
    order_index: i,
  }))
  await supabase.from("project_milestones").insert(milestones)

  return projectId
}

export async function updateProject(
  projectId: string,
  userId: string,
  patch: Partial<Pick<Project, "name" | "status" | "description" | "location">>
): Promise<void> {
  const supabase = createClient()
  await supabase
    .from("projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("user_id", userId)
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId)
}

export async function fetchMilestones(projectId: string): Promise<ProjectMilestone[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true })
  return (data ?? []) as ProjectMilestone[]
}

export async function updateMilestone(
  milestoneId: string,
  userId: string,
  patch: Partial<Pick<ProjectMilestone, "status" | "due_date" | "notes" | "title">>
): Promise<void> {
  const supabase = createClient()
  await supabase
    .from("project_milestones")
    .update(patch)
    .eq("id", milestoneId)
    .eq("user_id", userId)
}

export async function addMilestone(
  projectId: string,
  userId: string,
  title: string,
  orderIndex: number
): Promise<void> {
  const supabase = createClient()
  await supabase.from("project_milestones").insert({
    project_id: projectId,
    user_id: userId,
    title,
    status: "pending",
    order_index: orderIndex,
  })
}

export async function deleteMilestone(milestoneId: string, userId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("project_milestones").delete().eq("id", milestoneId).eq("user_id", userId)
}

/**
 * Inserts a new question row for a user.
 * Consultant fields default to 'Planr Team' until a consultant is assigned.
 */
export async function insertQuestion(
  userId: string,
  payload: {
    question: string
    description?: string
    category?: string
  }
): Promise<void> {
  const supabase = createClient()
  await supabase.from("questions").insert({
    user_id: userId,
    question: payload.question,
    description: payload.description ?? null,
    category: payload.category ?? null,
    consultant_name: "Planr Team",
    consultant_initials: "PT",
    consultant_role: "Support",
  })
}
