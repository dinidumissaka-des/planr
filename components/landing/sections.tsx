'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
import { architects } from '@/lib/architects'
import { cn } from '@/lib/utils'
import { CATEGORY_ICON, Container, OutlinePill, Reveal, ease } from './ui'

const STORIES = [
  { a: architects[0], p: architects[0].portfolio[0] },
  { a: architects[2], p: architects[2].portfolio[0] },
  { a: architects[1], p: architects[1].portfolio[1] },
]

function Stories() {
  return (
    <div id="stories" className="scroll-mt-20 pb-16 pt-16 lg:pb-20 lg:pt-24">
      <Container>
        <Reveal>
          <h2 className="text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-gray-900 lg:text-[40px] dark:text-white">
            Work by the people
            <span className="block lg:pl-[72px]">you can book on Planr</span>
          </h2>
        </Reveal>
        <Reveal>
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-[1.08fr_1fr_1fr] lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {STORIES.map(({ a, p }, i) => {
            const Icon = CATEGORY_ICON[a.category]
            return (
              <div key={p.caption} className="w-[80%] shrink-0 snap-start lg:w-auto">
                <article className="group relative h-[400px] overflow-hidden rounded-xl bg-gray-300 lg:h-[480px] dark:bg-white/10">
                  <img
                    src={p.url}
                    alt={p.caption}
                    className={cn('absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]', i > 0 && 'grayscale')}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,30,0.45)_0%,transparent_30%,transparent_55%,rgba(7,17,30,0.75)_100%)]" />
                  <p className="absolute left-5 top-5 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-white">
                    <Icon className="h-5 w-5" /> {a.company}
                  </p>
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <p className="text-[26px] font-light leading-tight">{p.caption}</p>
                    <p className="mt-1 text-[15px] text-white/80">
                      {p.category} · {a.role} {a.name}
                    </p>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
        </Reveal>
        <div className="mt-6 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[15px] leading-6 text-[#505050] dark:text-white/60">Every consultant keeps a portfolio on Planr, so you can see their past work before you book.</p>
          <OutlinePill href="/signup">
            See all projects <ArrowRight className="h-3.5 w-3.5" />
          </OutlinePill>
        </div>
      </Container>
    </div>
  )
}

const STARTS = [
  {
    q: 'Just bought land?',
    a: 'Begin with a consultation before anyone draws a line. An architect can tell you what the plot allows, then Planr lays out the stages ahead.',
    img: architects[4].portfolio[0],
  },
  {
    q: 'Already have drawings?',
    a: 'Add your project, mark the stages you have finished and get a second opinion from an engineer or quantity surveyor before work goes to tender.',
    img: architects[6].portfolio[0],
  },
  {
    q: 'Mid-build and losing track?',
    a: 'Put the build into Planr, tick off what is done and keep notes and dates on what remains, so you and your team work from one list.',
    img: architects[7].portfolio[0],
  },
]

function Starting() {
  const [open, setOpen] = useState(0)
  return (
    <div id="start" className="scroll-mt-20 border-t border-gray-200/80 py-16 dark:border-white/8">
      <Container className="lg:grid lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-0">
        <Reveal>
          <h2 className="text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-gray-900 lg:text-[40px] dark:text-white">
            Starting
            <span className="block lg:pl-[72px]">with Planr</span>
          </h2>
        </Reveal>
        <div className="mt-10 lg:-mr-6 lg:mt-0">
          {STARTS.map((s, i) => {
            const isOpen = open === i
            return (
              <div key={s.q} className={cn('border-gray-200/80 dark:border-white/8', i > 0 && !isOpen && open !== i - 1 && 'border-t')}>
                <div
                  className={cn(
                    'relative grid gap-x-10 rounded-[18px] py-6 transition-colors lg:grid-cols-2 lg:px-6',
                    isOpen ? 'bg-[#EDEDED] px-5 dark:bg-white/[0.06]' : 'hover:bg-gray-900/[0.02]',
                  )}
                >
                  <div>
                    <h3>
                      <button
                        id={`start-q-${i}`}
                        onClick={() => setOpen(i)}
                        aria-expanded={isOpen}
                        aria-controls={`start-a-${i}`}
                        className="flex w-full items-center justify-between gap-4 text-left text-[18px] leading-7 text-gray-900 after:absolute after:inset-0 after:rounded-[18px] lg:text-[20px] dark:text-white"
                      >
                        {s.q}
                        {!isOpen && <ChevronRight className="h-4 w-4 shrink-0 text-gray-500 lg:hidden" />}
                      </button>
                    </h3>
                    <p id={`start-a-${i}`} role="region" aria-labelledby={`start-q-${i}`} hidden={!isOpen} className="mt-1 text-[18px] leading-7 text-[#666666] lg:text-[20px] dark:text-white/60">
                      {s.a}
                    </p>
                  </div>
                  {isOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="relative mt-5 h-[190px] overflow-hidden rounded-xl bg-gray-300 shadow-[0_8px_24px_-8px_rgba(7,17,30,0.35)] lg:mt-0 lg:h-[196px] dark:bg-white/10"
                    >
                      <img src={s.img.url} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(7,17,30,0.6))]" />
                      <span className="absolute bottom-4 left-4 text-[17px] leading-6 text-white">
                        {s.img.caption}
                        <span className="block text-[13px] text-white/75">{s.img.category}</span>
                      </span>
                    </motion.div>
                  ) : (
                    <p aria-hidden className="mt-1 hidden items-start justify-between gap-6 text-[14px] leading-[22px] text-[#666666] lg:flex dark:text-white/60">
                      {s.a}
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

export function StoriesPanel() {
  return (
    <section className="sm:px-2 lg:px-4">
      <div className="rounded-[20px] border border-gray-200/70 bg-[#F9F9F9] dark:border-white/8 dark:bg-[#0A1525]">
        <Stories />
        <Starting />
      </div>
    </section>
  )
}

const TRUST = [
  { label: 'Consultant profiles', text: 'Each profile shows specialisations, experience, past projects and client reviews, so you know who you are booking.' },
  { label: 'Shared milestone plan', text: 'Every project starts with a stage-by-stage plan for its type, from first drawings to handover.' },
  { label: 'Your plan, your account', text: "Your project plan and notes stay in your account and aren't shown to other clients. Questions go to Planr's consultants." },
  { label: 'Notes & dates', text: 'Decisions and deadlines sit against the stage they belong to, not scattered across chats.' },
  { label: 'Planr AI guardrails', text: "It gives practical guidance, doesn't make up prices, and suggests a professional when a question needs a hands-on look." },
]

export function Trust() {
  const ref = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8)
  }
  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 376, behavior: 'smooth' })

  return (
    <section className="sm:px-2 lg:px-4">
      <div className="overflow-hidden rounded-[20px] bg-[#07111E] py-16 text-white lg:pb-28 lg:pt-24 dark:border dark:border-white/10 dark:bg-[#0A1525]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <Reveal>
              <h2 className="text-[32px] font-light leading-[1.15] tracking-[-0.02em] lg:text-[40px]">
                Built for serious builds.
                <span className="block lg:pl-[72px]">Careful with what matters.</span>
              </h2>
            </Reveal>
            <div className="hidden gap-2 sm:flex">
              {([-1, 1] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => go(d)}
                  disabled={d === -1 ? atStart : atEnd}
                  aria-label={d === -1 ? 'Previous' : 'Next'}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:border-transparent disabled:text-white/30 disabled:hover:bg-transparent"
                >
                  {d === -1 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </Container>
        <div
          ref={ref}
          onScroll={onScroll}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 [scrollbar-width:none] lg:mt-14 lg:scroll-px-[max(40px,calc((100vw-1280px)/2-16px))] lg:px-[max(40px,calc((100vw-1280px)/2-16px))]"
        >
          {TRUST.map((t) => (
            <div key={t.label} className="flex h-[300px] w-[82%] shrink-0 snap-start flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:w-[360px]">
              <p className="text-[13px] text-white/60">{t.label}</p>
              <p className="text-[21px] leading-[1.35] text-white">{t.text}</p>
            </div>
          ))}
          <span className="w-px shrink-0" />
        </div>
        <Container className="mt-14 lg:mt-24">
          <p className="text-[16px] text-white">Your data</p>
          <div className="mt-2 flex gap-5 text-[13px] text-white/60">
            <a href="#" className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-white">
              Privacy policy
            </a>
            <a href="#" className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-white">
              Terms of service
            </a>
          </div>
        </Container>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: 'What is Planr?',
    a: 'Planr helps homeowners, developers and businesses in Sri Lanka plan and build with professional help. You can book consultations with Sri Lankan architects and building professionals, track your project stage by stage, and ask questions of consultants or Planr AI, all from one account.',
  },
  {
    q: 'How much does Planr cost?',
    a: "Planr is a monthly subscription. You'll see the current plan and price before you're charged, and you can manage it any time from Billing.",
  },
  {
    q: 'How does Planr AI work, and what will it not do?',
    a: 'Planr AI answers questions about design, permits, materials, construction and budgeting. It gives practical guidance and realistic ranges, but it does not make up prices and it is not a substitute for a professional. When a question needs someone to look at your site or drawings, it will suggest booking a consultation.',
  },
  {
    q: 'Who are the consultants?',
    a: 'Building professionals across seven disciplines: architecture, interior design, landscape architecture, urban design, structural engineering, construction and quantity surveying. Each has a profile showing their practice, location, specialisations and past projects.',
  },
  {
    q: 'What kinds of projects can I track?',
    a: 'Home builds, restaurants, hotels, commercial spaces, renovations and anything else. Each type starts with its own milestone plan, which you can follow from planning through to handover.',
  },
  {
    q: 'Is my project information private?',
    a: "Your project plan and notes stay in your account and aren't shown to other clients. Questions you post go to Planr's consultants so they can answer them.",
  },
  {
    q: 'Can I use Planr on my phone?',
    a: 'Yes. Planr works in your phone browser, with navigation built for small screens, and you can add it to your home screen.',
  },
  {
    q: 'Do I need a consultation before I can track a project?',
    a: 'No. You can create a project and start tracking milestones straight away, then book a consultant whenever you need one.',
  },
  {
    q: 'I am an architect or engineer. Can I join?',
    a: 'Yes. Choose the consultant option when you sign up. You get your own workspace to manage bookings, answer client questions and keep your profile current.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="scroll-mt-20 border-t border-gray-200/80 pb-8 pt-16 lg:pt-24 dark:border-white/8">
      <Container className="max-w-[928px]">
        <Reveal>
          <h2 className="text-[28px] font-normal tracking-[-0.01em] text-gray-900 lg:text-center lg:text-[32px] dark:text-white">Frequently asked questions</h2>
        </Reveal>
        <div className="mt-10 lg:mt-14">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="border-b border-gray-200/80 last:border-0 dark:border-white/8">
                <h3>
                <button
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-8 text-left text-[18px] leading-7 text-gray-900 lg:text-[20px] dark:text-white"
                >
                  {f.q}
                  <ChevronRight className={cn('h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300', isOpen && 'rotate-90')} />
                </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[820px] pb-8 text-[14px] leading-6 text-[#505050] dark:text-white/60">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="pb-16 pt-12 lg:pb-0 lg:pt-14">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-gray-200/60 bg-[#F7F5F8] px-6 py-16 text-center lg:h-[362px] lg:py-0">
            <div className="pointer-events-none absolute -left-20 -top-24 h-[420px] w-[360px] rotate-[25deg] rounded-full bg-[radial-gradient(closest-side,#3B83BE,#81B9E9_50%,transparent)] opacity-80 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,#81B9E9,transparent)] opacity-80 blur-2xl" />
            <div className="pointer-events-none absolute -top-20 right-1/4 h-[260px] w-[420px] rounded-full bg-[radial-gradient(closest-side,#F2E2D4,transparent)] opacity-90 blur-2xl" />
            <div className="relative flex h-full flex-col items-center justify-center">
              <h2 className="font-serif text-[34px] font-light leading-[1.08] tracking-[-0.02em] text-gray-900 lg:text-[48px]">
                Every good build
                <br /> starts with a proper plan.
              </h2>
              <p className="mt-5 text-[15px] text-[#505050]">Talk it through with a professional first.</p>
              <a href="/signup" className="mt-8 inline-flex h-10 items-center rounded-full bg-gray-900 px-5 text-[14px] text-white transition-colors hover:bg-gray-700">
                Book a consultation
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

const FOOTER = [
  { title: 'Product', links: [['Consultations', '#plan'], ['Build tracker', '#track'], ['Ask Planr', '#ask'], ['Planr AI', '#ai'], ['Consultants', '#specialists']] },
  { title: 'Resources', links: [['Getting started', '#start'], ['Project stories', '#stories'], ['FAQ', '#faq'], ['Help centre', '#']] },
  { title: 'Company', links: [['About', '#'], ['Become a consultant', '/signup'], ['Contact', '#']] },
  { title: 'Legal', links: [['Privacy', '#'], ['Terms of service', '#']] },
]

export function Footer() {
  return (
    <footer className="pt-16 lg:pt-[120px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[324px_repeat(4,minmax(0,1fr))] lg:gap-0">
          <a href="/" aria-label="Planr home">
            <img src="/planr-logo.svg" alt="Planr" className="h-6 dark:invert" />
          </a>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:contents">
            {FOOTER.map((col) => (
              <div key={col.title}>
                <p className="text-[13px] text-[#505050] dark:text-white/70">{col.title}</p>
                <ul className="mt-6 space-y-5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-[14px] text-[#666666] transition-colors hover:text-gray-900 dark:text-white/50 dark:hover:text-white">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex items-center border-t border-gray-200/80 py-8 lg:mt-[110px] dark:border-white/8">
          <p className="text-[12px] text-[#666666] dark:text-white/50">© {new Date().getFullYear()} Planr</p>
        </div>
      </Container>
    </footer>
  )
}
