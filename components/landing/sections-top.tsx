'use client'

import { motion } from 'motion/react'
import { ArrowRight, BadgeCheck, Building2, HardHat, Home, MessageSquareText, Sofa, Sparkle, Trees, UserRoundSearch, Zap } from 'lucide-react'
import ScrollVelocity from '@/components/reactbits/ScrollVelocity'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { Reveal, SectionLabel } from './reveal'

const MARQUEE = ['Residential Design', 'Interior Architecture', 'Urban Planning', 'Landscape Design', 'Commercial Spaces', 'Sustainable Build', 'Expert Consultation', 'Construction']

export function Marquee() {
  const row = (offset: number) => (
    <span className="inline-flex items-center">
      {MARQUEE.map((item, i) => (
        <span key={item} className="inline-flex items-center">
          <span
            className={
              (i + offset) % 2 === 0
                ? 'bg-gradient-to-r from-[#3B83BE] via-secondary-400 to-sand-400 bg-clip-text px-6 text-transparent'
                : 'px-6 text-transparent [-webkit-text-stroke:1px_rgba(129,185,233,.45)]'
            }
          >
            {item}
          </span>
          <Sparkle className="h-5 w-5 fill-gold-400 text-gold-400 md:h-7 md:w-7" />
        </span>
      ))}
    </span>
  )

  return (
    <div className="relative overflow-hidden border-y border-gray-100 bg-white py-8 dark:border-white/8 dark:bg-[#07111E]">
      <ScrollVelocity
        texts={[row(0), row(1)]}
        velocity={40}
        numCopies={3}
        className="text-[40px] font-extrabold tracking-[-0.03em] md:text-[64px]"
        scrollerClassName="scroller !text-[inherit] !leading-[1.15] !drop-shadow-none"
        parallaxClassName="parallax mask-fade-x"
      />
    </div>
  )
}

const CATEGORIES = [
  { icon: Home, name: 'Residential Architect', count: '2,400+', grad: 'from-secondary-300 to-[#3B83BE]' },
  { icon: Sofa, name: 'Interior Architect', count: '3,100+', grad: 'from-sand-300 to-[#D4A882]' },
  { icon: Trees, name: 'Landscape Architect', count: '1,800+', grad: 'from-emerald-300 to-emerald-600' },
  { icon: Building2, name: 'Urban Design', count: '900+', grad: 'from-mist-300 to-[#8298BA]' },
  { icon: HardHat, name: 'Construction', count: '4,200+', grad: 'from-gold-300 to-[#B8A93E]' },
]

const cardVars = {
  '--spotlight-card-surface': 'var(--lp-card)',
  '--spotlight-card-border': 'var(--lp-card-border)',
  '--spotlight-card-shadow': 'var(--lp-card-shadow)',
} as React.CSSProperties

