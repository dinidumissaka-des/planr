'use client'

import { motion } from 'motion/react'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { architects } from '@/lib/architects'
import { ease } from './reveal'

const lead = architects[0]

const FACTS = [
  { value: '7', label: 'disciplines, from architects to quantity surveyors' },
  { value: '10', label: 'build stages tracked, planning to handover' },
  { value: '4', label: 'regions covered — Colombo, Kandy, Galle, Negombo' },
]

export function Hero() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 pt-28 pb-20 md:px-8 md:pt-36 md:pb-28">
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="flex flex-col md:col-span-5 md:pt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            className="mb-8 text-[13px] text-gray-500 dark:text-white/50"
          >
            Architecture consultation &amp; build tracking — Sri Lanka
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-serif text-[clamp(52px,6.4vw,96px)] leading-[0.92] tracking-[-0.02em] text-gray-900 dark:text-white"
          >
            Plan it properly.
            <br />
            <em className="text-[#8A6A4F] dark:text-sand-400">Build it once.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="mt-8 max-w-[440px] text-[17px] leading-[1.6] text-gray-600 dark:text-white/65"
          >
            Book a certified Sri Lankan architect, follow every milestone from permits to handover, and get straight answers before the concrete is poured.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <a
              href="/signup"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gray-900 px-6 text-[15px] font-semibold text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-gray-900"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#how" className="text-[15px] font-medium text-gray-900 underline decoration-gray-900/30 underline-offset-4 hover:decoration-gray-900 dark:text-white dark:decoration-white/30 dark:hover:decoration-white">
              See how it works
            </a>
          </motion.div>
        </div>

        <div className="md:col-span-7">
          <motion.figure
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.4, delay: 0.15, ease }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#E7E1D7] md:aspect-[5/6] dark:bg-[#0D1B2E]">
              <motion.img
                src={`${lead.portfolio[0].url.split('?')[0]}?w=1400&q=80&auto=format&fit=crop`}
                alt={lead.portfolio[0].caption}
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, delay: 0.15, ease }}
                className="h-full w-full object-cover"
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease }}
                className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-[0_8px_30px_rgba(7,17,30,.18)] backdrop-blur md:bottom-6 md:left-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F2EC]">
                  <CalendarDays className="h-[18px] w-[18px] text-gray-900" />
                </span>
                <div>
                  <div className="text-[11px] text-gray-500">Next consultation · {lead.available}</div>
                  <div className="text-[13.5px] font-semibold text-gray-900">{lead.name}, {lead.role}</div>
                </div>
              </motion.div>
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 text-[12.5px] text-gray-500 dark:text-white/50">
              <span className="text-gray-900 dark:text-white">{lead.portfolio[0].caption}</span>
              <span>{lead.name} — {lead.company}</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>

      <dl className="mt-20 grid gap-8 border-t border-gray-900/15 pt-8 sm:grid-cols-3 md:mt-28 dark:border-white/15">
        {FACTS.map(f => (
          <div key={f.label} className="flex items-baseline gap-4">
            <dt className="font-serif text-[44px] leading-none text-gray-900 dark:text-white">{f.value}</dt>
            <dd className="max-w-[220px] text-[13.5px] leading-snug text-gray-600 dark:text-white/60">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
