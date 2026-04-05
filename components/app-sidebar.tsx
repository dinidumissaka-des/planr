"use client"

import { LayoutDashboard, MessageSquare, CalendarDays, CreditCard, LogOut, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Question Answer", href: "/question-answer" },
  { icon: CalendarDays, label: "Bookings", href: "/bookings" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-[220px] flex-shrink-0 bg-white dark:bg-[#0A1525] border-r border-gray-100 dark:border-white/8 flex flex-col py-6 px-4">
      <Link href="/" className="flex items-center gap-2 px-2 mb-8">
        <div className="w-7 h-7 bg-yellow-400 rounded flex items-center justify-center">
          <Home className="w-3.5 h-3.5 text-black" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">planr.</span>
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
  )
}
