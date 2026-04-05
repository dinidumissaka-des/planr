"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import {
  LayoutDashboard, MessageSquare, CalendarDays, CreditCard,
  MessageCircleQuestion, CalendarCheck, User, Search, X
} from "lucide-react"

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Question Answer", href: "/question-answer", icon: MessageSquare },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Billing", href: "/billing", icon: CreditCard },
]

const actions = [
  { label: "Ask a Question", href: "/question-answer", icon: MessageCircleQuestion },
  { label: "Book Consultation", href: "/bookings", icon: CalendarCheck },
]

const consultants = [
  { label: "Judith Lowe", sub: "Architecture", href: "/question-answer" },
  { label: "Conrad Harber", sub: "Urban Design", href: "/question-answer" },
  { label: "Erica Jones", sub: "Construction", href: "/question-answer" },
  { label: "Beth Fisher", sub: "Interior Design", href: "/bookings" },
  { label: "Priscilla Larkin", sub: "Residential Architect", href: "/bookings" },
  { label: "Davis Calzoni", sub: "Architect", href: "/question-answer" },
  { label: "Cooper Philips", sub: "Residential Architect", href: "/question-answer" },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  function navigate(href: string) {
    setOpen(false)
    router.push(href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <Command
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: 'inset 0 0 1px 0 rgba(7,16,29,0.32), 0 25px 50px -12px rgba(0,0,0,0.25)' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Command.Input
            autoFocus
            placeholder="Search pages, actions, consultants..."
            className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
          />
          <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <Command.List className="max-h-80 overflow-y-auto py-2">
          <Command.Empty className="py-8 text-center text-sm text-gray-400">
            No results found.
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading="Navigation" className="px-2">
            {navigation.map(({ label, href, icon: Icon }) => (
              <Command.Item
                key={href}
                value={label}
                onSelect={() => navigate(href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 cursor-pointer data-[selected=true]:bg-secondary/15 data-[selected=true]:text-primary transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                {label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-gray-100 mx-2" />

          {/* Actions */}
          <Command.Group heading="Actions" className="px-2">
            {actions.map(({ label, href, icon: Icon }) => (
              <Command.Item
                key={label}
                value={label}
                onSelect={() => navigate(href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 cursor-pointer data-[selected=true]:bg-secondary/15 data-[selected=true]:text-primary transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                {label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-gray-100 mx-2" />

          {/* Consultants */}
          <Command.Group heading="Consultants" className="px-2">
            {consultants.map(({ label, sub, href }) => (
              <Command.Item
                key={label}
                value={`${label} ${sub}`}
                onSelect={() => navigate(href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-secondary/15 data-[selected=true]:text-primary transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-4">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">↑↓</kbd> navigate
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">↵</kbd> select
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">esc</kbd> close
          </span>
        </div>
      </Command>
    </div>
  )
}
