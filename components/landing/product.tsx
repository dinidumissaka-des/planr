'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowUp,
  Building2,
  CalendarDays,
  Check,
  Circle,
  Clock,
  MapPin,
  Quote,
  Sparkles,
  StickyNote,
  User,
} from 'lucide-react'
import { architects } from '@/lib/architects'
import { DEFAULT_MILESTONES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CATEGORY_ICON, Container, Reveal, ease } from './ui'

const STATS = [
  { value: '10', unit: 'stages', caption: 'Tracked on every home build, from planning to handover' },
  { value: '7', unit: 'disciplines', caption: 'From architects to quantity surveyors' },
  { value: '24/7', unit: '', caption: 'Answers from Planr AI, day or night' },
]

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const DRIFT = { duration: 7, repeat: Infinity, ease: 'easeInOut' } as const

const BANDS = [
  { band: 'left-[-35%] w-[120%]', accent: 'right-[-10%] top-[-20%] bg-[radial-gradient(closest-side,#D9E9F7,transparent)]' },
  { band: 'left-[-25%] w-[150%]', accent: 'left-[-10%] top-[-25%] bg-[radial-gradient(closest-side,#F3E6DA,transparent)]' },
  { band: 'right-[-35%] w-[120%]', accent: 'left-[10%] top-[-20%] bg-[radial-gradient(closest-side,#F1E3D6,transparent)]' },
]

function StatGlow({ variant, active }: { variant: number; active: boolean }) {
  const shape = BANDS[variant % BANDS.length]
  const settle = { duration: 0.5 }
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500', active ? 'opacity-100' : 'opacity-0')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,#EAF3FB,transparent_70%),radial-gradient(ellipse_70%_60%_at_80%_100%,#F6EEE6,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,#12304F,transparent_70%),radial-gradient(ellipse_70%_60%_at_80%_100%,#1B2A3D,transparent_70%)]" />
      <motion.div
        className={cn('absolute h-[60%] w-[70%] rounded-full opacity-80 blur-2xl dark:opacity-25', shape.accent)}
        animate={active ? { x: [0, 24, 0] } : { x: 0 }}
        transition={active ? { ...DRIFT, duration: 9 } : settle}
      />
      <motion.div
        className={cn(
          'absolute bottom-[-42%] h-[70%] rounded-[50%] bg-[radial-gradient(closest-side,#81B9E9,#B9D8F2_55%,transparent)] opacity-70 blur-xl dark:bg-[radial-gradient(closest-side,#3B83BE,#81B9E9_55%,transparent)] dark:opacity-35',
          shape.band,
        )}
        animate={active ? { x: [-24, 24, -24], y: [0, -10, 0] } : { x: 0, y: 0 }}
        transition={active ? DRIFT : settle}
      />
      <div className="absolute inset-0 opacity-[0.22] mix-blend-soft-light" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}

function StatCard({ stat, variant }: { stat: (typeof STATS)[number]; variant: number }) {
  const [active, setActive] = useState(false)
  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="relative flex h-[240px] flex-col justify-between overflow-hidden p-8 lg:h-[320px] lg:p-12"
    >
      <StatGlow variant={variant} active={active} />
      <p className={cn('relative flex items-start transition-colors duration-500', active ? 'text-[#2F6E9F] dark:text-[#9CCBF0]' : 'text-gray-900 dark:text-white')}>
        <span className="text-[72px] font-light leading-none tracking-[-0.04em] lg:text-[84px]">{stat.value}</span>
        {stat.unit && <span className="ml-1.5 mt-1 text-[20px] font-light">{stat.unit}</span>}
      </p>
      <p className={cn('relative max-w-[260px] text-[16px] leading-6 transition-colors duration-500', active ? 'text-[#1F4E74] dark:text-[#F2F8FD]' : 'text-gray-800 dark:text-white/75')}>
        {stat.caption}
      </p>
    </div>
  )
}

