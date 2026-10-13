'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#tracker', label: 'Build tracker' },
  { href: '#consultants', label: 'Consultants' },
  { href: '#ask', label: 'Ask Planr' },
]

export function LandingNav() {
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b bg-[#F5F2EC]/90 backdrop-blur-md transition-colors dark:bg-[#07111E]/90',
        scrolled ? 'border-gray-900/10 dark:border-white/10' : 'border-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-8">
        <a href="#" aria-label="Planr home">
          <img src="/planr-logo.svg" alt="Planr" className="h-6 dark:invert" />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[14px] text-gray-600 transition-colors hover:text-gray-900 dark:text-white/60 dark:hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:text-gray-900 dark:text-white/50 dark:hover:text-white"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href="/login" className="hidden px-2 text-[14px] text-gray-600 hover:text-gray-900 sm:block dark:text-white/60 dark:hover:text-white">
            Log in
          </a>
          <a
            href="/signup"
            className="inline-flex h-9 items-center rounded-xl bg-gray-900 px-4 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-gray-900"
          >
            Book a consultation
          </a>
        </div>
      </nav>
    </header>
  )
}
