'use client'

import { motion } from 'motion/react'
import {
  ArrowRight,
  ArrowUp,
  Building2,
  CalendarDays,
  Check,
  Circle,
  FolderOpen,
  Home,
  LayoutGrid,
  MapPin,
  MessagesSquare,
  Plus,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { DEFAULT_MILESTONES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CATEGORY_ICON, Container, OutlinePill, Reveal, ease } from './ui'

const HOME = DEFAULT_MILESTONES.home

function DashboardMock() {
  return (
    <div aria-hidden className="grid h-[340px] grid-cols-[140px_minmax(0,1fr)] overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 bg-white text-left shadow-[0_-10px_40px_-20px_rgba(7,17,30,0.25)] md:h-[400px] md:grid-cols-[160px_minmax(0,1fr)_240px] lg:grid-cols-[180px_minmax(0,1fr)_260px] dark:border-white/10 dark:bg-[#0D1B2E]">
      <aside className="border-r border-gray-100 p-4 dark:border-white/8">
        <img src="/planr-logo.svg" alt="" className="h-4 dark:invert" />
        <ul className="mt-6 space-y-1 text-[12px] text-gray-500 dark:text-white/55">
          {[
            { i: LayoutGrid, t: 'Dashboard' },
            { i: FolderOpen, t: 'Projects', on: true },
            { i: MessagesSquare, t: 'Ask Planr' },
            { i: CalendarDays, t: 'Bookings' },
          ].map(({ i: Icon, t, on }) => (
            <li key={t} className={cn('flex items-center gap-2 rounded-lg px-2 py-1.5', on && 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white')}>
              <Icon className="h-3.5 w-3.5" /> {t}
            </li>
          ))}
        </ul>
      </aside>
      <div className="hidden border-r border-gray-100 p-5 md:block dark:border-white/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-400" />
            <p className="text-[14px] text-gray-900 dark:text-white">Kandy family home</p>
          </div>
          <span className="rounded-full bg-gray-900 px-2.5 py-1 text-[10px] text-white dark:bg-white dark:text-gray-900">Add note</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div className="h-full w-[30%] rounded-full bg-[#81B9E9]" />
        </div>
        <ul className="mt-4 space-y-0.5">
          {HOME.slice(1, 7).map((m, i) => (
            <li key={m} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12px] even:bg-gray-50/70 dark:even:bg-white/[0.03]">
              {i < 2 ? (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  <Check className="h-2 w-2" />
                </span>
              ) : (
                <Circle className={cn('h-3.5 w-3.5', i === 2 ? 'text-[#3B83BE]' : 'text-gray-300 dark:text-white/20')} />
              )}
              <span className={cn('flex-1 truncate', i < 2 ? 'text-gray-400' : 'text-gray-700 dark:text-white/75')}>{m}</span>
              <span className="text-[10px] text-gray-400">{i < 2 ? 'Done' : i === 2 ? 'This week' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-gray-50/60 p-4 dark:bg-white/[0.02]">
        <div className="rounded-2xl bg-[linear-gradient(to_right,#1A3050,#81B9E9)] p-4 text-white">
          <img src="/ai-icon.svg" alt="" className="h-7 w-7 rounded-full" />
          <p className="mt-3 text-[13px] font-semibold">Need guidance?</p>
          <p className="mt-1 text-[11px] leading-[17px] text-white/60">Ask Planr AI about permits, costs, materials, and what to expect at each phase.</p>
          <span className="mt-4 block rounded-xl border border-white/20 bg-white/10 py-2 text-center text-[11px] font-semibold">Ask Planr AI</span>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-[11px] dark:border-white/8 dark:bg-white/5">
          <p className="text-gray-400">Next stage</p>
          <p className="mt-0.5 flex items-center justify-between text-gray-700 dark:text-white/80">
            {HOME[3]} <span className="text-[10px] text-gray-400">This week</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function InlineChip({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span className="mx-0.5 inline-flex translate-y-[-2px] items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 align-middle text-[13px] leading-5 text-gray-800 shadow-[0_1px_2px_rgba(7,17,30,0.06)] lg:text-[14px]">
      <Icon className="h-3.5 w-3.5 text-[#3B83BE]" />
      {children}
    </span>
  )
}

export function AiSection() {
  return (
    <section id="ai" className="scroll-mt-20">
      <Container>
        <div className="-mx-5 bg-[#F7F7F7] px-5 pt-16 sm:mx-0 sm:rounded-t-[24px] lg:pt-24 dark:bg-[#0A1525]">
          <Reveal className="mx-auto max-w-[720px] lg:text-center">
            <p className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] text-[#505050] dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-[#3B83BE]" /> Planr AI
            </p>
            <h2 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-gray-900 lg:text-[48px] dark:text-white">
              A building expert
              <span className="mx-1.5 inline-flex h-9 w-9 translate-y-[-4px] items-center justify-center rounded-xl bg-[linear-gradient(135deg,#81B9E9,#E1C1A6)] align-middle text-white lg:h-11 lg:w-11">
                <Sparkles className="h-5 w-5" />
              </span>
              <br className="hidden lg:block" /> on call for your project
            </h2>
            <p className="mt-6 max-w-[560px] text-[15px] lg:mx-auto leading-6 text-[#505050] dark:text-white/60">
              Ask about design, permits, materials, budgets or site work and get a practical answer straight away. It&apos;s one tap from every project.
            </p>
          </Reveal>
          <div className="mt-14 overflow-hidden lg:mt-16 lg:px-0">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 8 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 1.1, ease }}
              style={{ transformPerspective: 1800, transformOrigin: 'bottom center' }}
            >
              <DashboardMock />
            </motion.div>
          </div>
        </div>
      </Container>
      <div className="mx-0 rounded-b-[24px] bg-[linear-gradient(180deg,#F1F1F1_0%,#F7F7F7_30%,#F7F7F7_100%)] px-5 pb-16 pt-16 sm:mx-2 lg:pb-36 lg:pt-32 dark:bg-none dark:bg-[#0A1525]">
        <Reveal className="mx-auto max-w-[720px] lg:text-center">
          <h2 className="text-[34px] font-light leading-[1.1] tracking-[-0.02em] text-gray-900 lg:text-[48px] dark:text-white">
            Ask about your build,
            <br className="hidden lg:block" /> in your own words
          </h2>
          <p className="mt-6 max-w-[540px] text-[15px] lg:mx-auto leading-6 text-[#505050] dark:text-white/60">
            Planr AI gives practical answers on the spot. It doesn&apos;t make up prices, and it suggests a professional when a question needs a hands-on look.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-[864px]">
          <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-[#F6F4F7] p-5 lg:h-[416px] lg:p-10">
            <div className="pointer-events-none absolute -left-24 -top-16 h-[130%] w-[420px] rotate-[-14deg] rounded-full bg-[radial-gradient(closest-side,#3B83BE,#81B9E9_55%,transparent)] opacity-80 blur-2xl" />
            <div className="pointer-events-none absolute -right-20 bottom-[-40%] h-[110%] w-[420px] rounded-full bg-[radial-gradient(closest-side,#E1C1A6,transparent)] opacity-70 blur-2xl" />
            <div className="pointer-events-none absolute right-10 top-[-30%] h-[80%] w-[360px] rounded-full bg-[radial-gradient(closest-side,#F3D9E6,transparent)] opacity-80 blur-2xl" />
            <div className="relative flex h-full items-center">
              <div aria-hidden className="w-full rounded-2xl border border-white/80 bg-white/55 p-5 shadow-[0_8px_40px_-12px_rgba(7,17,30,0.18)] backdrop-blur-xl lg:p-6">
                <p className="text-[17px] leading-[1.75] text-gray-900 lg:text-[20px] lg:leading-[1.65]">
                  We&apos;re building a <InlineChip icon={Home}>two-storey house</InlineChip> in <InlineChip icon={MapPin}>Kandy</InlineChip>. What should I check with our
                  <InlineChip icon={Building2}>structural engineer</InlineChip> before the foundation pour?
                </p>
                <div className="mt-5 flex items-center justify-between text-gray-600">
                  <Plus className="h-4 w-4" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const DISCIPLINES = Object.keys(CATEGORY_ICON)

export function Specialists() {
  return (
    <section id="specialists" className="relative scroll-mt-20 overflow-hidden pb-20 pt-24 lg:h-[800px] lg:pb-0 lg:pt-[110px]">
      <div className="relative mx-auto flex h-[300px] w-full max-w-[900px] items-center justify-center lg:h-[320px]">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(129,185,233,0.10),transparent_65%)]" />
        {[220, 360, 500, 640, 780, 920].map((s, i) => (
          <span
            key={s}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-900/[0.035] dark:border-white/[0.06]"
            style={{ width: s, height: s, opacity: 1 - i * 0.14 }}
          />
        ))}
        {DISCIPLINES.map((d, i) => {
          const Icon = CATEGORY_ICON[d]
          const angle = (i / DISCIPLINES.length) * Math.PI * 2 - Math.PI / 2
          const r = 300
          return (
            <motion.span
              key={d}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease }}
              className="absolute left-1/2 top-1/2 hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] text-[#505050] shadow-[0_2px_8px_-2px_rgba(7,17,30,0.08)] lg:flex dark:border-white/10 dark:bg-[#0D1B2E] dark:text-white/70"
              style={{ x: `calc(${Math.cos(angle) * r}px - 50%)`, y: `calc(${Math.sin(angle) * r * 0.5}px - 50%)` }}
            >
              <Icon className="h-3.5 w-3.5 text-[#3B83BE]" />
              {d}
            </motion.span>
          )
        })}
        <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-[26px] border border-gray-100 bg-white shadow-[0_10px_30px_-8px_rgba(7,17,30,0.18)] dark:border-white/10 dark:bg-[#0D1B2E]">
          <img src="/planr-logo.svg" alt="Planr" className="w-14 dark:invert" />
        </div>
      </div>
      <Container className="relative mt-10 lg:mt-14 lg:text-center">
        <Reveal>
          <h2 className="text-[34px] font-light leading-[1.12] tracking-[-0.02em] text-gray-900 lg:text-[44px] dark:text-white">
            Every specialist
            <br className="hidden lg:block" /> your build needs
          </h2>
          <p className="mt-6 max-w-[440px] text-[15px] leading-6 text-[#505050] lg:mx-auto dark:text-white/60">
            Seven disciplines on one platform, so you can bring in the right person at the right stage.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 lg:hidden">
            {DISCIPLINES.map((d) => {
              const Icon = CATEGORY_ICON[d]
              return (
                <li key={d} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] text-[#505050] dark:border-white/10 dark:bg-[#0D1B2E] dark:text-white/70">
                  <Icon className="h-3.5 w-3.5 text-[#3B83BE]" />
                  {d}
                </li>
              )
            })}
          </ul>
          <OutlinePill href="/signup" className="mt-8">
            Find a consultant <ArrowRight className="h-3.5 w-3.5" />
          </OutlinePill>
        </Reveal>
      </Container>
    </section>
  )
}