export function StatsPanel() {
  return (
    <section className="bg-[#F7F7F7] py-16 lg:py-24 dark:bg-[#0A1525]">
      <Container>
        <Reveal>
          <h2 className="max-w-[820px] text-[24px] font-light leading-[1.4] text-gray-900 lg:text-[28px] dark:text-white">
            Planr puts your consultant, your build plan and your questions side by side.{' '}
            <span className="text-[#666666] dark:text-white/50">So nothing important gets lost between site visits.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 grid divide-y divide-gray-200/80 overflow-hidden rounded-[18px] border border-gray-200/80 bg-white shadow-[0_8px_30px_-20px_rgba(7,17,30,0.12)] lg:mt-12 lg:grid-cols-3 lg:divide-x lg:divide-y-0 dark:divide-white/8 dark:border-white/8 dark:bg-[#0D1B2E]">
            {STATS.map((s, i) => (
              <StatCard key={s.caption} stat={s} variant={i} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function usePlay() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduce = !!useReducedMotion()
  return { ref, play: inView || reduce, reduce }
}

function useTimeline(times: readonly number[], play: boolean, reduce: boolean) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (reduce) {
      setStep(times.length)
      return
    }
    if (!play) return
    const timers = times.map((t, i) => window.setTimeout(() => setStep(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [times, play, reduce])
  return step
}

function Typed({ text, start, reduce, speed = 24 }: { text: string; start: boolean; reduce: boolean; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reduce) {
      setN(text.length)
      return
    }
    if (!start) return
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) window.clearInterval(id)
        return Math.min(text.length, v + 1)
      })
    }, speed)
    return () => window.clearInterval(id)
  }, [start, reduce, text, speed])
  const typing = start && n < text.length
  return (
    <span className="grid">
      <span className="invisible col-start-1 row-start-1">{text}</span>
      <span className="col-start-1 row-start-1">
        {text.slice(0, n)}
        {typing && <span className="ml-px inline-block h-[1em] w-px translate-y-[2px] bg-current" />}
      </span>
    </span>
  )
}

function useCount(target: number, play: boolean, reduce: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (reduce) {
      setValue(target)
      return
    }
    if (!play) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, play, reduce, duration])
  return value
}

function Show({ on, children, className, y = 8 }: { on: boolean; children: ReactNode; className?: string; y?: number }) {
  return (
    <motion.div className={className} initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y }} transition={{ duration: 0.45, ease }}>
      {children}
    </motion.div>
  )
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-gray-400 motion-safe:animate-pulse dark:bg-white/50" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </span>
  )
}

function Window({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,30,0.04)] dark:border-white/10 dark:bg-[#0D1B2E]', className)}>
      {children}
    </div>
  )
}

function Chip({ icon: Icon, children }: { icon: typeof User; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-white/50">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  )
}

function MockFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn('select-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent_99%)] xl:[mask-image:linear-gradient(to_bottom,black_72%,transparent_98%)]', className)}>
      <div className="flex min-h-[calc(100%+80px)] flex-col [&>*]:flex-1">{children}</div>
    </div>
  )
}

const BOOKING_TIMES = [600, 1200, 1700, 4600] as const
const BOOKING_NOTE = 'Layout options for a two-storey house on a sloping plot. We want the living area to face the hills.'

