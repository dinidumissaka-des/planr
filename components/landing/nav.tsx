'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Images,
  ListChecks,
  Menu,
  MessagesSquare,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from './ui'

type MenuItem = { label: string; desc: string; href: string; icon: LucideIcon }

const PRODUCT: MenuItem[] = [
  { label: 'Consultations', desc: 'Book time with a certified professional', href: '#plan', icon: CalendarDays },
  { label: 'Build tracker', desc: 'A milestone plan for every project', href: '#track', icon: ListChecks },
  { label: 'Ask Planr', desc: 'Questions answered by consultants', href: '#ask', icon: MessagesSquare },
  { label: 'Planr AI', desc: 'Straight answers at any hour', href: '#ai', icon: Sparkles },
]

const RESOURCES: MenuItem[] = [
  { label: 'Getting started', desc: 'Where Planr fits in your build', href: '#start', icon: Compass },
  { label: 'Project stories', desc: 'Work from Planr consultants', href: '#stories', icon: Images },
  { label: 'FAQ', desc: 'Common questions, plainly answered', href: '#faq', icon: CircleHelp },
]

const LINKS = [
  { label: 'Consultants', href: '#specialists' },
  { label: 'How it works', href: '#start' },
  { label: 'Planr AI', href: '#ai' },
]

function Dropdown({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div className="group relative">
      <button className="flex h-8 items-center gap-1 px-3 text-[14px] text-[#757575] transition-colors hover:text-gray-900 dark:text-white/60 dark:hover:text-white">
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-2 shadow-[0_12px_40px_-12px_rgba(7,17,30,0.18)] dark:border-white/10 dark:bg-[#0D1B2E]">
          {items.map((item) => (
            <a key={item.label} href={item.href} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 dark:border-white/10 dark:text-white/80">
                <item.icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[14px] text-gray-900 dark:text-white">{item.label}</span>
                <span className="block text-[12px] text-[#757575] dark:text-white/50">{item.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AnnouncementBar() {
  return (
    <div className="relative z-10 flex min-h-9 items-center justify-center bg-[linear-gradient(90deg,#D6E8F7_0%,#F1E7DE_50%,#D6E8F7_100%)] px-4 py-2 text-center text-[13px] leading-5 text-[#505050]">
      <p>
        Planr AI answers building questions any time.{' '}
        <a href="#ai" className="text-gray-900 underline underline-offset-2">
          Take a look
        </a>
      </p>
    </div>
  )
}

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => {
      document.body.style.overflow = 'auto'
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-gray-900/[0.06] bg-white/85 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#07111E]/85'
          : 'border-transparent',
      )}
    >
      <nav className="mx-auto flex h-[66px] w-full max-w-[1360px] items-center justify-between px-5 lg:grid lg:grid-cols-3 lg:px-10">
        <a href="/" aria-label="Planr home" className="justify-self-start">
          <img src="/planr-logo.svg" alt="Planr" className="h-6 dark:invert" />
        </a>

        <div className="hidden items-center justify-self-center lg:flex">
          <Dropdown label="Product" items={PRODUCT} />
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="flex h-8 items-center whitespace-nowrap px-3 text-[14px] text-[#757575] transition-colors hover:text-gray-900 dark:text-white/60 dark:hover:text-white">
              {l.label}
            </a>
          ))}
          <Dropdown label="Resources" items={RESOURCES} />
        </div>

        <div className="hidden items-center gap-5 justify-self-end lg:flex">
          <a href="/login" className="text-[14px] text-gray-700 transition-colors hover:text-gray-900 dark:text-white/70 dark:hover:text-white">
            Log in
          </a>
          <a href="/signup" className="inline-flex h-8 items-center rounded-full bg-gray-900 px-3.5 text-[14px] text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
            Book a consultation
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="-mr-2 flex h-10 w-10 items-center justify-center text-gray-900 lg:hidden dark:text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-x-0 bottom-0 top-[66px] overflow-y-auto bg-white px-5 pb-10 pt-4 lg:hidden dark:bg-[#07111E]"
          >
            {[{ title: 'Product', items: PRODUCT }, { title: 'Resources', items: RESOURCES }].map((group) => (
              <div key={group.title} className="border-b border-gray-100 py-4 dark:border-white/10">
                <p className="mb-2 text-[12px] uppercase tracking-[0.1em] text-[#757575] dark:text-white/50">{group.title}</p>
                {group.items.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 text-[17px] text-gray-900 dark:text-white">
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                ))}
              </div>
            ))}
            <div className="py-4">
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 text-[17px] text-gray-900 dark:text-white">
                  {l.label}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <a href="/signup" className="flex h-12 items-center justify-center rounded-full bg-gray-900 text-[15px] text-white dark:bg-white dark:text-gray-900">
                Book a consultation
              </a>
              <a href="/login" className="flex h-12 items-center justify-center rounded-full border border-gray-200 text-[15px] text-gray-900 dark:border-white/15 dark:text-white">
                Log in
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
