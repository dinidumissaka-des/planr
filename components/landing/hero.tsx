'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ChevronRight, Landmark, Sparkles, X } from 'lucide-react'
import { architects } from '@/lib/architects'
import Waves from '@/components/reactbits/Waves'
import { CATEGORY_ICON, DarkPill, ease } from './ui'

function useHtmlDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const html = document.documentElement
    const sync = () => setDark(html.classList.contains('dark'))
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return dark
}

function HeroWaves() {
  const dark = useHtmlDark()
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
      <Waves
        lineColor={dark ? '#FFFFFF' : '#3B83BE'}
        accentColor={dark ? '#FFFFFF' : '#81B9E9'}
        opacity={dark ? 0.16 : 0.42}
        spacing={14}
        amplitude={34}
        speed={0.6}
        mouseRadius={160}
      />
    </div>
  )
}

function IntroCard() {
  const [open, setOpen] = useState(true)
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease }}
      className="absolute bottom-5 right-4 z-10 hidden w-[218px] rounded-xl border border-gray-200/80 bg-white/90 p-1.5 shadow-[0_8px_30px_-10px_rgba(7,17,30,0.2)] backdrop-blur lg:block dark:border-white/10 dark:bg-[#171717]/90"
    >
      <div className="flex items-center justify-between px-1 pb-1.5 pt-0.5">
        <p className="text-[12px] text-[#505050] dark:text-white/70">New: Planr AI</p>
        <button onClick={() => setOpen(false)} aria-label="Dismiss" className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <X className="h-3 w-3" />
        </button>
      </div>
      <a href="#ai" className="block">
        <div className="relative h-[100px] overflow-hidden rounded-lg bg-[#E7EEF5] dark:bg-white/10">
          <img src={architects[0].portfolio[1].url} alt="" className="h-full w-full object-cover grayscale" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between px-1 pb-0.5 pt-1.5 text-[12px] text-[#505050] dark:text-white/70">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> See what it can do
          </span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </a>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-[640px] flex-col lg:min-h-[480px] lg:flex-1">
      <HeroWaves />
      <div className="relative mx-auto w-full max-w-[1360px] px-5 pt-14 lg:px-10 lg:pt-[clamp(48px,11svh,110px)] lg:text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease }}
          className="text-[12px] uppercase leading-[1.8] tracking-[0.1em] text-[#666666] dark:text-white/50"
        >
          For homeowners building in Sri Lanka
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="mt-4 max-w-[860px] text-balance font-serif lg:mx-auto text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-gray-900 lg:text-[64px] dark:text-white"
        >
          Build the home you planned, not the one you settled for
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="mt-6 max-w-[580px] text-[17px] lg:mx-auto font-light leading-7 text-[#505050] lg:text-[18px] dark:text-white/65"
        >
          Book an architect or engineer, follow every stage from permits to handover, and get a clear answer whenever a question comes up.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-8 lg:justify-center"
        >
          <DarkPill href="/signup" className="h-11 whitespace-nowrap px-5 lg:h-10">
            Book a consultation
          </DarkPill>
          <a href="#ai" className="flex items-center gap-1 whitespace-nowrap text-[14px] font-medium text-gray-900 dark:text-white">
            Meet Planr AI <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
      <IntroCard />
    </section>
  )
}


const SPECIALISMS = [
  ...new Map(architects.flatMap((a) => a.specializations.map((s) => [s, a.category] as const))).entries(),
]

function SpecialismRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {SPECIALISMS.map(([name, category]) => {
        const Icon = CATEGORY_ICON[category] ?? Landmark
        return (
          <span key={name} className="flex shrink-0 items-center gap-2 px-10 text-[18px] font-semibold tracking-[-0.02em] text-[#6B6B6B] dark:text-white/55">
            <Icon className="h-5 w-5" strokeWidth={2.25} />
            {name}
          </span>
        )
      })}
    </div>
  )
}

export function SpecialismMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} className="relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <p className="sr-only">Specialisms offered by Planr consultants</p>
      <div className="flex w-max items-center motion-safe:animate-marquee" style={{ animationPlayState: inView ? 'running' : 'paused' }}>
        <SpecialismRow />
        <SpecialismRow hidden />
      </div>
    </div>
  )
}
