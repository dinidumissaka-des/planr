'use client'

import { ArrowRight, BadgeCheck, Lock, MessagesSquare, Quote, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react'
import CountUp from '@/components/reactbits/CountUp'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { Reveal, SectionLabel } from './reveal'

const STATS = [
  { to: 12000, separator: ',', suffix: '+', label: 'Verified experts globally', grad: 'from-secondary-300 to-[#3B83BE]' },
  { to: 10, suffix: 'M+', label: 'Members helped worldwide', grad: 'from-sand-300 to-[#D4A882]' },
  { to: 4.9, suffix: '', label: 'Average expert satisfaction', grad: 'from-gold-300 to-gold-400', star: true },
  { to: 24, suffix: '/7', label: 'Expert availability', grad: 'from-mist-300 to-[#8298BA]' },
]

export function Stats() {
  return (
    <section id="stats" className="bg-white px-5 py-20 dark:bg-[#07111E]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className={`group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br ${s.grad} p-6 md:p-7`}>
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.12)_0_1px,transparent_1px_12px)]" />
              <div className="relative flex items-baseline gap-0.5 text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-0.03em] text-[#07111E]">
                <CountUp to={s.to} separator={s.separator} duration={2} />
                <span>{s.suffix}</span>
                {s.star && <Star className="ml-1 h-6 w-6 self-center fill-[#07111E] text-[#07111E]" />}
              </div>
              <div className="relative mt-2 text-[13px] font-semibold text-[#07111E]/60">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const EXPERTS = [
  { grad: 'from-secondary-200 via-secondary-400 to-[#3B83BE]', tag: 'Residential', name: 'Sarah Chen', role: 'Residential Architect · MIT', rating: '4.9', reviews: '342' },
  { grad: 'from-sand-200 via-sand-400 to-[#D4A882]', tag: 'Interior', name: 'Marcus Reed', role: 'Interior Architect · RCA London', rating: '5.0', reviews: '218' },
  { grad: 'from-mist-200 via-mist-400 to-[#8298BA]', tag: 'Landscape', name: 'Priya Nair', role: 'Landscape Architect · UCL', rating: '4.8', reviews: '156' },
  { grad: 'from-gold-100 via-gold-300 to-gold-400', tag: 'Urban', name: 'James Okafor', role: 'Urban Designer · Yale', rating: '4.9', reviews: '289' },
]

export function Experts() {
  return (
    <section id="experts" className="relative overflow-hidden bg-gray-50 px-5 py-28 dark:bg-[#07111E]">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-40 dark:opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <Reveal><SectionLabel>Our network</SectionLabel></Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900 dark:text-white">
                Meet the <span className="bg-gradient-to-r from-[#3B83BE] to-sand-400 bg-clip-text text-transparent">Experts</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <a href="/signup" className="group inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-[13px] font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-white">
              Browse all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {EXPERTS.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.08}>
              <div className="group h-full overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_-12px_rgba(59,131,190,.35)] dark:border-white/8 dark:bg-[#0D1B2E]">
                <div className="relative h-48 overflow-hidden md:h-56">
                  <div className={`absolute inset-0 bg-gradient-to-br ${e.grad} transition-transform duration-700 group-hover:scale-110`} />
                  <div className="absolute inset-0 bg-dots opacity-40 mix-blend-overlay" />
                  <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-xl transition-all duration-700 group-hover:h-40 group-hover:w-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111E]/25 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full border border-white/40 bg-white/25 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.06em] text-white backdrop-blur-md">
                    {e.tag}
                  </span>
                  <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-[#07111E]/70 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
                    <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                    {e.rating}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[14px] font-bold text-gray-900 dark:text-white">
                    {e.name}
                    <BadgeCheck className="h-4 w-4 text-[#3B83BE] dark:text-secondary-400" />
                  </div>
                  <div className="mt-0.5 mb-4 text-[12px] text-gray-500 dark:text-white/50">{e.role}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] text-gray-400 dark:text-white/40">{e.reviews} reviews</span>
                    <span className="rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-bold text-white transition-transform group-hover:scale-105 dark:bg-white dark:text-gray-900">
                      Consult
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const cardVars = {
  '--spotlight-card-surface': 'var(--lp-card)',
  '--spotlight-card-border': 'var(--lp-card-border)',
  '--spotlight-card-shadow': 'var(--lp-card-shadow)',
} as React.CSSProperties

