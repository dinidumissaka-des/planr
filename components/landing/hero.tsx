'use client'

import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { architects } from '@/lib/architects'
import { AiConsole } from './ai'
import { ease } from './reveal'

const lead = architects[0]

const FACTS = [
  { value: '24/7', label: 'answers from Planr AI, in seconds' },
  { value: '10', label: 'build stages tracked, planning to handover' },
  { value: '7', label: 'disciplines, from architects to quantity surveyors' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#07111E] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(129,185,233,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(129,185,233,.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,#000_30%,transparent_80%)]" />
      <div className="pointer-events-none absolute top-[-20%] right-[-10%] h-[640px] w-[640px] rounded-full bg-[#3B83BE]/20 blur-[140px]" />

      <div className="relative mx-auto max-w-[1240px] px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="flex flex-col md:col-span-6 md:pt-8">
            <motion.a
              href="#ai"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="group mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1 pr-3 pl-1 text-[12.5px] text-white/75 transition-colors hover:border-secondary-400/40"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-400 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#07111E]">
                <Sparkles className="h-3 w-3" />
                New
              </span>
              Planr AI answers your build questions
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="text-[clamp(52px,6.4vw,96px)] leading-[0.98] font-semibold tracking-[-0.05em]"
            >
              Plan it properly.
              <br />
              <em className="font-serif font-normal italic tracking-[-0.02em] text-sand-400">Build it once.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease }}
              className="mt-8 max-w-[460px] text-[17px] leading-[1.6] text-white/65"
            >
              Ask Planr AI anything about your build, book a certified Sri Lankan architect when you need one, and follow every milestone from permits to handover.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <a
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-gray-900 shadow-[0_0_40px_-8px_rgba(129,185,233,.6)] transition-transform hover:scale-[1.02]"
              >
                Try Planr AI free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="/signup" className="text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Book a consultation
              </a>
            </motion.div>
          </div>

          <div className="relative md:col-span-6">
            <motion.figure
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1.4, delay: 0.15, ease }}
              className="relative ml-auto w-full md:w-[86%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#0D1B2E]">
                <motion.img
                  src={`${lead.portfolio[0].url.split('?')[0]}?w=1200&q=80&auto=format&fit=crop`}
                  alt={lead.portfolio[0].caption}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2, delay: 0.15, ease }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111E]/70 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[11px] text-white/45">
                <span>{lead.portfolio[0].caption}</span>
                <span>{lead.company}</span>
              </figcaption>
            </motion.figure>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease }}
              className="relative -mt-40 md:absolute md:bottom-14 md:left-[-6%] md:mt-0 md:w-[420px]"
            >
              <AiConsole />
            </motion.div>
          </div>
        </div>

        <dl className="mt-20 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-3 md:mt-24">
          {FACTS.map(f => (
            <div key={f.label} className="flex items-baseline gap-4">
              <dt className="text-[40px] leading-none font-semibold tracking-[-0.04em]">{f.value}</dt>
              <dd className="max-w-[220px] text-[13.5px] leading-snug text-white/55">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
