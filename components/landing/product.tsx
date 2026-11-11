'use client'

import type { ReactNode } from 'react'
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
import { CATEGORY_ICON, Container, Reveal } from './ui'

const STATS = [
  { value: '10', unit: 'stages', caption: 'Tracked on every home build, from planning to handover' },
  { value: '7', unit: 'disciplines', caption: 'From architects to quantity surveyors' },
  { value: '24/7', unit: '', caption: 'Answers from Planr AI, day or night' },
]

export function StatsPanel() {
  return (
    <section className="sm:px-2 lg:px-4">
      <div className="rounded-[20px] border border-gray-200/70 bg-[#F9F9F9] py-16 lg:py-24 dark:border-white/8 dark:bg-[#0A1525]">
        <Container>
          <Reveal>
            <h2 className="max-w-[820px] text-[24px] font-light leading-[1.4] text-gray-900 lg:text-[28px] dark:text-white">
              Planr puts your consultant, your build plan and your questions side by side.{' '}
              <span className="text-[#666666] dark:text-white/50">So nothing important gets lost between site visits.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 grid divide-y divide-gray-200/80 overflow-hidden rounded-[18px] border border-gray-200/80 bg-white lg:mt-12 lg:grid-cols-3 lg:divide-x lg:divide-y-0 dark:divide-white/8 dark:border-white/8 dark:bg-[#0D1B2E]">
              {STATS.map((s) => (
                <div key={s.caption} className="flex h-[240px] flex-col justify-between p-8 lg:h-[320px] lg:p-12">
                  <p className="flex items-start text-gray-900 dark:text-white">
                    <span className="text-[72px] font-light leading-none tracking-[-0.04em] lg:text-[84px]">{s.value}</span>
                    {s.unit && <span className="ml-1.5 mt-1 text-[20px] font-light">{s.unit}</span>}
                  </p>
                  <p className="max-w-[260px] text-[16px] leading-6 text-gray-800 dark:text-white/75">{s.caption}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
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

function Faded({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('select-none opacity-60 saturate-[0.35] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] dark:opacity-50', className)}
      aria-hidden
    >
      {children}
    </div>
  )
}

function BookingMock() {
  const days = Array.from({ length: 14 }, (_, i) => i + 9)
  return (
    <Window>
      <p className="text-[15px] text-gray-800 dark:text-white/85">New consultation</p>
      <p className="mt-0.5 text-[11px] text-gray-400">Kandy family home</p>
      <div className="mt-3 flex flex-wrap gap-4">
        <Chip icon={User}>Roshan Perera</Chip>
        <Chip icon={Building2}>Architecture</Chip>
        <Chip icon={Clock}>1 hour</Chip>
        <Chip icon={MapPin}>Colombo 03</Chip>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="text-center text-[10px] text-gray-400">{d}</span>
        ))}
        {days.map((d) => (
          <span
            key={d}
            className={cn(
              'flex h-7 items-center justify-center rounded-md text-[11px]',
              d === 12 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-white/50',
            )}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'].map((t, i) => (
          <span key={t} className={cn('rounded-full border px-2.5 py-1 text-[10px]', i === 1 ? 'border-[#3B83BE] text-[#3B83BE]' : 'border-gray-200 text-gray-500 dark:border-white/10 dark:text-white/50')}>
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-gray-500 dark:bg-white/5 dark:text-white/50">
        Layout options for a two-storey house on a sloping plot. We want the living area to face the hills.
      </div>
    </Window>
  )
}

function AiPrepMock() {
  return (
    <Window>
      <div className="flex items-center gap-2 text-[13px] text-gray-700 dark:text-white/80">
        <Sparkles className="h-3.5 w-3.5" /> Planr AI
      </div>
      <div className="mt-4 ml-auto w-fit max-w-[78%] rounded-2xl rounded-br-md bg-gray-100 px-3 py-2 text-[11px] text-gray-600 dark:bg-white/10 dark:text-white/70">
        What should I prepare before my first meeting with an architect?
      </div>
      <div className="mt-3 max-w-[88%] space-y-1.5 text-[11px] leading-5 text-gray-500 dark:text-white/55">
        <p>A few things will make the hour far more useful:</p>
        <p>1. Your survey plan and deed</p>
        <p>2. A rough budget range, even if it&apos;s loose</p>
        <p>3. How many bedrooms and bathrooms you need</p>
        <p>4. Photos of homes you like</p>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-[11px] text-gray-400 dark:border-white/10">
        Ask anything about your build
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
          <ArrowUp className="h-3 w-3" />
        </span>
      </div>
    </Window>
  )
}

const HOME = DEFAULT_MILESTONES.home

function MilestoneMock() {
  return (
    <Window className="p-0">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 dark:border-white/8">
        <div>
          <p className="text-[14px] text-gray-800 dark:text-white/85">Kandy family home</p>
          <p className="text-[11px] text-gray-400">Home build</p>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-white/10 dark:text-white/60">3 of {HOME.length} done</span>
      </div>
      <ul className="px-5 py-2">
        {HOME.slice(0, 7).map((m, i) => (
          <li key={m} className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-0 dark:border-white/5">
            {i < 3 ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Check className="h-2.5 w-2.5" />
              </span>
            ) : i === 3 ? (
              <span className="h-4 w-4 rounded-full border-2 border-[#3B83BE] border-r-transparent" />
            ) : (
              <Circle className="h-4 w-4 text-gray-300 dark:text-white/20" />
            )}
            <span className={cn('flex-1 text-[12px]', i < 3 ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-white/75')}>{m}</span>
            <span className="text-[10px] text-gray-400">{i < 3 ? 'Done' : i === 3 ? 'In progress' : 'Pending'}</span>
          </li>
        ))}
      </ul>
    </Window>
  )
}

function NotesMock() {
  return (
    <div className="space-y-3">
      {[
        { t: HOME[3], d: 'Due 14 Mar', n: 'Footing depth confirmed with the engineer after the soil test.' },
        { t: HOME[4], d: 'Due 2 Apr', n: 'Order steel once the column schedule is final.' },
      ].map((x) => (
        <Window key={x.t} className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-gray-800 dark:text-white/85">{x.t}</p>
            <Chip icon={CalendarDays}>{x.d}</Chip>
          </div>
          <p className="mt-2 flex gap-1.5 text-[11px] leading-4 text-gray-500 dark:text-white/50">
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
            {x.n}
          </p>
        </Window>
      ))}
    </div>
  )
}

function ProgressMock() {
  return (
    <Window>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-gray-400">Overall progress</p>
          <p className="mt-1 text-[34px] font-light leading-none text-gray-800 dark:text-white/85">30%</p>
        </div>
        <span className="text-[10px] text-gray-400">Next: {HOME[3]}</span>
      </div>
      <div className="mt-5 flex gap-1">
        {HOME.map((m, i) => (
          <span key={m} className={cn('h-8 flex-1 rounded-sm', i < 3 ? 'bg-[#81B9E9]' : i === 3 ? 'bg-[#81B9E9]/40' : 'bg-gray-100 dark:bg-white/10')} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-400">
        <span>Planning</span>
        <span>Handover</span>
      </div>
    </Window>
  )
}

function AskAiMock() {
  return (
    <Window>
      <div className="flex items-center gap-2 text-[12px] text-gray-700 dark:text-white/80">
        <Sparkles className="h-3.5 w-3.5" /> Planr AI
      </div>
      <div className="mt-3 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-gray-100 px-3 py-2 text-[11px] text-gray-600 dark:bg-white/10 dark:text-white/70">
        Is a flat concrete roof sensible for a house in the hills?
      </div>
      <div className="mt-3 space-y-1 text-[11px] leading-[18px] text-gray-500 dark:text-white/55">
        <p>It can work, but heavy rain is the main risk:</p>
        <p>· Plan a proper fall so water never sits</p>
        <p>· Budget for good waterproofing</p>
        <p>· Ask your architect about overhangs</p>
      </div>
    </Window>
  )
}

function ConsultantMock() {
  const eng = architects[6]
  return (
    <Window>
      <p className="text-[12px] text-gray-800 dark:text-white/85">Can we move the staircase to open up the living room?</p>
      <div className="mt-3 rounded-lg border border-gray-100 p-3 dark:border-white/8">
        <p className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-white/70">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[8px] text-gray-600 dark:bg-white/15 dark:text-white/70">PL</span>
          {eng.name} · {eng.role}
        </p>
        <p className="mt-1.5 text-[11px] leading-5 text-gray-500 dark:text-white/50">
          Send me the latest ground floor plan and I&apos;ll look at the spans. If the landing moves, we may need one extra beam.
        </p>
      </div>
    </Window>
  )
}

function ProfileMock() {
  const a = architects[0]
  const disciplines = Object.keys(CATEGORY_ICON)
  return (
    <div className="flex gap-4">
      <Window className="w-full sm:w-[62%]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-[13px] text-gray-600 dark:bg-white/15 dark:text-white/70">RP</span>
          <div>
            <p className="text-[14px] text-gray-800 dark:text-white/85">{a.name}</p>
            <p className="text-[11px] text-gray-400">{a.role} · {a.company}</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
          <MapPin className="h-3 w-3" /> {a.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.specializations.map((s) => (
            <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-white/10 dark:text-white/60">{s}</span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {a.portfolio.slice(0, 3).map((p) => (
            <div key={p.caption} className="h-14 overflow-hidden rounded-md bg-gray-100 dark:bg-white/10">
              <img src={p.url} alt="" className="h-full w-full object-cover grayscale" />
            </div>
          ))}
        </div>
        <span className="mt-4 flex h-8 items-center justify-center rounded-full bg-gray-900 text-[11px] text-white dark:bg-white dark:text-gray-900">Book consultation</span>
      </Window>
      <Window className="hidden flex-1 p-3 sm:block">
        <p className="px-1 text-[11px] text-gray-400">Disciplines</p>
        <ul className="mt-2 space-y-1">
          {disciplines.map((d) => {
            const Icon = CATEGORY_ICON[d]
            return (
              <li key={d} className={cn('flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[11px]', d === 'Architecture' ? 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80' : 'text-gray-500 dark:text-white/50')}>
                <Icon className="h-3 w-3" /> {d}
              </li>
            )
          })}
        </ul>
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
        <Faded className="relative h-[280px] overflow-hidden px-5 pt-6 lg:h-[320px] lg:px-10 lg:pt-10 xl:col-start-2 xl:row-start-1 xl:h-[450px] xl:pl-0 xl:pr-6 xl:pt-6">{children}</Faded>
        <Caption lead={lead} rest={rest} className="px-6 pb-7 lg:max-w-[560px] lg:px-10 lg:pb-10 xl:col-start-1 xl:row-start-1 xl:max-w-[340px] xl:self-end xl:pr-0" />
      </div>
    </Reveal>
  )
}

function HalfCard({ id, lead, rest, children, delay = 0 }: { id: string; lead: string; rest: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div id={id} className={cn(CARD, 'flex scroll-mt-28 flex-col lg:h-[450px]')}>
        <Faded className="h-[260px] overflow-hidden px-5 pt-6 lg:h-[250px] lg:px-10 lg:pt-10">{children}</Faded>
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
        <div className="grid gap-6 lg:grid-cols-2">
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
      <div className="grid gap-6 lg:grid-cols-2">
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
            One place for every stage <span className="lg:block lg:pl-20">of your build</span>
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
