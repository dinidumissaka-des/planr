"use client"

import { LayoutDashboard, MessageSquare, CalendarDays, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",       href: "/dashboard" },
  { icon: MessageSquare,   label: "Question Answer", href: "/question-answer" },
  { icon: CalendarDays,    label: "Bookings",        href: "/bookings" },
  { icon: CreditCard,      label: "Billing",         href: "/billing" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-white dark:bg-[#0A1525] border-r border-gray-100 dark:border-white/8 flex-col py-6 px-4">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-8">
          <img src="/planr-logo.svg" alt="Planr" className="h-7 dark:invert" />
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary/40 text-primary dark:text-white dark:bg-secondary/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Link>
      </aside>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0A1525] border-t border-gray-100 dark:border-white/8 flex items-center justify-around px-2 py-2 safe-b">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                active
                  ? "text-primary dark:text-secondary"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label.split(" ")[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