export function Categories() {
  return (
    <section id="categories" className="relative overflow-hidden bg-gray-50 px-5 py-24 dark:bg-[#07111E]">
      <div className="pointer-events-none absolute inset-0 bg-dots mask-radial opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <Reveal><SectionLabel>Browse by expertise</SectionLabel></Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900 dark:text-white">
                Find your perfect
                <br />
                <span className="bg-gradient-to-r from-[#3B83BE] to-secondary-400 bg-clip-text text-transparent">expert match</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <a href="/signup" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:text-white/60 dark:hover:text-white">
              View all categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.07} className={i === 4 ? 'col-span-2 md:col-span-1' : ''}>
              <SpotlightCard
                spotlightColor="rgba(129,185,233,0.55)"
                className="group h-full cursor-pointer !p-5 transition-transform duration-300 hover:-translate-y-1.5"
                style={cardVars}
              >
                <div className={`mb-10 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.grad} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-[14px] font-bold text-gray-900 dark:text-white">{c.name}</div>
                <div className="mt-1 flex items-center justify-between text-[12px] font-medium text-gray-500 dark:text-white/50">
                  {c.count} experts
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { icon: MessageSquareText, tag: 'Ask', title: 'Ask your question', desc: 'Tell us your challenge in any category, any time. Our system understands what you need.' },
  { icon: UserRoundSearch, tag: 'Match', title: 'We match you instantly', desc: 'Connected in minutes with the best verified expert — no waiting, no searching.' },
  { icon: Zap, tag: 'Build', title: 'Chat with an expert', desc: 'Talk, text, or call till you have your answer. Members get unlimited consultations 24/7.' },
]

export function What() {
  return (
    <section id="what" className="relative overflow-hidden bg-white px-5 py-28 dark:bg-[#07111E]">
      <div className="pointer-events-none absolute top-1/2 left-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-sand-400/20 blur-[120px] dark:bg-[#3B83BE]/15" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Reveal><SectionLabel>What it is</SectionLabel></Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-[clamp(32px,4.2vw,56px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-gray-900 dark:text-white">
              Expert architecture advice,{' '}
              <span className="bg-gradient-to-r from-[#3B83BE] via-secondary-400 to-sand-400 bg-clip-text text-transparent">whenever you need it.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-md text-[16px] leading-relaxed text-gray-500 dark:text-white/55">
              Buildinghelp connects homeowners, developers, and builders with verified architects, interior designers, and construction specialists — matched in under 2 minutes. From first concept to final build, your expert is always here.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <a href="/signup" className="group mt-2 inline-flex h-11 items-center gap-2 rounded-xl bg-gray-900 px-5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] dark:bg-white dark:text-gray-900">
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative overflow-hidden rounded-3xl p-px">
            <div className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,#81B9E9_90deg,#E1C1A6_160deg,transparent_220deg)] [animation-duration:8s]" />
            <div className="relative rounded-[23px] bg-white p-6 dark:bg-[#0D1B2E]">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">12,000+ Verified Experts</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Online now
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Sarah Chen', role: 'Residential Architect · MIT', grad: 'from-secondary-300 to-[#3B83BE]', w: '86%' },
                  { name: 'Marcus Reed', role: 'Interior Architect · RCA London', grad: 'from-sand-300 to-[#D4A882]', w: '72%' },
                  { name: 'Priya Nair', role: 'Landscape Architect · UCL', grad: 'from-mist-300 to-[#8298BA]', w: '64%' },
                ].map((e, i) => (
                  <motion.div
                    key={e.name}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5 dark:border-white/6 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${e.grad}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-1 text-[13px] font-bold text-gray-900 dark:text-white">
                          {e.name}
                          <BadgeCheck className="h-3.5 w-3.5 text-[#3B83BE] dark:text-secondary-400" />
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-white/45">{e.role}</div>
                      </div>
                      <span className="rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-bold text-white dark:bg-white dark:text-gray-900">Consult</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: e.w }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-[#3B83BE] via-secondary-400 to-sand-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function How() {
  return (
    <section id="how" className="relative overflow-hidden bg-[#07111E] px-5 py-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-50" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B83BE]/30 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary-400">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary-400" />
              How it works
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-[clamp(32px,4.5vw,60px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Three steps.{' '}
              <span className="bg-gradient-to-r from-secondary-400 via-sand-400 to-gold-400 bg-clip-text text-transparent">Under two minutes.</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative grid gap-5 md:grid-cols-3">
          <div className="pointer-events-none absolute top-[52px] right-[16%] left-[16%] hidden h-px bg-white/10 md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full origin-left bg-gradient-to-r from-secondary-400 via-sand-400 to-gold-400"
            />
          </div>
          {STEPS.map((s, i) => (
            <Reveal key={s.tag} delay={0.15 + i * 0.15}>
              <div className="group relative h-full rounded-3xl border border-white/8 bg-white/[0.03] p-7 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-secondary-400/40 hover:bg-white/[0.06]">
                <div className="relative mb-8 flex h-14 w-14 items-center justify-center">
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary-400 to-sand-400 opacity-20 blur-md transition-opacity group-hover:opacity-60" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#0D1B2E]">
                    <s.icon className="h-6 w-6 text-secondary-300" />
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-[44px] leading-none font-extrabold text-transparent">0{i + 1}</span>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/50">{s.tag}</span>
                </div>
                <h3 className="mb-2 text-[20px] font-bold tracking-tight">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-white/50">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
