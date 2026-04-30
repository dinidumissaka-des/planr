# Planr

Architecture consultation and project tracking platform connecting clients with building professionals in Sri Lanka. Two user types: **Clients** (book consultations, track build projects, ask questions) and **Consultants** (manage bookings, answer questions, maintain profiles).

## Commands

```bash
npm run dev        # Dev server → localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest unit tests
npm run storybook  # Component docs → localhost:6006
```

## Framework Warning

This project uses **Next.js 16.2.2** which has breaking changes vs earlier versions — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before touching routing, server components, or middleware. Heed all deprecation notices.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.2 (App Router, `"use client"` pages) |
| Database / Auth | Supabase (PostgreSQL + Supabase Auth) |
| AI | Anthropic Claude via `@anthropic-ai/sdk` — Haiku model, streaming |
| Styling | Tailwind CSS v4 — **no `tailwind.config.js`**; all tokens in `app/globals.css` |
| Icons | Lucide React only — no emojis in UI components |
| UI Primitives | shadcn (Base UI / base-nova style) via `components/ui/` |
| Language | TypeScript strict mode |

## Route Structure

| Prefix | Audience |
|---|---|
| `/` `/login` `/signup` `/forgot-password` | Public |
| `/onboarding` | Client onboarding (required before dashboard) |
| `/dashboard` `/bookings` `/projects` `/question-answer` `/profile` `/settings` `/billing` `/referral` | Clients |
| `/consultant/*` | Consultants |
| `/api/chat` `/api/availability` | API routes |

`middleware.ts` enforces auth, role splitting (client vs consultant), and onboarding gates. Consultants are blocked from client routes and vice versa.

## Page Layout Pattern

Every authenticated page uses this shell:

```tsx
<div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
  <AppSidebar />  {/* or <ConsultantSidebar /> for consultant pages */}
  <div className="flex-1 flex flex-col overflow-hidden">
    <AppHeader title="Page Title" />
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* page content */}
    </div>
  </div>
</div>
```

`pb-20` (mobile) accounts for the bottom navigation bar. `pb-6` (desktop) is standard.

### Right Sidebar (desktop only)

Pages with a contextual right sidebar use a two-column layout:

```tsx
<div className="flex flex-col lg:flex-row gap-5">
  <div className="flex-1 min-w-0 flex flex-col gap-5">
    {/* main content */}
  </div>
  <div className="hidden lg:flex w-[280px] flex-shrink-0 flex-col gap-4 self-start">
    {/* sidebar cards */}
  </div>
</div>
```

## Key Files

| File | Purpose |
|---|---|
| `middleware.ts` | Auth routing, role split, onboarding gates |
| `lib/data.ts` | All Supabase queries and TypeScript types — use this, never raw Supabase in components |
| `lib/supabase.ts` | `createClient()` factory |
| `lib/architects.ts` | Static consultant seed data (IDs 1–9, integer) |
| `lib/utils.ts` | `cn()` — clsx + tailwind-merge |
| `app/globals.css` | Tailwind v4 `@theme inline` — all brand tokens live here |
| `components/app-header.tsx` | Header with role-aware user dropdown (detects consultant role) |
| `components/app-sidebar.tsx` | Client navigation sidebar |
| `components/consultant-sidebar.tsx` | Consultant navigation sidebar |
| `components/command-palette.tsx` | Cmd+K palette |

## Design Quick Reference

Full rules: `.claude/agents/planr-brand.md`

| Surface | Light | Dark |
|---|---|---|
| Page | `bg-gray-50` | `dark:bg-[#07111E]` |
| Card | `bg-white border border-gray-100 rounded-2xl` | `dark:bg-[#0D1B2E] dark:border-white/8` |
| Sidebar | `bg-white` | `dark:bg-[#0A1525]` |

- **Primary button**: `bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl`
- **Brand color backgrounds**: never add `dark:` overrides — both modes must look identical
- **Inline `color:` styles**: can't respond to dark mode; split into `className` with `dark:text-*`
- **Card shadow**: `shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]`

## Data Layer Rules

- Never query Supabase directly from page components — always use `lib/data.ts` functions
- `architect_id` on `consultations` is an **integer** (1–9) linking to `lib/architects.ts`, not a UUID
- `consultant_profiles.user_id` IS the Supabase auth UUID
- Auth check pattern in every protected page:

```tsx
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) { router.push("/login"); return }
```

## Code Conventions

- No comments unless the *why* is non-obvious (not the what)
- No backwards-compat shims, unused exports, or `_var` renames
- All shared types defined in `lib/data.ts` — import from there
- `cn()` from `lib/utils.ts` for conditional class merging
- Prefer editing existing files over creating new ones

## Agents

| Agent | When to use |
|---|---|
| `.claude/agents/planr-brand.md` | UI, colors, dark mode, layout patterns, component design |
| `.claude/agents/planr-persona.md` | Copy, UX decisions, product naming, tone of voice |
| `.claude/agents/planr-db.md` | Database schema, Supabase queries, data layer patterns |
