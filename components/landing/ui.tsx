'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import {
  Building2,
  Calculator,
  HardHat,
  Landmark,
  Leaf,
  Map as MapIcon,
  Sofa,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1360px] px-5 lg:px-10', className)}>{children}</div>
}

export function OutlinePill({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-[13px] text-gray-800 shadow-[0_1px_2px_rgba(7,17,30,0.06)] transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10',
        className,
      )}
    >
      {children}
    </a>
  )
}

export function DarkPill({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-10 items-center rounded-full bg-gray-900 px-5 text-[14px] text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
        className,
      )}
    >
      {children}
    </a>
  )
}

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  Architecture: Landmark,
  'Interior Design': Sofa,
  'Landscape Architecture': Leaf,
  'Urban Design': MapIcon,
  'Structural Engineering': Building2,
  Construction: HardHat,
  'Quantity Surveying': Calculator,
}
