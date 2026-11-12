'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import {
  ArrowRight,
  ArrowUp,
  Bath,
  BrickWall,
  Building2,
  CalendarDays,
  Check,
  Circle,
  ClipboardList,
  DoorOpen,
  DraftingCompass,
  Droplets,
  Fence,
  FileCheck2,
  FolderOpen,
  Hammer,
  Home,
  Hotel,
  Lamp,
  Layers,
  LayoutGrid,
  MapPin,
  MessagesSquare,
  Mountain,
  PaintRoller,
  PencilRuler,
  Plus,
  Ruler,
  Shovel,
  Sparkles,
  Store,
  Sun,
  Trees,
  Truck,
  UtensilsCrossed,
  Warehouse,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { DEFAULT_MILESTONES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CATEGORY_ICON, Container, OutlinePill, Reveal, ease } from './ui'

const HOME = DEFAULT_MILESTONES.home

const rowList = { show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }
const rowItem = { hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }
const tick = { hidden: { scale: 0.3, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.35, ease, delay: 0.15 } } }

function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const state = inView ? 'show' : 'hidden'
  return (
    <div ref={ref} aria-hidden className="grid h-[340px] grid-cols-[140px_minmax(0,1fr)] overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 bg-white text-left shadow-[0_-10px_40px_-20px_rgba(7,17,30,0.25)] md:h-[400px] md:grid-cols-[160px_minmax(0,1fr)_240px] lg:grid-cols-[180px_minmax(0,1fr)_260px] dark:border-white/10 dark:bg-[#171717]">
      <aside className="border-r border-gray-100 p-4 dark:border-white/8">
        <img src="/planr-logo.svg" alt="" className="h-4 dark:hidden" /><img src="/planr-logo-light.svg" alt="" className="h-4 hidden dark:block" />
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
          <motion.div
            className="h-full w-[30%] origin-left rounded-full bg-[#81B9E9] dark:bg-white/70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          />
        </div>
        <motion.ul className="mt-4 space-y-0.5" initial="hidden" animate={state} variants={rowList}>
          {HOME.slice(1, 7).map((m, i) => (
            <motion.li key={m} variants={rowItem} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12px] even:bg-gray-50/70 dark:even:bg-white/[0.03]">
              {i < 2 ? (
                <motion.span variants={tick} className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  <Check className="h-2 w-2" />
                </motion.span>
              ) : (
                <Circle className={cn('h-3.5 w-3.5', i === 2 ? 'text-[#3B83BE]' : 'text-gray-300 dark:text-white/20')} />
              )}
              <span className={cn('flex-1 truncate', i < 2 ? 'text-gray-400' : 'text-gray-700 dark:text-white/75')}>{m}</span>
              <span className="text-[10px] text-gray-400">{i < 2 ? 'Done' : i === 2 ? 'This week' : ''}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <div className="flex flex-col gap-3 bg-gray-50/60 p-4 dark:bg-white/[0.02]">
        <div className="rounded-2xl bg-[linear-gradient(to_right,#1A3050,#81B9E9)] dark:bg-[linear-gradient(to_right,#1C1C1C,#3A3A3A)] p-4 text-white">
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
    <span className="mx-0.5 inline-flex translate-y-[-2px] items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 align-middle text-[13px] leading-5 text-gray-800 shadow-[0_1px_2px_rgba(7,17,30,0.06)] lg:text-[14px] dark:border-white/15 dark:bg-white/10 dark:text-white/90">
      <Icon className="h-3.5 w-3.5 text-[#3B83BE] dark:text-[#D4D4D4]" />
      {children}
    </span>
  )
}

export function AiSection() {
  return (
    <section id="ai" className="scroll-mt-20">
      <Container>
        <div className="-mx-5 bg-[#F7F7F7] px-5 pt-16 sm:mx-0 sm:rounded-t-[24px] lg:pt-24 dark:bg-[#111111]">
          <Reveal className="mx-auto max-w-[720px] lg:text-center">
            <p className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] text-[#505050] dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-[#3B83BE]" /> Planr AI
            </p>
            <h2 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-gray-900 lg:text-[48px] dark:text-white">
              A building expert
              <span className="mx-1.5 inline-flex h-9 w-9 translate-y-[-4px] items-center justify-center rounded-xl bg-[linear-gradient(135deg,#81B9E9,#E1C1A6)] dark:bg-[linear-gradient(135deg,#3A3A3A,#6B6B6B)] align-middle text-white lg:h-11 lg:w-11">
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
      <div className="mx-0 rounded-b-[24px] bg-[linear-gradient(180deg,#F1F1F1_0%,#F7F7F7_30%,#F7F7F7_100%)] px-5 pb-16 pt-16 sm:mx-2 lg:pb-36 lg:pt-32 dark:bg-none dark:bg-[#111111]">
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
          <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-[#F6F4F7] p-5 lg:h-[416px] lg:p-10 dark:border-white/10 dark:bg-[#171717]">
            <div className="pointer-events-none absolute -left-24 -top-16 h-[130%] w-[420px] rotate-[-14deg] rounded-full bg-[radial-gradient(closest-side,#3B83BE,#81B9E9_55%,transparent)] opacity-80 blur-2xl dark:opacity-40 dark:grayscale" />
            <div className="pointer-events-none absolute -right-20 bottom-[-40%] h-[110%] w-[420px] rounded-full bg-[radial-gradient(closest-side,#E1C1A6,transparent)] opacity-70 blur-2xl dark:opacity-25" />
            <div className="pointer-events-none absolute right-10 top-[-30%] h-[80%] w-[360px] rounded-full bg-[radial-gradient(closest-side,#F3D9E6,transparent)] opacity-80 blur-2xl dark:opacity-15" />
            <div className="relative flex h-full items-center">
              <div aria-hidden className="w-full rounded-2xl border border-white/80 bg-white/55 p-5 shadow-[0_8px_40px_-12px_rgba(7,17,30,0.18)] backdrop-blur-xl lg:p-6 dark:border-white/10 dark:bg-[#0A0A0A]/60 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
                <p className="text-[17px] leading-[1.75] text-gray-900 lg:text-[20px] lg:leading-[1.65] dark:text-white">
                  We&apos;re building a <InlineChip icon={Home}>two-storey house</InlineChip> in <InlineChip icon={MapPin}>Kandy</InlineChip>. What should I check with our
                  <InlineChip icon={Building2}>structural engineer</InlineChip> before the foundation pour?
                </p>
                <div className="mt-5 flex items-center justify-between text-gray-600 dark:text-white/50">
                  <Plus className="h-4 w-4" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
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

type Tile = { icon: LucideIcon; tone: string; label?: string } | 'planr'

const TONES = [
  'text-[#3B83BE] dark:text-[#D4D4D4]',
  'text-gray-900 dark:text-white',
  'text-[#81B9E9] dark:text-[#A3A3A3]',
  'text-[#B07E56] dark:text-[#BDBDBD]',
  'text-[#2F8F6B] dark:text-[#A3A3A3]',
  'text-[#5E7FA8] dark:text-[#A3A3A3]',
]

const discipline = (label: string): Tile => ({ icon: CATEGORY_ICON[label], tone: TONES[0], label })
const deco = (icon: LucideIcon, tone: number): Tile => ({ icon, tone: TONES[tone] })

const TILE_ROWS: Tile[][] = [
  [deco(Ruler, 1), deco(Sun, 3), deco(PencilRuler, 5), discipline('Architecture'), discipline('Interior Design'), deco(Lamp, 3), deco(DoorOpen, 1), deco(Droplets, 2), deco(Fence, 4)],
  [deco(Mountain, 4), deco(Hotel, 5), deco(BrickWall, 3), discipline('Quantity Surveying'), discipline('Structural Engineering'), 'planr', discipline('Landscape Architecture'), discipline('Urban Design'), deco(Zap, 3), deco(Store, 1), deco(Warehouse, 5)],
  [deco(Truck, 1), deco(Shovel, 3), deco(Layers, 5), deco(Hammer, 1), discipline('Construction'), deco(PaintRoller, 2), deco(Bath, 5), deco(UtensilsCrossed, 3), deco(Trees, 4)],
]

const OUTER = (row: number, i: number) => (row === 1 ? i < 2 || i > 8 : i < 2 || i > 6)

function TileGrid() {
  let order = 0
  return (
    <div className="relative flex flex-col items-center gap-1.5 [mask-image:linear-gradient(to_right,transparent,black_28%,black_72%,transparent)] sm:gap-2 lg:gap-3">
      {TILE_ROWS.map((row, r) => (
        <div key={r} className="flex gap-1.5 sm:gap-2 lg:gap-3">
          {row.map((tile, i) => {
            const delay = 0.04 * order++
            const hideSmall = OUTER(r, i) && 'max-lg:hidden'
            if (tile === 'planr') {
              return (
                <motion.div
                  key="planr"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                  transition={{ duration: 0.6, ease }}
                  className="relative z-10 flex h-11 w-11 items-center justify-center rounded-[12px] border border-gray-100 bg-white shadow-[0_12px_32px_-8px_rgba(7,17,30,0.22)] sm:h-[72px] sm:w-[72px] sm:rounded-[18px] lg:-my-1.5 lg:h-[100px] lg:w-[100px] lg:rounded-[22px] dark:border-white/15 dark:bg-[#1F1F1F]"
                >
                  <span className="block h-6 w-6 overflow-hidden sm:h-8 sm:w-8 lg:h-10 lg:w-10">
                    <img src="/planr-logo.svg" alt="Planr" className="h-full w-auto max-w-none dark:hidden" /><img src="/planr-logo-light.svg" alt="Planr" className="h-full w-auto max-w-none hidden dark:block" />
                  </span>
                </motion.div>
              )
            }
            const Icon = tile.icon
            return (
              <motion.div
                key={`${r}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.5, delay, ease }}
                role={tile.label ? 'img' : undefined}
                aria-label={tile.label}
                aria-hidden={tile.label ? undefined : true}
                className={cn(
                  'group relative flex h-11 w-11 items-center justify-center rounded-[12px] border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(7,17,30,0.04)] transition-transform duration-300 hover:z-30 hover:-translate-y-0.5 sm:h-16 sm:w-16 sm:rounded-[16px] lg:h-[88px] lg:w-[88px] lg:rounded-[20px] dark:border-white/10 dark:bg-[#171717]',
                  hideSmall,
                )}
              >
                <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8', tile.tone)} strokeWidth={1.6} />
                {tile.label && (
                  <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 lg:block dark:bg-white dark:text-gray-900">
                    {tile.label}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function Specialists() {
  return (
    <section id="specialists" className="relative scroll-mt-20 overflow-hidden pb-20 pt-20 lg:pb-24 lg:pt-[100px]">
      <div className="relative mx-auto flex w-full max-w-[1100px] items-center justify-center">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(129,185,233,0.10),transparent_65%)] dark:grayscale" />
        {[220, 360, 500, 640, 780, 920].map((s, i) => (
          <span
            key={s}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-900/[0.035] dark:border-white/[0.06]"
            style={{ width: s, height: s, opacity: 1 - i * 0.14 }}
          />
        ))}
        <TileGrid />
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
                <li key={d} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] text-[#505050] dark:border-white/10 dark:bg-[#171717] dark:text-white/70">
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
