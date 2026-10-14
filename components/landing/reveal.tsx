'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 border-t border-gray-900/15 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-500 dark:border-white/15 dark:text-white/50">
      <span className="text-[#3B83BE] dark:text-secondary-300">{index}</span>
      <span>{label}</span>
    </div>
  )
}
