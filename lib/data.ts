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
  user_id: string
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
    .select("id, user_id, architect_id, architect_name, architect_initials, consultation_type, scheduled_at, status")
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

export type ProjectType = "home" | "restaurant" | "hotel" | "commercial" | "renovation" | "other"
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
  other: [
    "Planning & Scoping",
    "Permits & Approvals",
    "Site Preparation",
    "Structural Work",
    "MEP (Mechanical, Electrical, Plumbing)",
    "Interior Work",
    "Exterior Work",
    "Final Inspections",
    "Cleanup",
    "Handover",
  ],
}

export const PROJECT_TYPE_EMOJI: Record<ProjectType, string> = {
  home: "🏠",
  restaurant: "🍽️",
  hotel: "🏨",
  commercial: "🏢",
  renovation: "🔨",
  other: "🏗️",
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
// ─── Referral System ───────────────────────────────────────

export type ReferralStats = {
  code: string
  conversions: number
}

function generateReferralCode(userId: string): string {
  return `PLANR-${userId.replace(/-/g, "").slice(0, 6).toUpperCase()}`
}

/**
 * Upserts the user's referral code row and returns their stats.
 * Run docs/referrals.sql in Supabase first.
 */
export async function fetchOrCreateReferralCode(userId: string): Promise<ReferralStats> {
  const supabase = createClient()
  const code = generateReferralCode(userId)

  await supabase
    .from("referral_codes")
    .upsert({ user_id: userId, code }, { onConflict: "user_id" })

  const { data: uses } = await supabase
    .from("referral_uses")
    .select("id")
    .eq("code", code)

  return { code, conversions: uses?.length ?? 0 }
}

/**
 * Records a successful referral conversion after a new user signs up.
 * Silently no-ops if the code is invalid or the user was already referred.
 */
export async function applyReferralCode(code: string, referredUserId: string): Promise<void> {
  const supabase = createClient()

  const { data: codeRow } = await supabase
    .from("referral_codes")
    .select("user_id")
    .eq("code", code.toUpperCase())
    .single()

  if (!codeRow || codeRow.user_id === referredUserId) return

  await supabase.from("referral_uses").insert({
    code: code.toUpperCase(),
    referrer_id: codeRow.user_id,
    referred_id: referredUserId,
  })
}

// ─── Consultant Types ───────────────────────────────────────

export type ConsultantProfile = {
  user_id: string
  display_name: string
  specialization: string
  bio: string | null
  years_experience: number | null
  created_at: string
}

export type ConsultantQuestion = {
  id: string
  user_id: string
  question: string
  description: string | null
  category: string | null
  consultant_name: string
  consultant_initials: string
  consultant_role: string
  reply: string | null
  replied_at: string | null
  replied_by: string | null
  is_answered: boolean
  created_at: string
}

// ─── Consultant Data Functions ──────────────────────────────

/**
 * Fetches or creates a consultant profile row.
 * Expected schema: see docs/consultant.sql
 */
export async function fetchOrCreateConsultantProfile(
  userId: string,
  displayName: string
): Promise<ConsultantProfile | null> {
  const supabase = createClient()

  const { data: existing } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (existing) return existing as ConsultantProfile

  const { data: created } = await supabase
    .from("consultant_profiles")
    .insert({ user_id: userId, display_name: displayName, specialization: "General" })
    .select("*")
    .single()

  return (created ?? null) as ConsultantProfile | null
}

/**
 * Updates a consultant's profile.
 */
export async function updateConsultantProfile(
  userId: string,
  patch: Partial<Pick<ConsultantProfile, "display_name" | "specialization" | "bio" | "years_experience">>
): Promise<void> {
  const supabase = createClient()
  await supabase.from("consultant_profiles").update(patch).eq("user_id", userId)
}

/**
 * Fetches all consultations assigned to this consultant user.
 * Requires `consultant_user_id` column on consultations table.
 */
export async function fetchConsultantBookings(consultantUserId: string): Promise<Consultation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("consultations")
    .select("id, architect_id, architect_name, architect_initials, consultation_type, scheduled_at, status, user_id")
    .eq("consultant_user_id", consultantUserId)
    .order("scheduled_at", { ascending: true })
  if (error) return []
  return (data ?? []) as Consultation[]
}

/**
 * Updates the status of a booking (for consultant actions: confirm / complete / cancel).
 */
export async function updateConsultationStatus(
  consultationId: string,
  status: ConsultationStatus
): Promise<void> {
  const supabase = createClient()
  await supabase
    .from("consultations")
    .update({ status })
    .eq("id", consultationId)
}

/**
 * Fetches all questions visible to consultants (all users' questions), newest first.
 */
