'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react'
import { architects } from '@/lib/architects'
import { Reveal, SectionHead, ease } from './reveal'

const img = (url: string, w: number) => `${url.split('?')[0]}?w=${w}&q=80&auto=format&fit=crop`

const STEPS = [
  {
    title: 'Book a consultation',
    body: 'Pick an architect, engineer or surveyor by speciality and location, choose a time that suits you, and talk through the site, the budget and what is actually possible.',
  },
  {
    title: 'Track the build',
    body: 'Every project gets a milestone plan — from planning and permits to final inspection. Mark progress, add notes and dates, and always know what comes next.',
  },
  {
    title: 'Ask as you go',
    body: 'Not sure about a quote, a permit or a material? Ask a consultant or the Planr assistant and get a clear answer without waiting for the next meeting.',
  },
]

export function How() {
  return (
    <section id="how" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
      <SectionHead index="01" label="How it works" />
      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <h2 className="font-semibold text-[clamp(38px,4.6vw,64px)] leading-[1.02] tracking-[-0.045em] text-gray-900 dark:text-white">
            One place for the whole build, <em className="font-serif font-normal italic tracking-[-0.02em]">not just the drawings.</em>
          </h2>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[4px] bg-gray-900/10 sm:grid-cols-3 md:col-span-7 dark:bg-white/10">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="bg-[#F5F2EC] p-6 dark:bg-[#07111E]">
              <div className="mb-6 text-[13px] tabular-nums sm:mb-14 text-gray-400 dark:text-white/40">0{i + 1}</div>
              <h3 className="mb-3 text-[17px] font-semibold text-gray-900 dark:text-white">{s.title}</h3>
              <p className="text-[14px] leading-[1.65] text-gray-600 dark:text-white/60">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const MILESTONES = [
  { title: 'Planning & Design', date: 'Jan 12', status: 'done' },
  { title: 'Permits & Approvals', date: 'Feb 28', status: 'done' },
  { title: 'Site Preparation', date: 'Mar 15', status: 'done' },
  { title: 'Foundation', date: 'Apr 30', status: 'active', note: 'Footings poured — curing until 6 May' },
  { title: 'Framing & Structure', date: 'Jun 20', status: 'pending' },
  { title: 'Roofing', date: 'Jul 18', status: 'pending' },
  { title: 'Electrical & Plumbing', date: 'Aug 22', status: 'pending' },
  { title: 'Interior Finishing', date: 'Oct 10', status: 'pending' },
  { title: 'Exterior & Landscaping', date: 'Nov 14', status: 'pending' },
  { title: 'Final Inspection & Handover', date: 'Dec 05', status: 'pending' },
] as const

export function Tracker() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 0.38]), { stiffness: 120, damping: 30 })

  return (
    <section id="tracker" className="bg-[#07111E] text-white">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex items-center gap-4 border-t border-white/15 pt-4 text-[12px] font-medium tracking-wide text-white/50">
          <span className="tabular-nums text-white">02</span>
          <span className="uppercase">Build tracker</span>
        </div>
        <div className="mt-10 grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-semibold text-[clamp(38px,4.6vw,64px)] leading-[1.02] tracking-[-0.045em]">
                From first sketch to handover, <em className="font-serif font-normal italic tracking-[-0.02em] text-sand-400">stage by stage.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[420px] text-[16px] leading-[1.65] text-white/60">
                Start a home build, renovation, restaurant, hotel or commercial project and Planr lays out the milestones for you. Adjust them to fit your site, set dates, and keep everyone working from the same plan.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 grid max-w-[380px] grid-cols-2 gap-px overflow-hidden rounded-[4px] bg-white/10">
                <div className="bg-[#07111E] p-5">
                  <div className="text-[40px] font-semibold leading-none tracking-[-0.04em]">3<span className="text-white/40">/10</span></div>
                  <div className="mt-2 text-[12.5px] text-white/50">Stages complete</div>
                </div>
                <div className="bg-[#07111E] p-5">
                  <div className="text-[40px] font-semibold leading-none tracking-[-0.04em]">38%</div>
                  <div className="mt-2 text-[12.5px] text-white/50">Overall progress</div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="md:col-span-7">
            <div ref={ref} className="rounded-2xl border border-white/10 bg-[#0D1B2E] p-5 md:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <div className="text-[12px] text-white/45">Home build · Nugegoda</div>
                  <div className="text-[17px] font-semibold">Two-storey family house</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                    <motion.div style={{ scaleX: fill }} className="h-full w-full origin-left rounded-full bg-secondary-400" />
                  </div>
                  <span className="text-[12px] tabular-nums text-white/60">38%</span>
                </div>
              </div>
              <ol className="relative">
                {MILESTONES.map((m, i) => (
                  <motion.li
                    key={m.title}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 0.5, delay: i * 0.04, ease }}
                    className="relative flex gap-4 pb-5 last:pb-0"
                  >
                    {i < MILESTONES.length - 1 && (
                      <span className={`absolute top-6 left-[11px] h-[calc(100%-16px)] w-px ${m.status === 'done' ? 'bg-secondary-400/60' : 'bg-white/10'}`} />
                    )}
                    <span
                      className={
                        m.status === 'done'
                          ? 'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-400 text-[#07111E]'
                          : m.status === 'active'
                            ? 'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand-400 bg-[#0D1B2E]'
                            : 'relative z-10 h-6 w-6 shrink-0 rounded-full border border-white/15 bg-[#0D1B2E]'
                      }
                    >
                      {m.status === 'done' && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      {m.status === 'active' && <span className="h-2 w-2 animate-pulse rounded-full bg-sand-400" />}
                    </span>
                    <div className="flex flex-1 items-start justify-between gap-4 pt-0.5">
                      <div>
                        <div className={`text-[14.5px] ${m.status === 'pending' ? 'text-white/45' : 'text-white'}`}>{m.title}</div>
                        {'note' in m && <div className="mt-1 text-[12.5px] text-sand-400/90">{m.note}</div>}
                      </div>
                      <span className="text-[12px] tabular-nums text-white/35">{m.date}</span>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const DISCIPLINES = [
  { name: 'Architecture', blurb: 'New homes, villas and extensions designed around your site and the climate.', image: 'photo-1613490493576-7fde63acd811' },
  { name: 'Interior Design', blurb: 'Layouts, finishes and furniture that make a house feel like home.', image: 'photo-1555041469-a586c61ea9bc' },
  { name: 'Landscape Architecture', blurb: 'Gardens, pools and outdoor rooms that thrive in the tropics.', image: 'photo-1540541338537-71acf6f14e1a' },
  { name: 'Structural Engineering', blurb: 'Foundations and frames checked for soil, slope and load.', image: 'photo-1504307651254-35680f356dfd' },
  { name: 'Construction', blurb: 'Contractors who run the site, the crews and the schedule.', image: 'photo-1541888946425-d81bb19240f5' },
  { name: 'Quantity Surveying', blurb: 'Cost plans and BOQs, so every quote is checked before you sign.', image: 'photo-1454165804606-c3d57bc86b40' },
  { name: 'Urban Design', blurb: 'Masterplans and mixed-use schemes for larger sites.', image: 'photo-1477959858617-67f85cf4f1df' },
].map(d => {
  const team = architects.filter(a => a.category === d.name)
  return {
    ...d,
    count: team.length,
    places: [...new Set(team.map(a => a.location.split(',')[0].replace(/ \d+$/, '')))],
    tags: team.flatMap(a => a.specializations).slice(0, 2),
  }
})

export function Expertise() {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="expertise" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <SectionHead index="03" label="Expertise" />
        <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <h2 className="max-w-[680px] font-semibold text-[clamp(38px,4.6vw,64px)] leading-[1.02] tracking-[-0.045em] text-gray-900 dark:text-white">
              Every specialist your build <em className="font-serif font-normal italic tracking-[-0.02em]">will need.</em>
            </h2>
          </Reveal>
          <div className="flex gap-2">
            {[
              { dir: -1, icon: ArrowLeft, label: 'Previous' },
              { dir: 1, icon: ArrowRight, label: 'Next' },
            ].map(b => (
              <button
                key={b.label}
                onClick={() => scroll(b.dir)}
                aria-label={b.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-900/15 text-gray-900 transition-colors hover:bg-gray-900 hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
              >
                <b.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={track}
        className="mx-auto mt-12 flex max-w-[1240px] snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {DISCIPLINES.map((d, i) => (
          <a key={d.name} href="/signup" className="group w-[78vw] shrink-0 snap-start sm:w-[340px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#E7E1D7] dark:bg-[#0D1B2E]">
              <img
                src={img(`https://images.unsplash.com/${d.image}`, 700)}
                alt={d.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111E]/75 via-[#07111E]/10 to-transparent" />
              <span className="absolute top-4 left-4 text-[12px] tabular-nums text-white/80">0{i + 1}</span>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                <h3 className="text-[24px] leading-[1.05] font-semibold tracking-[-0.03em]">{d.name}</h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-[1.6] text-gray-600 dark:text-white/60">{d.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.tags.map(t => (
                <span key={t} className="rounded-full border border-gray-900/15 px-2.5 py-1 text-[11.5px] text-gray-700 dark:border-white/15 dark:text-white/70">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1 text-[12.5px] text-gray-500 dark:text-white/45">
              <MapPin className="h-3.5 w-3.5" />
              {d.count} {d.count === 1 ? 'consultant' : 'consultants'} · {d.places.join(', ')}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

const TYPES = [
  { name: 'Home build', note: 'New houses, from the ground up', image: architects[4].portfolio[1].url },
  { name: 'Renovation', note: 'Extensions, restorations, heritage homes', image: architects[3].portfolio[0].url },
  { name: 'Restaurant', note: 'Dining spaces and kitchens', image: architects[1].portfolio[3].url },
  { name: 'Hotel', note: 'Villas, boutique stays and resorts', image: architects[0].portfolio[1].url },
  { name: 'Commercial', note: 'Offices, retail and mixed-use', image: architects[7].portfolio[2].url },
]

export function ProjectTypes() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-24 md:px-8 md:pb-32">
      <SectionHead index="04" label="What you can build" />
      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <ul className="md:col-span-7" onMouseLeave={() => setActive(null)}>
          {TYPES.map((t, i) => (
            <li key={t.name} onMouseEnter={() => setActive(i)} className="border-b border-gray-900/15 dark:border-white/15">
              <a href="/signup" className="group flex items-center justify-between gap-6 py-6 md:py-7">
                <div className="flex items-baseline gap-5">
                  <span className="text-[12px] tabular-nums text-gray-400 dark:text-white/40">0{i + 1}</span>
                  <span
                    className={`text-[clamp(30px,3.6vw,48px)] font-semibold leading-none tracking-[-0.04em] transition-colors duration-300 ${
                      active === null || active === i ? 'text-gray-900 dark:text-white' : 'text-gray-900/25 dark:text-white/25'
                    }`}
                  >
                    {t.name}
                  </span>
                </div>
                <span className="hidden text-[13.5px] text-gray-500 sm:block dark:text-white/50">{t.note}</span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-white" />
              </a>
            </li>
          ))}
        </ul>
        <div className="relative hidden md:col-span-5 md:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[4px] bg-[#E7E1D7] dark:bg-[#0D1B2E]">
            <AnimatePresence initial={false}>
              <motion.img
                key={active ?? 0}
                src={img(TYPES[active ?? 0].image, 900)}
                alt={TYPES[active ?? 0].name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Ask() {
  const consultant = architects[1]
  return (
    <section id="ask" className="border-y border-gray-900/10 bg-[#EDE8DF] dark:border-white/10 dark:bg-[#0A1525]">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 md:grid-cols-12 md:px-8 md:py-32">
        <div className="md:col-span-5">
          <SectionHead index="05" label="Ask Planr" />
          <Reveal>
            <h2 className="mt-10 font-semibold text-[clamp(38px,4.6vw,64px)] leading-[1.02] tracking-[-0.045em] text-gray-900 dark:text-white">
              Questions don&apos;t wait <em className="font-serif font-normal italic tracking-[-0.02em]">for meetings.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[420px] text-[16px] leading-[1.65] text-gray-600 dark:text-white/60">
              Ask about permits, quotes, materials or timelines. A consultant replies in your thread, or the Planr assistant answers straight away.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:col-span-7 md:pt-14">
          <div className="rounded-2xl border border-gray-900/10 bg-white p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)] md:p-7 dark:border-white/8 dark:bg-[#0D1B2E]">
            <div className="flex flex-col gap-5">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gray-900 px-4 py-3 text-[14.5px] leading-relaxed text-white dark:bg-white dark:text-gray-900">
                We have two quotes for teak window frames — one is almost 40% cheaper. What should we check before choosing?
              </div>
              <div className="flex max-w-[90%] gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-400 text-[12px] font-semibold text-gray-900">
                  {consultant.name.split(' ').map(n => n[0]).join('')}
                </span>
                <div>
                  <div className="mb-1.5 text-[12px] text-gray-500 dark:text-white/50">
                    <span className="font-semibold text-gray-900 dark:text-white">{consultant.name}</span> · {consultant.role}
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-[#F5F2EC] px-4 py-3 text-[14.5px] leading-relaxed text-gray-800 dark:bg-white/5 dark:text-white/85">
                    Ask both suppliers whether it&apos;s solid teak or veneer, how the timber was seasoned, and what the price includes — fixing, ironmongery and finish. A big gap usually means one of those is missing. Send me both quotes and I&apos;ll mark them up.
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-900/10 px-4 py-3 text-[14px] text-gray-400 dark:border-white/10 dark:text-white/35">
              Ask about permits, costs, materials…
              <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Quote() {
  const a = architects[0]
  const review = a.reviews[0]
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <figure className="mx-auto max-w-[920px] text-center">
          <blockquote className="font-serif text-[clamp(30px,3.8vw,52px)] leading-[1.12] text-gray-900 dark:text-white">
            &ldquo;{review.text}&rdquo;
          </blockquote>
          <figcaption className="mt-8 text-[14px] text-gray-500 dark:text-white/50">
            <span className="text-gray-900 dark:text-white">{review.name}</span> — worked with {a.name}, {a.company}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}

export function Cta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#07111E]">
      <motion.img
        style={{ y }}
        src={img(architects[0].portfolio[3].url, 2000)}
        alt=""
        loading="lazy"
        className="absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07111E]/85 via-[#07111E]/55 to-[#07111E]/10" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-28 md:px-8 md:py-40">
        <Reveal>
          <h2 className="max-w-[640px] font-semibold text-[clamp(44px,6vw,88px)] leading-[1.02] tracking-[-0.045em] text-white">
            Start with <em className="font-serif font-normal italic tracking-[-0.02em] text-sand-400">a conversation.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[440px] text-[16.5px] leading-[1.65] text-white/75">
            Tell a consultant about your plot, your budget and how you want to live. You&apos;ll leave with a clear next step.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="/signup" className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-gray-900 transition-opacity hover:opacity-90">
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="/signup" className="text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
              Create a free account
            </a>
          </div>
        </Reveal>
        <p className="mt-16 text-[12px] text-white/50">{architects[0].portfolio[3].caption} — {architects[0].company}</p>
      </div>
    </section>
  )
}

const FOOTER = [
  { title: 'Product', links: [{ l: 'How it works', h: '#how' }, { l: 'Build tracker', h: '#tracker' }, { l: 'Ask Planr', h: '#ask' }, { l: 'Expertise', h: '#expertise' }] },
  { title: 'Account', links: [{ l: 'Log in', h: '/login' }, { l: 'Create account', h: '/signup' }, { l: 'Join as a consultant', h: '/signup' }] },
]

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1240px] px-5 pt-20 pb-10 md:px-8">
      <div className="grid gap-12 border-t border-gray-900/15 pt-10 md:grid-cols-12 dark:border-white/15">
        <div className="md:col-span-6">
          <img src="/planr-logo.svg" alt="Planr" className="h-7 dark:invert" />
          <p className="mt-5 max-w-[340px] text-[14px] leading-relaxed text-gray-600 dark:text-white/55">
            Architecture consultation and build tracking for homeowners, developers and businesses in Sri Lanka.
          </p>
        </div>
        {FOOTER.map(col => (
          <div key={col.title} className="md:col-span-3">
            <div className="mb-4 text-[12px] uppercase tracking-wide text-gray-400 dark:text-white/40">{col.title}</div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map(link => (
                <li key={link.l}>
                  <a href={link.h} className="text-[14px] text-gray-900 hover:underline dark:text-white">{link.l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col justify-between gap-2 text-[12.5px] text-gray-500 sm:flex-row dark:text-white/40">
        <span>© {new Date().getFullYear()} Planr. Colombo, Sri Lanka.</span>
        <span>Every great build starts with a plan.</span>
      </div>
    </footer>
  )
}
