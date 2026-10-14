'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#ai', label: 'Planr AI' },
  { href: '#how', label: 'How it works' },
  { href: '#tracker', label: 'Build tracker' },
  { href: '#expertise', label: 'Expertise' },
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
        'fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors',
        scrolled ? 'border-white/10 bg-[#07111E]/85' : 'border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-8">
        <a href="#" aria-label="Planr home">
          <img src="/planr-logo.svg" alt="Planr" className="h-6 invert" />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[14px] text-white/60 transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:text-white"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href="/login" className="hidden px-2 text-[14px] text-white/60 hover:text-white sm:block">
            Log in
          </a>
          <a
            href="/signup"
            className="inline-flex h-9 items-center rounded-xl bg-white px-4 text-[13.5px] font-semibold text-gray-900 transition-opacity hover:opacity-90"
          >
            Book a consultation
          </a>
        </div>
      </nav>
    </header>
  )
}
