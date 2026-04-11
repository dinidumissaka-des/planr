import { createClient } from "./supabase"

// ─── Types ─────────────────────────────────────────────────

export type ConsultationStatus = "upcoming" | "ongoing" | "completed"

export type Consultation = {
  id: string
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
    .select("id, architect_name, architect_initials, consultation_type, scheduled_at, status")
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
