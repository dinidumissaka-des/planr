'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ChevronRight, Landmark, Sparkles, X } from 'lucide-react'
import { architects } from '@/lib/architects'
import { CATEGORY_ICON, DarkPill, ease } from './ui'

const COLORS = ['#81B9E9', '#3B83BE', '#A2B2CD', '#81B9E9', '#E1C1A6', '#5E9FD6']

const CLUSTERS = [
  { x: 0.57, y: 0.55, label: 'Planr AI' },
  { x: 0.76, y: 0.42, label: 'Structural engineer' },
  { x: 0.4, y: 0.74, label: 'Site visit' },
]

type Dot = { x: number; y: number; r: number; a: number; c: string; p: number; s: number }

function makeDots(w: number, h: number): Dot[] {
  const dots: Dot[] = []
  const count = Math.min(7000, Math.round((w * h) / 90))
  for (let i = 0; i < count; i++) {
    const x = Math.random()
    const y = Math.pow(Math.random(), 0.7)
    const keep = (0.2 + y * 0.6 + Math.max(0, x - 0.5) * 1.4) * (x < 0.3 ? 0.35 : 1)
    if (Math.random() > keep) continue
    dots.push({
      x: x * w,
      y: y * h,
      r: 0.5 + Math.random() * 1.1,
      a: 0.2 + Math.random() * 0.6,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      p: Math.random() * Math.PI * 2,
      s: 0.25 + Math.random() * 0.6,
    })
  }
  for (const cl of CLUSTERS) {
    for (let i = 0; i < 160; i++) {
      const ang = Math.random() * Math.PI * 2
      const rad = Math.pow(Math.random(), 1.6) * 70
      dots.push({
        x: cl.x * w + Math.cos(ang) * rad,
        y: cl.y * h + Math.sin(ang) * rad * 0.8,
        r: 0.6 + Math.random() * 1.2,
        a: 0.35 + Math.random() * 0.55,
        c: Math.random() > 0.8 ? '#E1C1A6' : '#3B83BE',
        p: Math.random() * Math.PI * 2,
        s: 0.3 + Math.random() * 0.6,
      })
    }
  }
  return dots
}

function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots: Dot[] = []
    let w = 0
    let h = 0
    let raf = 0
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0, target: 0 }
    const radius = 150

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      pointer.x += (pointer.tx - pointer.x) * 0.12
      pointer.y += (pointer.ty - pointer.y) * 0.12
      pointer.strength += (pointer.target - pointer.strength) * 0.08
      for (const d of dots) {
        const depth = d.y / h
        const phase = d.x * 0.007 - t * 0.0011 + d.y * 0.004
        const crest = Math.sin(phase)
        let x = d.x + Math.sin(t * 0.0004 * d.s + d.p) * 3
        let y = d.y + crest * (6 + 16 * depth) + Math.sin(d.x * 0.0025 + t * 0.0006) * 8
        let alpha = d.a * (0.55 + 0.45 * (crest * 0.5 + 0.5))
        let r = d.r
        if (pointer.strength > 0.01) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < radius && dist > 0.001) {
            const f = (1 - dist / radius) ** 2 * pointer.strength
            const ripple = Math.sin(dist * 0.08 - t * 0.008) * 4 * f
            x += (dx / dist) * (f * 36 + ripple)
            y += (dy / dist) * (f * 36 + ripple)
            alpha = Math.min(1, alpha + f * 0.6)
            r = d.r * (1 + f * 0.8)
          }
        }
        ctx.globalAlpha = alpha
        ctx.fillStyle = d.c
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= -radius && x <= rect.width + radius && y >= -radius && y <= rect.height + radius
      if (pointer.target === 0 && inside) {
        pointer.x = x
        pointer.y = y
      }
      pointer.tx = x
      pointer.ty = y
      pointer.target = inside ? 1 : 0
    }
    const onLeave = () => {
      pointer.target = 0
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = makeDots(w, h)
      draw(0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting && !reduce) raf = requestAnimationFrame(loop)
    })
    io.observe(canvas)
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
      <canvas ref={ref} className="h-full w-full" aria-hidden />
      {CLUSTERS.map((cl, i) => (
        <motion.div
          key={cl.label}
          className="absolute hidden items-center gap-1 text-[10px] text-gray-600 sm:flex dark:text-white/70"
          style={{ left: `${cl.x * 100}%`, top: `${cl.y * 100}%` }}
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: [0, -6, 0] } : { opacity: 1, y: 0 }}
          transition={{ opacity: { delay: 0.8 + i * 0.2, duration: 0.6 }, y: inView ? { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 } }}
        >
          <span className="relative -mt-8 flex items-center gap-1 rounded-full bg-white/80 px-1.5 py-0.5 shadow-[0_1px_3px_rgba(7,17,30,0.08)] backdrop-blur dark:bg-[#0D1B2E]/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B83BE]" />
            {cl.label}
          </span>
        </motion.div>
      ))}
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
      className="absolute bottom-5 right-4 z-10 hidden w-[218px] rounded-xl border border-gray-200/80 bg-white/90 p-1.5 shadow-[0_8px_30px_-10px_rgba(7,17,30,0.2)] backdrop-blur lg:block dark:border-white/10 dark:bg-[#0D1B2E]/90"
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
    <section className="relative flex min-h-[640px] flex-col lg:h-[698px]">
      <ParticleField />
      <div className="relative mx-auto w-full max-w-[1360px] px-5 pt-14 lg:px-10 lg:pt-[110px] lg:text-center">
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
          className="mt-4 max-w-[860px] font-serif lg:mx-auto text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-gray-900 lg:text-[64px] dark:text-white"
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
      <motion.div
        className="flex w-max items-center"
        animate={inView ? { x: ['0%', '-50%'] } : { x: '0%' }}
        transition={inView ? { duration: 90, ease: 'linear', repeat: Infinity } : { duration: 0 }}
      >
        <SpecialismRow />
        <SpecialismRow hidden />
      </motion.div>
    </div>
  )
}
