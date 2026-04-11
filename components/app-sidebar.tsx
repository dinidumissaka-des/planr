"use client"

import { LayoutDashboard, MessageSquare, CalendarDays, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase"

function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => Promise<void>; onCancel: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-xs rounded-t-3xl md:rounded-2xl p-7 shadow-2xl">
        <div className="flex justify-center mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${loading ? "bg-gray-100 dark:bg-white/8" : "bg-red-50 dark:bg-red-500/10"}`}>
            {loading
              ? <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
              : <LogOut className="w-6 h-6 text-red-500" />
            }
          </div>
        </div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white text-center mb-2">
          {loading ? "Signing out…" : "Sign out?"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6">
          {loading ? "Please wait a moment." : "You'll need to sign back in to access your account."}
        </p>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full h-11 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl mb-2.5 transition-colors"
        >
          {loading ? "Signing out…" : "Yes, sign out"}
        </button>
        {!loading && (
          <button
            onClick={onCancel}
            className="w-full h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",       shortLabel: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare,   label: "Question Answer", shortLabel: "Q&A",       href: "/question-answer" },
  { icon: CalendarDays,    label: "Bookings",        shortLabel: "Bookings",  href: "/bookings" },
  { icon: CreditCard,      label: "Billing",         shortLabel: "Billing",   href: "/billing" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showSignOut, setShowSignOut] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-white dark:bg-[#0A1525] border-r border-gray-100 dark:border-white/8 flex-col py-6 px-4">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-8">
          <img src="/planr-logo.svg" alt="Planr" className="h-7 dark:hidden" />
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7 hidden dark:block" />
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
        <button
          onClick={() => setShowSignOut(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/8 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </aside>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0A1525] border-t border-gray-100 dark:border-white/8 flex items-center justify-around px-2 py-2 safe-b">
        {navItems.map(({ icon: Icon, label, shortLabel, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                active
                  ? "bg-secondary/40 text-primary dark:bg-secondary/20 dark:text-white"
                  : "text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{shortLabel}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── Sign out modal ── */}
      {showSignOut && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOut(false)}
        />
      )}
    </>
  )
}
