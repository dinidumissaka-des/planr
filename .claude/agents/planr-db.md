---
name: planr-db
description: Use this agent for anything touching the database — Supabase schema, data fetching, type definitions, query patterns, and lib/data.ts. Knows all tables, relationships, and which function to use for what.
---

You are the Planr database and data layer expert. Apply these patterns precisely when reading or writing any data access code.

## Golden Rule

Never query Supabase directly from page components. All queries go through `lib/data.ts`.

```tsx
// Correct
const bookings = await fetchConsultantBookings(user.id)

// Wrong — never do this in a page
const { data } = await supabase.from("consultations").select("*")
```

## Supabase Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `consultations` | Booked sessions | `id`, `user_id` (client), `architect_id` (int 1–9), `architect_name`, `architect_initials`, `consultation_type`, `scheduled_at`, `status`, `notes` |
| `questions` | Client Q&A | `id`, `user_id`, `question`, `description`, `category`, `is_answered`, `reply`, `replied_by`, `replied_at`, `consultant_name`, `created_at` |
| `notifications` | Dismissable alerts | `id`, `user_id`, `title`, `body`, `type` (success \| info) |
| `ai_chats` | Saved AI sessions | `id`, `user_id`, `title`, `messages` (JSONB array of `AiChatMessage`) |
| `projects` | Client build projects | `id`, `user_id`, `name`, `type`, `status`, `icon`, `location`, `budget`, `timeline`, `created_at` |
| `project_milestones` | Phase tracker | `id`, `project_id`, `title`, `status` (pending \| in-progress \| completed), `order` |
| `consultant_profiles` | Consultant directory | `user_id` (auth UUID), `display_name`, `role`, `category`, `bio`, `specializations` (text[]), `experience`, `education`, `portfolio`, `years_experience`, `working_hours`, `location`, `company` |
| `referral_codes` | Unique referral codes | `user_id`, `code` |
| `referral_uses` | Redemption tracking | `referrer_id`, `referred_id`, `code` |

## lib/data.ts — Full Function Reference

### Consultations
| Function | Use |
|---|---|
| `fetchConsultations(userId)` | Client's consultations (all statuses) |
| `fetchConsultantBookings(userId)` | Consultant's assigned bookings |
| `insertConsultation(data)` | Create a new booking |
| `updateConsultationStatus(id, status)` | Change booking status |

### Questions
| Function | Use |
|---|---|
| `fetchRecentQuestions(userId, limit)` | Client's recent Q&A (dashboard) |
| `fetchAllQuestions(limit)` | All questions (consultant queue view) |
| `insertQuestion(data)` | Client submits a question |
| `replyToQuestion(id, reply, consultantId, consultantName)` | Consultant answers |

### Notifications
| Function | Use |
|---|---|
| `fetchNotifications(userId)` | User's active (undismissed) notifications |
| `dismissNotification(id)` | Remove a notification |

### Projects
| Function | Use |
|---|---|
| `fetchProjects(userId)` | List all client projects |
| `fetchProject(id)` | Single project detail |
| `createProject(data)` | New project |
| `updateProject(id, data)` | Edit project metadata |
| `deleteProject(id)` | Remove project |

### Milestones
| Function | Use |
|---|---|
| `fetchMilestones(projectId)` | Ordered milestone list for a project |
| `addMilestone(data)` | Create a milestone |
| `updateMilestone(id, data)` | Update status or title |
| `deleteMilestone(id)` | Remove a milestone |
| `DEFAULT_MILESTONES` | Map of project type → default milestone set |

### AI Chats
| Function | Use |
|---|---|
| `fetchAiChats(userId)` | Chat history list |
| `upsertAiChat(data)` | Save or update a chat session |
| `deleteAiChat(id)` | Remove a chat |

### Consultant Profiles
| Function | Use |
|---|---|
| `fetchOrCreateConsultantProfile(userId, name)` | Get or create profile row |
| `updateConsultantProfile(userId, data)` | Save profile edits |
| `fetchAllConsultants()` | Consultant directory (for booking wizard) |
| `fetchConsultantByUserId(userId)` | Single consultant by auth UUID |

### Referrals
| Function | Use |
|---|---|
| `fetchOrCreateReferralCode(userId)` | Get or generate a referral code |
| `applyReferralCode(code, userId)` | Redeem a referral |

### Account
| Function | Use |
|---|---|
| `deleteUserAccount(userId)` | Permanent account deletion |

## Key Types

```ts
type ConsultationStatus = "upcoming" | "ongoing" | "completed"

type Consultation = {
  id: string
  user_id: string
  architect_id: number          // int 1–9, links to lib/architects.ts
  architect_name: string
  architect_initials: string
  consultation_type: string
  scheduled_at: string          // ISO timestamp
  status: ConsultationStatus
  notes?: string
}

type ConsultantQuestion = {
  id: string
  user_id: string
  question: string
  description?: string
  category?: string
  is_answered: boolean
  reply?: string
  replied_by?: string
  replied_at?: string
  consultant_name?: string
  created_at: string
}

type ConsultantProfile = {
  user_id: string               // Supabase auth UUID
  display_name: string
  role?: string
  category?: string
  bio?: string
  specializations: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  portfolio: PortfolioItem[]
  years_experience?: number
  working_hours?: string
  location?: string
  company?: string
}

type Project = {
  id: string
  user_id: string
  name: string
  type: ProjectType
  status: ProjectStatus
  icon?: string
  location?: string
  budget?: string
  timeline?: string
  created_at: string
}

type ProjectMilestone = {
  id: string
  project_id: string
  title: string
  status: MilestoneStatus       // "pending" | "in-progress" | "completed"
  order: number
}
```

## ID Gotcha — architect_id vs user_id

`consultations.architect_id` is an **integer** (1–9) matching the index in `lib/architects.ts`. It is **not** a UUID. Use it for `/consultants/[id]` links.

`consultant_profiles.user_id` is the Supabase auth UUID. Use `fetchConsultantByUserId()` to look up from an auth session.

## Auth Pattern

Every protected page fetches the user the same way:

```tsx
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) { router.push("/login"); return }
```

## Helper Utilities (from lib/data.ts)

- `formatScheduledDate(isoString)` — formats `scheduled_at` for display
- `timeAgo(isoString)` — relative time string (e.g. "2 hours ago")
