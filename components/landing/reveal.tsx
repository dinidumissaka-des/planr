'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-secondary-400/30 bg-secondary-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#2A6499] dark:text-secondary-400">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary-400" />
      {children}
    </span>
  )
}
