'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, BadgeCheck, MessageCircle, PlayCircle, Search, Star, Zap } from 'lucide-react'
import Aurora from '@/components/reactbits/Aurora'
import BlurText from '@/components/reactbits/BlurText'
import GradientText from '@/components/reactbits/GradientText'
import RotatingText from '@/components/reactbits/RotatingText'

const EXPERTS = [
  { name: 'Sarah Chen', role: 'Residential Architect · MIT', grad: 'from-secondary-300 to-[#3B83BE]', online: true },
  { name: 'Marcus Reed', role: 'Interior Architect · RCA London', grad: 'from-sand-300 to-[#D4A882]', online: true },
  { name: 'Priya Nair', role: 'Landscape Architect · UCL', grad: 'from-mist-300 to-[#8298BA]', online: false },
]

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1])
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#07111E] pt-36 pb-24 text-white md:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[75%] opacity-80">
          <Aurora colorStops={['#3B83BE', '#81B9E9', '#E1C1A6']} amplitude={1.1} blend={0.55} speed={0.6} />
        </div>
        <div className="absolute inset-0 bg-grid animate-grid-pan mask-radial opacity-60" />
        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
        <div className="absolute -bottom-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-[#3B83BE]/25 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <motion.a
          href="/signup"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="group relative mb-8 inline-flex items-center gap-2 overflow-hidden rounded-full p-px"
        >
          <span className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,#81B9E9_60deg,#E1C1A6_120deg,transparent_180deg)]" />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-[#07111E]/90 px-4 py-1.5 text-[12px] font-semibold backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary-400" />
              <span className="relative h-2 w-2 rounded-full bg-secondary-400" />
            </span>
            <span className="bg-[linear-gradient(110deg,rgba(255,255,255,.6),35%,#fff,50%,rgba(255,255,255,.6),75%,rgba(255,255,255,.6))] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">
              10M+ members helped worldwide
            </span>
            <ArrowRight className="h-3 w-3 text-white/60 transition-transform group-hover:translate-x-0.5" />
          </span>
        </motion.a>

        <h1 className="text-[clamp(44px,8vw,96px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          <BlurText text="Dream. Design." delay={120} animateBy="words" direction="top" className="justify-center" />
          <motion.span
            className="mt-1 block"
            initial={{ opacity: 0, filter: 'blur(12px)', y: 30 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
          >
            <GradientText colors={['#81B9E9', '#E1C1A6', '#DBCF63', '#81B9E9']} animationSpeed={6} className="pb-2">
              Build It.
            </GradientText>
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[17px] font-medium text-white/70 md:text-[19px]"
        >
          Expert advice for your
          <RotatingText
            texts={['dream home', 'new villa', 'office fit-out', 'garden', 'renovation']}
            mainClassName="overflow-hidden rounded-lg bg-secondary-400 px-2.5 py-0.5 font-bold text-[#07111E]"
            staggerFrom="last"
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden pb-0.5"
            rotationInterval={2400}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.82, ease }}
          className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/50"
        >
          Connect with world-class architects, interior designers, and construction experts. Your vision, expertly realized — from concept to completion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.94, ease }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="/signup"
            className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-white px-6 text-[14px] font-semibold text-[#07111E] shadow-[0_0_40px_rgba(129,185,233,.35)] transition-transform hover:scale-[1.03]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-secondary-400/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Consult an Expert</span>
            <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#how"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-[14px] font-semibold text-white/80 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
          >
            <PlayCircle className="h-4 w-4" />
            How it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 flex items-center gap-3"
        >
          <div className="flex">
            {['from-secondary-300 to-[#3B83BE]', 'from-sand-300 to-[#D4A882]', 'from-mist-300 to-[#8298BA]', 'from-gold-300 to-gold-400'].map((g, i) => (
              <span key={g} className={`h-7 w-7 rounded-full border-2 border-[#07111E] bg-gradient-to-br ${g} ${i ? '-ml-2' : ''}`} />
            ))}
          </div>
          <p className="text-left text-[12.5px] leading-tight text-white/50">
            <span className="font-bold text-white">12,000+</span> verified experts
            <br />
            ready to help you today
          </p>
        </motion.div>

        <motion.div style={{ y }} className="relative mt-16 w-full max-w-4xl [perspective:1400px]">
          <motion.div
            style={{ rotateX, scale }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease }}
            className="relative rounded-[22px] p-px [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-secondary-400/60 via-white/10 to-transparent" />
            <div className="relative overflow-hidden rounded-[21px] bg-[#0B1A2C]/95 text-left shadow-[0_40px_120px_-20px_rgba(59,131,190,.5)] backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <div className="mx-auto flex h-7 w-full max-w-sm items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 text-[11px] text-white/40">
                  <Search className="h-3 w-3" />
                  buildinghelp.com/experts
                </div>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-[1.4fr_1fr]">
                <div className="flex flex-col gap-2.5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[13px] font-bold">Matched experts</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Online now
                    </span>
                  </div>
                  {EXPERTS.map((e, i) => (
                    <motion.div
                      key={e.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.3 + i * 0.15, ease }}
                      className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.03] p-3 transition-colors hover:border-secondary-400/30 hover:bg-white/[0.06]"
                    >
                      <span className={`relative h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${e.grad}`}>
                        {e.online && <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#0B1A2C] bg-emerald-400" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-[13px] font-bold">
                          {e.name}
                          <BadgeCheck className="h-3.5 w-3.5 text-secondary-400" />
                        </div>
                        <div className="truncate text-[11px] text-white/45">{e.role}</div>
                      </div>
                      <div className="hidden items-center gap-0.5 sm:flex">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-gold-400 text-gold-400" />
                        ))}
                      </div>
                      <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-[#07111E]">Consult</span>
                    </motion.div>
                  ))}
                </div>
                <div className="hidden flex-col gap-2.5 md:flex">
                  <div className="flex-1 rounded-xl border border-white/6 bg-gradient-to-br from-[#3B83BE]/30 via-[#0B1A2C] to-sand-400/20 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Avg. match time</div>
                    <div className="mt-1 text-[36px] font-extrabold tracking-tight">1m 48s</div>
                    <div className="mt-3 flex h-12 items-end gap-1">
                      {[40, 65, 45, 80, 55, 90, 70, 100, 75, 85].map((h, i) => (
                        <motion.span
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 1.5 + i * 0.05, ease }}
                          className="flex-1 rounded-sm bg-gradient-to-t from-[#3B83BE] to-secondary-300"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.03] p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sand-400/15">
                      <MessageCircle className="h-4 w-4 text-sand-400" />
                    </span>
                    <div>
                      <div className="text-[12px] font-bold">New message</div>
                      <div className="text-[11px] text-white/45">&ldquo;Here&apos;s a first sketch…&rdquo;</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute -top-6 -right-2 hidden animate-float items-center gap-2.5 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-left shadow-xl backdrop-blur-xl lg:-right-20 md:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-400/20">
              <Zap className="h-4 w-4 text-secondary-300" />
            </span>
            <div>
              <div className="text-[12.5px] font-bold">Matched in 2 min</div>
              <div className="text-[11px] text-white/50">Average response time</div>
            </div>
          </div>
          <div className="absolute bottom-24 -left-28 hidden animate-float items-center gap-2.5 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-left shadow-xl backdrop-blur-xl [animation-delay:1.5s] lg:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400/20">
              <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
            </span>
            <div>
              <div className="text-[12.5px] font-bold">4.9 avg rating</div>
              <div className="text-[11px] text-white/50">From 340k+ reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
