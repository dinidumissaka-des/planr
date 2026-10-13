'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#what', label: 'What it is' },
  { href: '#how', label: 'How it works' },
  { href: '#experts', label: 'Experts' },
  { href: '#why', label: 'Why us' },
  { href: '#testimonials', label: 'Reviews' },
]

export function LandingNav() {
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    const onScroll = () => setScrolled(window.scrollY > 24)
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
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-500',
          scrolled
            ? 'border-white/10 bg-[#07111E]/75 shadow-[0_8px_32px_rgba(7,17,30,.35)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        )}
      >
        <a href="#" className="flex items-center gap-2 pl-1 text-[15px] font-extrabold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B83BE] via-secondary-400 to-sand-400 text-[13px] font-extrabold text-[#07111E] shadow-[0_0_24px_rgba(129,185,233,.45)]">
            B
          </span>
          buildinghelp
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-white/60 transition-colors hover:bg-white/8 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/8 hover:text-white"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="/signup"
            className="group inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-4 text-[13px] font-semibold text-[#07111E] transition-transform hover:scale-[1.03]"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>
    </header>
  )
}