export function Why() {
  return (
    <section id="why" className="relative overflow-hidden bg-white px-5 py-28 dark:bg-[#07111E]">
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-secondary-400/20 blur-[130px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center">
          <Reveal><SectionLabel>Why buildinghelp</SectionLabel></Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-[clamp(32px,4.5vw,60px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-gray-900 dark:text-white">
              Stop guessing.{' '}
              <span className="bg-gradient-to-r from-[#3B83BE] via-secondary-400 to-sand-400 bg-clip-text text-transparent">Get real answers.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-[16px] leading-relaxed text-gray-500 dark:text-white/55">
              Finding the right professional used to take weeks of calls, referrals, and dead ends. We fixed that. Every expert is verified, every consultation is private, and help is always one tap away.
            </p>
          </Reveal>
        </div>

        <div className="grid auto-rows-[minmax(200px,auto)] gap-3 md:grid-cols-3">
          <Reveal className="md:col-span-2 md:row-span-2">
            <SpotlightCard spotlightColor="rgba(129,185,233,0.5)" className="flex h-full flex-col justify-between !p-8" style={cardVars}>
              <div>
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-300 to-[#3B83BE] shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </span>
                <h3 className="mb-2 text-[24px] font-extrabold tracking-tight text-gray-900 dark:text-white">8-step verification</h3>
                <p className="max-w-md text-[14.5px] leading-relaxed text-gray-500 dark:text-white/55">Licences, skills, and peer review. Only the top professionals make it onto the platform.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Licence check', 'Portfolio review', 'Identity', 'Peer review', 'Skills test', 'References', 'Interview', 'Background'].map((step, i) => (
                  <span
                    key={step}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[12px] font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-secondary-400 to-[#3B83BE] text-[9px] font-extrabold text-white">{i + 1}</span>
                    {step}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex items-end gap-8">
                <div>
                  <div className="text-[44px] leading-none font-extrabold tracking-tight text-gray-900 dark:text-white">12k+</div>
                  <div className="mt-1 text-[12.5px] font-medium text-gray-500 dark:text-white/50">Verified experts worldwide</div>
                </div>
                <div>
                  <div className="text-[44px] leading-none font-extrabold tracking-tight text-gray-900 dark:text-white">4.9</div>
                  <div className="mt-1 text-[12.5px] font-medium text-gray-500 dark:text-white/50">Average expert rating</div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
          {[
            { icon: Zap, title: 'Under 2 minutes', desc: 'Connected to the right expert in under 2 minutes.', grad: 'from-sand-300 to-[#D4A882]' },
            { icon: Lock, title: '100% private', desc: 'Your project details stay with you.', grad: 'from-mist-300 to-[#8298BA]' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={0.1 + i * 0.1}>
              <SpotlightCard spotlightColor="rgba(225,193,166,0.55)" className="h-full !p-7" style={cardVars}>
                <span className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.grad} shadow-lg`}>
                  <f.icon className="h-5 w-5 text-white" />
                </span>
                <h3 className="mb-1.5 text-[18px] font-bold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-gray-500 dark:text-white/55">{f.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
          <Reveal delay={0.1} className="md:col-span-3">
            <SpotlightCard spotlightColor="rgba(219,207,99,0.5)" className="flex h-full flex-col items-start gap-6 !p-7 md:flex-row md:items-center" style={cardVars}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-[#B8A93E] shadow-lg">
                <MessagesSquare className="h-5 w-5 text-white" />
              </span>
              <div className="flex-1">
                <h3 className="mb-1 text-[18px] font-bold text-gray-900 dark:text-white">Unlimited consultations, 24/7</h3>
                <p className="text-[14px] text-gray-500 dark:text-white/55">Any category, any time — always available, always private.</p>
              </div>
              <a href="/signup" className="group inline-flex h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-[13px] font-semibold text-white dark:bg-white dark:text-gray-900">
                Try it free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const TESTIMONIALS = [
  { grad: 'from-secondary-300 to-[#3B83BE]', text: 'Buildinghelp connected me with an incredible architect who completely transformed my vision into reality. The process was seamless and incredibly fast.', name: 'Lincoln Ekström', meta: 'Residential project · Stockholm' },
  { grad: 'from-sand-300 to-[#D4A882]', text: 'I had been struggling to find the right interior designer for months. Within 2 minutes I had three incredible matches. Absolutely brilliant.', name: 'Abram Herwitz', meta: 'Interior project · New York' },
  { grad: 'from-mist-300 to-[#8298BA]', text: 'The experts on Buildinghelp are genuinely world-class. My landscape project came out better than I could have ever imagined. Worth every penny.', name: 'Jakob Lubin', meta: 'Landscape project · Berlin' },
]

export function Testimonials() {
  const cards = [...TESTIMONIALS, ...TESTIMONIALS]
  return (
    <section id="testimonials" className="relative overflow-hidden bg-gray-50 py-28 dark:bg-[#07111E]">
      <div className="pointer-events-none absolute inset-0 bg-dots mask-radial opacity-50" />
      <div className="relative mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 px-5 text-center">
        <Reveal><SectionLabel>What members say</SectionLabel></Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-gray-900 dark:text-white">
            Over <span className="bg-gradient-to-r from-[#3B83BE] to-sand-400 bg-clip-text text-transparent">10 million</span> members helped
          </h2>
        </Reveal>
      </div>
      <div className="relative mask-fade-x">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {[...cards, ...cards].map((t, i) => (
            <figure
              key={i}
              className="relative flex w-[340px] shrink-0 flex-col gap-5 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] md:w-[400px] dark:border-white/8 dark:bg-[#0D1B2E]"
            >
              <Quote className="absolute top-5 right-5 h-10 w-10 text-secondary-400/20" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="flex-1 text-[14.5px] leading-relaxed text-gray-700 dark:text-white/80">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3">
                <span className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.grad}`} />
                <div>
                  <div className="text-[13px] font-bold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-[11.5px] text-gray-500 dark:text-white/45">{t.meta}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section id="cta" className="bg-gray-50 px-5 pb-24 dark:bg-[#07111E]">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] bg-[#07111E] px-6 py-20 text-center text-white md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-pan opacity-50 mask-radial" />
          <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-[#3B83BE]/50 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-32 h-80 w-80 rounded-full bg-secondary-400/30 blur-[100px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/20 blur-[90px]" />
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Join free today
            </span>
            <h2 className="text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Ask us <span className="bg-gradient-to-r from-secondary-400 via-sand-400 to-gold-400 bg-clip-text text-transparent">anything.</span>
              <br />
              Day or night.
            </h2>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-white/55">
              The experts at Buildinghelp are ready to answer your questions anytime. Join over 10 million members who&apos;ve already made their dream a reality.
            </p>
            <form action="/signup" className="mt-9 flex w-full max-w-md flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur sm:flex-row">
              <input
                name="email"
                type="email"
                placeholder="Enter your email to get started…"
                className="h-11 flex-1 bg-transparent px-3 text-[14px] text-white outline-none placeholder:text-white/35"
              />
              <button
                type="submit"
                className="group relative inline-flex h-11 items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-white px-5 text-[13.5px] font-bold text-[#07111E] transition-transform hover:scale-[1.03]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Join Free</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const FOOTER = [
  { title: 'Buildinghelp', links: ['Home', 'About', 'Careers', 'Press', 'Blog'] },
  { title: 'Members', links: ['How it works', 'Log in', 'Create account', 'Categories'] },
  { title: 'Experts', links: ['Meet the Experts', 'Expert Login', 'Become an Expert'] },
  { title: 'Support', links: ['Help centre', 'Contact us', 'Trust & Safety'] },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-100 bg-white px-5 pt-16 pb-8 dark:border-white/8 dark:bg-[#07111E]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-gray-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B83BE] via-secondary-400 to-sand-400 text-[12px] font-extrabold text-[#07111E]">B</span>
              buildinghelp
            </a>
            <p className="mb-5 max-w-[240px] text-[13px] leading-relaxed text-gray-500 dark:text-white/50">Connecting dreamers with world-class design and construction experts since 2012.</p>
            <div className="flex gap-2">
              {['f', 'X', 'in', 'ig'].map(s => (
                <a key={s} href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[11px] font-bold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {FOOTER.map(col => (
            <div key={col.title}>
              <div className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.07em] text-gray-900 dark:text-white">{col.title}</div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-gray-500 transition-colors hover:text-gray-900 dark:text-white/50 dark:hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-[12px] text-gray-400 md:flex-row dark:border-white/8 dark:text-white/40">
          <span>© 2025 Buildinghelp, Inc. All rights reserved.</span>
          <div className="flex gap-5">
            {['Sitemap', 'Terms of service', 'Privacy Policy'].map(l => (
              <a key={l} href="#" className="transition-colors hover:text-gray-700 dark:hover:text-white/70">{l}</a>
            ))}
          </div>
        </div>
        <div className="pointer-events-none mt-10 select-none bg-gradient-to-b from-gray-200 to-transparent bg-clip-text text-center text-[clamp(60px,16vw,200px)] leading-none font-extrabold tracking-[-0.05em] text-transparent dark:from-white/10">
          buildinghelp
        </div>
      </div>
    </footer>
  )
}
