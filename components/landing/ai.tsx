'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Calculator, FileCheck2, HardHat, Layers, LayoutDashboard, MessageSquareText, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal, ease } from './reveal'

const DEMOS = [
  {
    q: 'Do I need approval before adding a second floor?',
    a: "Yes. You'll need building plan approval from your local authority — the Municipal Council or Pradeshiya Sabha — before work starts. Your architect prepares the drawings, and a structural engineer should confirm the existing foundation can take the extra load.",
  },
  {
    q: "What should I check in a contractor's quote?",
    a: 'Look for quantities and rates for every item, a clear list of exclusions, payment stages tied to milestones, and who supplies materials. A quantity surveyor can compare two quotes line by line.',
  },
  {
    q: 'How do I keep a house cool without AC?',
    a: 'Run the long walls east–west so the sun hits the short sides, add deep roof overhangs and verandahs, and use cross-ventilation with high openings so hot air can escape. Courtyards and planting help too.',
  },
]

export function CornerMarks({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map(c => (
        <span key={c} className={`absolute h-3 w-3 border-secondary-400/70 ${c}`} />
      ))}
    </span>
  )
}

function useDemoCycle() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [streamed, setStreamed] = useState(0)
  const demo = DEMOS[index]
  const words = demo.a.split(' ')

  useEffect(() => {
    if (reduce) {
      setTyped(demo.q.length)
      setStreamed(words.length)
      return
    }
    let t: ReturnType<typeof setTimeout>
    if (typed < demo.q.length) t = setTimeout(() => setTyped(typed + 1), 28)
    else if (streamed < words.length) t = setTimeout(() => setStreamed(streamed + 1), streamed === 0 ? 700 : 45)
    else
      t = setTimeout(() => {
        setIndex((index + 1) % DEMOS.length)
        setTyped(0)
        setStreamed(0)
      }, 4200)
    return () => clearTimeout(t)
  }, [reduce, typed, streamed, index, demo.q.length, words.length])

  return { index, demo, words, typed, streamed, thinking: typed === demo.q.length && streamed === 0 }
}

export function AiConsole({ className }: { className?: string }) {
  const { index, demo, words, typed, streamed, thinking } = useDemoCycle()

  return (
    <div className={cn('relative rounded-2xl border border-white/12 bg-[#0A1525]/85 p-1 shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl', className)}>
      <CornerMarks className="-inset-2" />
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img src="/ai-icon.svg" alt="" className="h-6 w-6 rounded-full" />
          <span className="text-[13px] font-semibold text-white">Planr AI</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-secondary-300">
          <span className={cn('h-1.5 w-1.5 rounded-full bg-secondary-400', (thinking || streamed < words.length) && 'animate-pulse')} />
          {thinking ? 'Thinking' : streamed < words.length && streamed > 0 ? 'Answering' : 'Ready'}
        </span>
      </div>
      <div className="flex min-h-[248px] flex-col gap-4 px-4 py-5">
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[14px] leading-relaxed text-gray-900">
          {demo.q.slice(0, typed)}
          {typed < demo.q.length && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-gray-900" />}
        </div>
        {typed === demo.q.length && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="flex gap-3">
            <img src="/ai-icon.svg" alt="" className="mt-0.5 h-6 w-6 shrink-0 rounded-full" />
            <p className="text-[14px] leading-[1.65] text-white/85">
              {thinking ? (
                <span className="inline-flex gap-1 pt-2">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary-400" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </span>
              ) : (
                <>
                  {words.slice(0, streamed).join(' ')}
                  {streamed < words.length && <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-pulse bg-secondary-400" />}
                </>
              )}
            </p>
          </motion.div>
        )}
      </div>
      <div className="m-1 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="flex-1 truncate text-[13.5px] text-white/35">Ask about permits, costs, materials…</span>
        <span className="hidden font-mono text-[10.5px] text-white/30 sm:block">0{index + 1} / 0{DEMOS.length}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-900">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
}

const SKILLS = [
  { icon: FileCheck2, title: 'Permits & approvals', body: 'What you need, who issues it and what to prepare before you apply.' },
  { icon: Calculator, title: 'Costs & budgets', body: 'Realistic ranges and what drives them — never made-up prices.' },
  { icon: Layers, title: 'Design & materials', body: 'Layouts, ventilation and finishes that suit the climate.' },
  { icon: HardHat, title: 'Site & contractors', body: 'Quotes, BOQs, timelines and how to manage the build.' },
]

const PLACES = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: MessageSquareText, label: 'Ask Planr' },
  { icon: FolderKanban, label: 'Inside every project' },
]

export function AiSection() {
  return (
    <section id="ai" className="relative overflow-hidden bg-[#07111E] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(129,185,233,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(129,185,233,.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex items-center gap-4 border-t border-white/15 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
          <span className="text-secondary-300">01</span>
          <span>Planr AI</span>
        </div>

        <div className="mt-10 grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <h2 className="text-[clamp(38px,4.6vw,64px)] leading-[1.02] font-semibold tracking-[-0.045em]">
                An assistant that <em className="font-serif font-normal italic tracking-[-0.02em] text-secondary-300">knows construction.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[460px] text-[16px] leading-[1.65] text-white/60">
                Planr AI is built for Sri Lankan builds. Ask it anything about your project and get a clear, practical answer in seconds — day or night. When a question needs eyes on site, it points you to the right professional.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {SKILLS.map((s, i) => (
                <Reveal key={s.title} delay={0.05 * i} className="bg-[#07111E] p-5 transition-colors hover:bg-[#0A1828]">
                  <div className="mb-6 flex items-center justify-between">
                    <s.icon className="h-5 w-5 text-secondary-300" strokeWidth={1.6} />
                    <span className="font-mono text-[10.5px] text-white/30">0{i + 1}</span>
                  </div>
                  <h3 className="mb-1.5 text-[15.5px] font-semibold">{s.title}</h3>
                  <p className="text-[13.5px] leading-[1.6] text-white/55">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15} className="md:col-span-6 md:pt-4">
            <div className="relative rounded-2xl border border-white/10 bg-[#0D1B2E] p-5 md:p-6">
              <CornerMarks className="-inset-2" />
              <div className="mb-5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/40">
                <span>Two-storey house · Nugegoda</span>
                <span className="text-sand-400">Stage 4 / 10</span>
              </div>
              <div className="rounded-xl border border-sand-400/30 bg-sand-400/[0.06] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">Foundation</span>
                  <span className="flex items-center gap-1.5 text-[12px] text-sand-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sand-400" />
                    In progress
                  </span>
                </div>
                <div className="mt-1 text-[12.5px] text-white/50">Footings poured — curing until 6 May</div>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[14px] text-gray-900">
                  Can the bricklayers start on the walls this week?
                </div>
                <div className="flex gap-3">
                  <img src="/ai-icon.svg" alt="" className="mt-0.5 h-6 w-6 shrink-0 rounded-full" />
                  <div className="text-[14px] leading-[1.65] text-white/85">
                    Not yet. Concrete footings need to stay moist and undisturbed while they cure — usually at least seven days. Loading them early risks cracking. Ask your engineer to sign off before walls go up.
                    <a
                      href="/signup"
                      className="group mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-secondary-400/40"
                    >
                      <span>
                        <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-secondary-300">Suggested</span>
                        <span className="text-[13.5px] font-semibold text-white">Book a structural engineer</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/40">Available in</span>
              {PLACES.map(p => (
                <span key={p.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[12.5px] text-white/75">
                  <p.icon className="h-3.5 w-3.5 text-secondary-300" />
                  {p.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