export async function fetchAllQuestions(limit = 50): Promise<ConsultantQuestion[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("questions")
    .select("id, user_id, question, description, category, consultant_name, consultant_initials, consultant_role, reply, replied_at, replied_by, is_answered, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []) as ConsultantQuestion[]
}

/**
 * Posts a reply to a client question.
 */
export async function replyToQuestion(
  questionId: string,
  reply: string,
  consultantUserId: string,
  consultantName: string
): Promise<void> {
  const supabase = createClient()
  await supabase
    .from("questions")
    .update({
      reply,
      replied_at: new Date().toISOString(),
      replied_by: consultantUserId,
      is_answered: true,
      consultant_name: consultantName,
      consultant_initials: consultantName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
    })
    .eq("id", questionId)
}

// ─── Questions (client) ─────────────────────────────────────

// ─── Credentials & Verification ────────────────────────────

export type CredentialStatus = "pending" | "verified" | "rejected"

export type ConsultantCredential = {
  id: string
  user_id: string
  credential_type: "license" | "certification" | "degree" | "membership"
  title: string
  issuing_body: string
  issued_year: number | null
  doc_path: string | null
  status: CredentialStatus
  created_at: string
}

export async function fetchCredentials(userId: string): Promise<ConsultantCredential[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("consultant_credentials")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return (data ?? []) as ConsultantCredential[]
}

export async function submitCredential(
  userId: string,
  payload: {
    credential_type: ConsultantCredential["credential_type"]
    title: string
    issuing_body: string
    issued_year?: number | null
    file?: File | null
  }
): Promise<ConsultantCredential | null> {
  const supabase = createClient()
  let doc_path: string | null = null

  if (payload.file) {
    const safeName = payload.file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `${userId}/${Date.now()}-${safeName}`
    const { error } = await supabase.storage
      .from("consultant-credentials")
      .upload(path, payload.file, { contentType: payload.file.type })
    if (!error) doc_path = path
  }

  const { data } = await supabase
    .from("consultant_credentials")
    .insert({
      user_id: userId,
      credential_type: payload.credential_type,
      title: payload.title,
      issuing_body: payload.issuing_body,
      issued_year: payload.issued_year ?? null,
      doc_path,
      status: "pending",
    })
    .select("*")
    .single()

  return (data ?? null) as ConsultantCredential | null
}

export async function deleteCredential(credential: ConsultantCredential): Promise<void> {
  const supabase = createClient()
  if (credential.doc_path) {
    await supabase.storage.from("consultant-credentials").remove([credential.doc_path])
  }
  await supabase.from("consultant_credentials").delete().eq("id", credential.id)
}

// ─── Document Vault ────────────────────────────────────────

export type ProjectDocument = {
  id: string
  project_id: string
  user_id: string
  name: string
  size: number
  mime_type: string | null
  storage_path: string
  created_at: string
}

export async function fetchDocuments(projectId: string): Promise<ProjectDocument[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("project_documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
  return (data ?? []) as ProjectDocument[]
}

export async function uploadDocument(
  projectId: string,
  userId: string,
  file: File
): Promise<ProjectDocument | null> {
  const supabase = createClient()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath = `${projectId}/${Date.now()}-${safeName}`

  const { error: storageError } = await supabase.storage
    .from("project-docs")
    .upload(storagePath, file, { contentType: file.type })

  if (storageError) return null

  const { data } = await supabase
    .from("project_documents")
    .insert({
      project_id: projectId,
      user_id: userId,
      name: file.name,
      size: file.size,
      mime_type: file.type || null,
      storage_path: storagePath,
    })
    .select("*")
    .single()

  return (data ?? null) as ProjectDocument | null
}

export async function deleteDocument(doc: ProjectDocument): Promise<void> {
  const supabase = createClient()
  await supabase.storage.from("project-docs").remove([doc.storage_path])
  await supabase.from("project_documents").delete().eq("id", doc.id)
}

export async function getDocumentSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.storage
    .from("project-docs")
    .createSignedUrl(storagePath, 300)
  return data?.signedUrl ?? null
}

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

/**
 * Deletes all data associated with a user across every table, then signs them out.
 * The auth.users row is removed via a cascading DB trigger if configured; otherwise
 * the account becomes an empty shell with no personal data.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  const supabase = createClient()

  await Promise.all([
    supabase.from("project_milestones").delete().eq("user_id", userId),
    supabase.from("ai_chats").delete().eq("user_id", userId),
    supabase.from("consultations").delete().eq("user_id", userId),
    supabase.from("questions").delete().eq("user_id", userId),
    supabase.from("notifications").delete().eq("user_id", userId),
    supabase.from("consultant_profiles").delete().eq("user_id", userId),
  ])

  await Promise.all([
    supabase.from("projects").delete().eq("user_id", userId),
    supabase.from("referral_uses").delete().eq("referrer_id", userId),
    supabase.from("referral_uses").delete().eq("referred_id", userId),
  ])

  await supabase.from("referral_codes").delete().eq("user_id", userId)

  await supabase.auth.signOut()
}