function BookingMock() {
  const { ref, play, reduce } = usePlay()
  const step = useTimeline(BOOKING_TIMES, play, reduce)
  const days = Array.from({ length: 7 }, (_, i) => i + 9)
  return (
    <div ref={ref} className="flex flex-col">
      <Window className="flex-1">
        <p className="text-[15px] text-gray-800 dark:text-white/90">New consultation</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <Chip icon={User}>Roshan Perera</Chip>
          <Chip icon={Building2}>Architecture</Chip>
          <Chip icon={Clock}>1 hour</Chip>
          <Chip icon={MapPin}>Colombo 03</Chip>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-center text-[10px] text-gray-500">{d}</span>
          ))}
          {days.map((d) => {
            const picked = d === 12 && step >= 1
            return (
              <motion.span
                key={d}
                initial={false}
                animate={picked ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease }}
                className={cn(
                  'flex h-7 items-center justify-center rounded-md text-[11px] transition-colors duration-300',
                  picked ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-white/70',
                )}
              >
                {d}
              </motion.span>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'].map((t, i) => (
            <span
              key={t}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[10px] transition-colors duration-300',
                i === 1 && step >= 2 ? 'border-[#3B83BE] bg-[#81B9E9]/15 text-[#2F6E9F] dark:text-[#9CCBF0]' : 'border-gray-200 text-gray-600 dark:border-white/10 dark:text-white/70',
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-gray-600 dark:bg-white/5 dark:text-white/70">
          <Typed text={BOOKING_NOTE} start={step >= 3} reduce={reduce} speed={22} />
        </div>
        <div
          data-payoff
          className={cn(
            'mt-3 flex h-8 items-center justify-center rounded-full text-[11px] transition-colors duration-500',
            step >= 4 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-white/40',
          )}
        >
          Confirm &amp; pay
        </div>
      </Window>
    </div>
  )
}

const CHAT_TIMES = [300, 900, 1700, 2100, 2500, 2900, 3300] as const

function AiPrepMock() {
  const { ref, play, reduce } = usePlay()
  const step = useTimeline(CHAT_TIMES, play, reduce)
  const lines = [
    'A few things will make the hour far more useful:',
    '1. Your survey plan and deed',
    "2. A rough budget range, even if it's loose",
    '3. How many bedrooms and bathrooms you need',
    '4. Photos of homes you like',
  ]
  return (
    <div ref={ref} className="flex flex-col">
      <Window className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[13px] text-gray-700 dark:text-white/90">
          <Sparkles className="h-3.5 w-3.5" /> Planr AI
        </div>
        <Show on={step >= 1} className="mt-4 ml-auto w-fit max-w-[78%] rounded-2xl rounded-br-md bg-gray-100 px-3 py-2 text-[11px] text-gray-700 dark:bg-white/10 dark:text-white/90">
          What should I prepare before my first meeting with an architect?
        </Show>
        <div className="relative mt-3 max-w-[88%] space-y-1.5 text-[11px] leading-5 text-gray-600 dark:text-white/75">
          {step === 2 && (
            <div className="absolute left-0 top-1">
              <Dots />
            </div>
          )}
          {lines.map((l, i) => (
            <Show key={l} on={step >= 3 + i} y={4}>
              <p data-payoff={i === lines.length - 1 || undefined}>{l}</p>
            </Show>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-[11px] text-gray-500 dark:border-white/10">
          Ask anything about your build
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <ArrowUp className="h-3 w-3" />
          </span>
        </div>
      </Window>
    </div>
  )
}

const HOME = DEFAULT_MILESTONES.home
const MILESTONE_TIMES = [500, 900, 1300, 1700] as const

function MilestoneMock() {
  const { ref, play, reduce } = usePlay()
  const step = useTimeline(MILESTONE_TIMES, play, reduce)
  const done = Math.min(step, 3)
  return (
    <div ref={ref} className="flex flex-col">
      <Window className="flex-1 p-0">
        <div className="border-b border-gray-100 px-5 py-3.5 dark:border-white/8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-800 dark:text-white/90">Kandy family home</p>
              <p className="text-[11px] text-gray-500">Home build</p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] tabular-nums text-gray-600 dark:bg-white/10 dark:text-white/80">
              {done} of {HOME.length} done
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-[#81B9E9]"
              initial={false}
              animate={{ scaleX: (done + (step >= 4 ? 0.5 : 0)) / HOME.length }}
              transition={{ duration: 0.5, ease }}
            />
          </div>
        </div>
        <ul className="px-5 py-2">
          {HOME.slice(0, 8).map((m, i) => {
            const isDone = i < done
            const current = i === 3 && step >= 4
            return (
              <li key={m} className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-0 dark:border-white/5">
                {isDone ? (
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease }}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  >
                    <Check className="h-2.5 w-2.5" />
                  </motion.span>
                ) : current ? (
                  <span className="h-4 w-4 rounded-full border-2 border-[#3B83BE] border-r-transparent motion-safe:animate-[spin_1.6s_linear_infinite]" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400 dark:text-white/40" />
                )}
                <span className={cn('flex-1 text-[12px] transition-colors duration-300', isDone ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-white/90')}>{m}</span>
                <span data-payoff={current || undefined} className="text-[10px] text-gray-500">{isDone ? 'Done' : current ? 'In progress' : 'Pending'}</span>
              </li>
            )
          })}
        </ul>
      </Window>
    </div>
  )
}

const NOTES_TIMES = [300, 800, 2600] as const

function NoteCard({ title, date, children, className }: { title: string; date: string; children: ReactNode; className?: string }) {
  return (
    <Window className={cn('p-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-gray-800 dark:text-white/90">{title}</p>
        <Chip icon={CalendarDays}>{date}</Chip>
      </div>
      <p className="mt-2 flex gap-1.5 text-[11px] leading-4 text-gray-600 dark:text-white/70">
        <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
        {children}
      </p>
    </Window>
  )
}

function NotesMock() {
  const { ref, play, reduce } = usePlay()
  const step = useTimeline(NOTES_TIMES, play, reduce)
  return (
    <div ref={ref} className="flex flex-col gap-3">
      <Show on={step >= 1} y={12}>
        <NoteCard title={HOME[3]} date="Due 14 Mar">Footing depth confirmed with the engineer after the soil test.</NoteCard>
      </Show>
      <Show on={step >= 2} y={12}>
        <NoteCard title={HOME[4]} date="Add date">
          <span data-payoff className="flex-1">
            <Typed text="Ask the contractor for two roofing quotes." start={step >= 2} reduce={reduce} speed={30} />
          </span>
        </NoteCard>
      </Show>
      <Show on={step >= 3} y={12} className="flex flex-1 flex-col">
        <NoteCard title={HOME[5]} date="Due 2 May" className="flex-1">
          Roof sheets to be ordered after the frame inspection.
        </NoteCard>
      </Show>
    </div>
  )
}

function ProgressMock() {
  const { ref, play, reduce } = usePlay()
  const pct = useCount(30, play, reduce, 1600)
  const filled = Math.floor(pct / 10)
  return (
    <div ref={ref} className="flex flex-col">
      <Window className="flex-1">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] text-gray-500">Overall progress</p>
            <p data-payoff className="mt-1 text-[34px] font-light leading-none tabular-nums text-gray-800 dark:text-white/90">{pct}%</p>
          </div>
          <span className="text-[10px] text-gray-500">Next: {HOME[3]}</span>
        </div>
        <div className="mt-5 flex gap-1">
          {HOME.map((m, i) => (
            <span key={m} className="relative h-8 flex-1 overflow-hidden rounded-sm bg-gray-100 dark:bg-white/10">
              <motion.span
                className={cn('absolute inset-0 origin-bottom', i === 3 ? 'bg-[#81B9E9]/40' : 'bg-[#81B9E9]')}
                initial={false}
                animate={{ scaleY: i < filled || (i === 3 && pct >= 30) ? 1 : 0 }}
                transition={{ duration: 0.4, ease }}
              />
            </span>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-gray-500">
          <span>Planning</span>
          <span>Handover</span>
        </div>
        <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 dark:border-white/8">
          {HOME.slice(0, 3).map((m) => (
            <p key={m} className="flex items-center justify-between text-[11px] text-gray-600 dark:text-white/70">
              {m}
              <Check className="h-3 w-3 text-[#3B83BE]" />
            </p>
          ))}
        </div>
      </Window>
    </div>
  )
}

const ASK_TIMES = [300, 900, 1800, 2200, 2600, 3000] as const

function AskAiMock() {
  const { ref, play, reduce } = usePlay()
  const step = useTimeline(ASK_TIMES, play, reduce)
  const lines = ['It can work, but heavy rain is the main risk:', '· Plan a proper fall so water never sits', '· Budget for good waterproofing', '· Ask your architect about overhangs']
  return (
    <div ref={ref} className="flex flex-col">
      <Window className="flex-1">
        <div className="flex items-center gap-2 text-[12px] text-gray-700 dark:text-white/90">
          <Sparkles className="h-3.5 w-3.5" /> Planr AI
        </div>
        <Show on={step >= 1} className="mt-3 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-gray-100 px-3 py-2 text-[11px] text-gray-700 dark:bg-white/10 dark:text-white/90">
          Is a flat concrete roof sensible for a house in the hills?
        </Show>
        <div className="relative mt-3 space-y-1 text-[11px] leading-[18px] text-gray-600 dark:text-white/75">
          {step === 2 && (
            <div className="absolute left-0 top-1">
              <Dots />
            </div>
          )}
          {lines.map((l, i) => (
            <Show key={l} on={step >= 3 + i} y={4}>
              <p data-payoff={i === lines.length - 1 || undefined}>{l}</p>
            </Show>
          ))}
        </div>
      </Window>
    </div>
  )
}

const CONSULT_TIMES = [500, 1500] as const

function ConsultantMock() {
  const { ref, play, reduce } = usePlay()
  const step = useTimeline(CONSULT_TIMES, play, reduce)
  const eng = architects[6]
  return (
    <div ref={ref} className="flex flex-col">
      <Window className="flex-1">
        <p className="text-[12px] text-gray-800 dark:text-white/90">Can we move the staircase to open up the living room?</p>
        <Show on={step >= 1} y={4} className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-white/60">
          <Check className="h-3 w-3 text-[#3B83BE]" />
          Sent to {eng.name}
        </Show>
        <div className="mt-3">
          <Show on={step >= 2} className="rounded-lg border border-gray-100 p-3 dark:border-white/8">
            <p className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-white/90">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[8px] text-gray-700 dark:bg-white/15 dark:text-white/90">PL</span>
              {eng.name} · {eng.role}
            </p>
            <p data-payoff className="mt-1.5 text-[11px] leading-5 text-gray-600 dark:text-white/70">
              Send me the latest ground floor plan and I&apos;ll look at the spans. If the landing moves, we may need one extra beam.
            </p>
          </Show>
        </div>
      </Window>
    </div>
  )
}

const stagger = { show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }

function ProfileMock() {
  const { ref, play } = usePlay()
  const a = architects[0]
  const disciplines = Object.keys(CATEGORY_ICON)
  const state = play ? 'show' : 'hidden'
  return (
    <div ref={ref} className="flex gap-4">
      <Window className="w-full sm:w-[62%]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-[13px] text-gray-700 dark:bg-white/15 dark:text-white/90">RP</span>
          <div>
            <p className="text-[14px] text-gray-800 dark:text-white/90">{a.name}</p>
            <p className="text-[11px] text-gray-500">{a.role} · {a.company}</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1 text-[11px] text-gray-500">
          <MapPin className="h-3 w-3" /> {a.location}
        </p>
        <motion.div className="mt-3 flex flex-wrap gap-1.5" initial="hidden" animate={state} variants={stagger}>
          {a.specializations.map((s) => (
            <motion.span key={s} variants={item} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-white/10 dark:text-white/80">
              {s}
            </motion.span>
          ))}
        </motion.div>
        <motion.div className="mt-4 grid grid-cols-3 gap-1.5" initial="hidden" animate={state} variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}>
          {a.portfolio.slice(0, 3).map((p) => (
            <motion.div key={p.caption} variants={item} className="h-14 overflow-hidden rounded-md bg-gray-100 dark:bg-white/10">
              <img src={p.url} alt="" className="h-full w-full object-cover grayscale" />
            </motion.div>
          ))}
        </motion.div>
        <motion.span data-payoff initial="hidden" animate={state} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.9, duration: 0.4 } } }} className="mt-4 flex h-8 items-center justify-center rounded-full bg-gray-900 text-[11px] text-white dark:bg-white dark:text-gray-900">
          Book consultation
        </motion.span>
      </Window>
      <Window className="hidden flex-1 p-3 sm:block">
        <p className="px-1 text-[11px] text-gray-500">Disciplines</p>
        <motion.ul className="mt-2 space-y-1" initial="hidden" animate={state} variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}>
          {disciplines.map((d) => {
            const Icon = CATEGORY_ICON[d]
            return (
              <motion.li key={d} variants={item} className={cn('flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[11px]', d === 'Architecture' ? 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/90' : 'text-gray-600 dark:text-white/70')}>
                <Icon className="h-3 w-3" /> {d}
              </motion.li>
            )
          })}
        </motion.ul>
      </Window>
    </div>
  )
}

function Caption({ lead, rest, className }: { lead: string; rest: string; className?: string }) {
  return (
    <p className={cn('text-[18px] leading-[27px] tracking-[-0.01em] lg:text-[20px] lg:leading-[29px]', className)}>
      <span className="text-gray-900 dark:text-white">{lead}</span> <span className="text-[#666666] dark:text-white/50">{rest}</span>
    </p>
  )
}

const CARD = 'relative overflow-hidden rounded-[20px] border border-gray-900/[0.03] bg-[linear-gradient(160deg,#FAFAFA,#F4F4F4)] dark:border-white/8 dark:bg-none dark:bg-[#0D1B2E]'

function WideCard({ id, lead, rest, children }: { id: string; lead: string; rest: string; children: ReactNode }) {
  return (
    <Reveal>
      <div id={id} className={cn(CARD, 'flex scroll-mt-28 flex-col xl:grid xl:h-[450px] xl:grid-cols-[minmax(0,1fr)_56%] xl:gap-4')}>
        <MockFrame className="relative h-[440px] px-5 pt-5 sm:h-[360px] lg:h-[380px] lg:px-10 lg:pt-6 xl:col-start-2 xl:row-start-1 xl:h-[450px] xl:pl-0 xl:pr-6 xl:pt-6">{children}</MockFrame>
        <Caption lead={lead} rest={rest} className="px-6 pb-7 lg:max-w-[560px] lg:px-10 lg:pb-10 xl:col-start-1 xl:row-start-1 xl:max-w-[340px] xl:self-end xl:pr-0" />
      </div>
    </Reveal>
  )
}

function HalfCard({ id, lead, rest, children, delay = 0 }: { id: string; lead: string; rest: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div id={id} className={cn(CARD, 'flex scroll-mt-28 flex-col lg:h-[450px]')}>
        <MockFrame className="h-[300px] px-5 pt-5 lg:h-[300px] lg:px-8 lg:pt-8">{children}</MockFrame>
        <Caption lead={lead} rest={rest} className="mt-auto px-6 pb-7 lg:max-w-[380px] lg:px-10 lg:pb-10" />
      </div>
    </Reveal>
  )
}

type Block = { id: string; title: string; items: { label: string; href: string }[]; heading: string; body: ReactNode }

const BLOCKS: Block[] = [
  {
    id: 'plan',
    title: 'Plan',
    items: [
      { label: 'Book a consultation', href: '#plan-book' },
      { label: 'Planr AI', href: '#plan-ai' },
    ],
    heading: 'Talk to a professional before anything is poured',
    body: (
      <>
        <WideCard id="plan-book" lead="Book in a few taps." rest="Choose a consultant, pick a slot that suits you and tell them what you want to cover.">
          <BookingMock />
        </WideCard>
        <WideCard id="plan-ai" lead="Arrive prepared." rest="Ask Planr AI what to bring and what to ask, so your hour goes on decisions rather than basics.">
          <AiPrepMock />
        </WideCard>
      </>
    ),
  },
  {
    id: 'track',
    title: 'Track',
    items: [
      { label: 'Milestones', href: '#track-milestones' },
      { label: 'Notes & dates', href: '#track-notes' },
      { label: 'Progress', href: '#track-progress' },
    ],
    heading: 'Follow every stage of the build',
    body: (
      <>
        <WideCard id="track-milestones" lead="A plan from day one." rest="Every project starts with a milestone list made for its type, from a home build to a hotel.">
          <MilestoneMock />
        </WideCard>
        <div className="grid gap-6 xl:grid-cols-2">
          <HalfCard id="track-notes" lead="Notes & dates." rest="Keep due dates and decisions against each stage, so nothing lives only in someone's phone.">
            <NotesMock />
          </HalfCard>
          <HalfCard id="track-progress" lead="Progress at a glance." rest="See what's done, what's next and how far along the build really is." delay={0.08}>
            <ProgressMock />
          </HalfCard>
        </div>
      </>
    ),
  },
  {
    id: 'ask',
    title: 'Ask',
    items: [
      { label: 'Planr AI', href: '#ask-ai' },
      { label: 'Consultants', href: '#ask-consultant' },
    ],
    heading: 'Answers while the question still matters',
    body: (
      <div className="grid gap-6 xl:grid-cols-2">
        <HalfCard id="ask-ai" lead="Two ways to ask." rest="Get an instant answer from Planr AI for the everyday questions.">
          <AskAiMock />
        </HalfCard>
        <HalfCard id="ask-consultant" lead="A professional eye." rest="Put the question to a consultant when it needs someone who knows structure, cost or design." delay={0.08}>
          <ConsultantMock />
        </HalfCard>
      </div>
    ),
  },
  {
    id: 'find',
    title: 'Find',
    items: [
      { label: 'Consultant profiles', href: '#find-profiles' },
      { label: 'Disciplines', href: '#specialists' },
    ],
    heading: 'The right specialist for each stage',
    body: (
      <WideCard id="find-profiles" lead="Know who you're booking." rest="Profiles show each consultant's discipline, practice, location and past projects before you commit.">
        <ProfileMock />
      </WideCard>
    ),
  },
]

export function ProductSection() {
  return (
    <section id="product" className="scroll-mt-20 pt-20 lg:pt-[120px]">
      <Container>
        <Reveal>
          <h2 className="font-serif text-[36px] font-light leading-[1.08] tracking-[-0.02em] text-gray-900 lg:text-[48px] dark:text-white">
            One place for every stage <span className="lg:block">of your build</span>
          </h2>
        </Reveal>
        <div className="mt-16 space-y-24 lg:mt-[100px] lg:space-y-[180px]">
          {BLOCKS.map((b) => (
            <div key={b.id} id={b.id} className="scroll-mt-24 lg:grid lg:grid-cols-[276px_minmax(0,1fr)] lg:pr-8">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-[18px] text-gray-900 lg:text-[20px] dark:text-white">{b.title}</p>
                <ul className="mt-4 hidden space-y-2 lg:block">
                  {b.items.map((it) => (
                    <li key={it.label}>
                      <a href={it.href} className="text-[14px] leading-5 text-[#666666] transition-colors hover:text-gray-900 dark:text-white/50 dark:hover:text-white">
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mt-4 text-[26px] font-light leading-[1.2] tracking-[-0.01em] text-gray-900 lg:mt-0 lg:text-[30px] dark:text-white">{b.heading}</h3>
                <div className="mt-8 space-y-6 lg:mt-10 lg:space-y-7">{b.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function StatementPanel() {
  return (
    <section className="py-20 lg:py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-[#81B9E9]/30 bg-[#F4F8FC] px-6 py-14 dark:border-white/10 dark:bg-[#0D1B2E] text-center lg:h-[473px] lg:px-24 lg:py-0">
            <div className="pointer-events-none absolute -left-24 -top-10 h-[140%] w-[180px] lg:w-[300px] rotate-[18deg] rounded-full bg-[linear-gradient(180deg,#81B9E9,#3B83BE)] opacity-90 blur-md max-lg:opacity-60 dark:opacity-35" />
            <div className="pointer-events-none absolute -right-28 top-1/3 h-[120%] w-[240px] -rotate-[20deg] rounded-full bg-[linear-gradient(180deg,#81B9E9,#E1C1A6)] opacity-60 blur-md dark:opacity-25" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3B83BE_1px,transparent_1px)] [background-size:6px_6px] opacity-[0.12] [mask-image:linear-gradient(90deg,black,transparent_25%,transparent_75%,black)]" />
            <div className="relative flex h-full flex-col items-center justify-center">
              <img src="/planr-logo.svg" alt="Planr" className="h-6 dark:invert" />
              <p className="mt-8 max-w-[760px] text-[22px] leading-[1.45] text-gray-900 lg:text-[28px] dark:text-white">
                <Quote className="mr-2 hidden h-4 w-4 -translate-y-2 rotate-180 text-gray-300 lg:inline dark:text-white/25" />
                An hour with the right professional early on costs far less than fixing a decision once the walls are up. Planr is built around that idea.
                <Quote className="ml-2 hidden h-4 w-4 -translate-y-2 text-gray-300 lg:inline dark:text-white/25" />
              </p>
              <p className="mt-8 text-[14px] text-gray-900 dark:text-white">Why Planr exists</p>
              <p className="text-[12px] text-[#666666] dark:text-white/50">From the Planr team</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
