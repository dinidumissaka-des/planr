"use client"

import { Bell, ChevronDown, CheckCircle2, Info, X, ArrowUpRight, Sun, Moon, Command, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/hooks/use-theme"
import { createClient } from "@/lib/supabase"
import { fetchNotifications, dismissNotification, type Notification } from "@/lib/data"

function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    // Two-tone "ding": high note fades into a lower harmonic
    osc.type = "sine"
    osc.frequency.setValueAtTime(1046, ctx.currentTime)          // C6
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.12)    // G5
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.55)
    osc.onended = () => ctx.close()
  } catch {
    // AudioContext blocked (e.g. no user gesture yet) — silently skip
  }
}

function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-xs rounded-t-3xl md:rounded-2xl p-7 shadow-2xl">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white text-center mb-2">Sign out?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6">
          You'll need to sign back in to access your account.
        </p>
        <button
          onClick={onConfirm}
          className="w-full h-11 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl mb-2.5 transition-colors"
        >
          Yes, sign out
        </button>
        <button
          onClick={onCancel}
          className="w-full h-11 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

interface AppHeaderProps {
  title: string
  icon?: React.ReactNode
}

export function AppHeader({ title, icon }: AppHeaderProps) {
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserEmail(user.email ?? "")
      const first = user.user_metadata?.first_name ?? ""
      const last = user.user_metadata?.last_name ?? ""
      setUserName(first && last ? `${first} ${last}` : (user.email ?? ""))

      const notifs = await fetchNotifications(user.id)
      setNotifications(notifs)

      // Play sound once on load if there are unread notifications (once per session)
      if (notifs.length > 0 && !sessionStorage.getItem("planr_notif_sound")) {
        playNotificationSound()
        sessionStorage.setItem("planr_notif_sound", "1")
      }

      // Realtime: play sound + prepend when a new notification row is inserted
      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev])
            playNotificationSound()
            // Reset session flag so next load plays again
            sessionStorage.removeItem("planr_notif_sound")
          }
        )
        .subscribe()
    }

    loadUser()
    return () => { channel && supabase.removeChannel(channel) }
  }, [])

  const initials = userName
    ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : userEmail.slice(0, 2).toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  function dismiss(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
    dismissNotification(id)
  }

  const unread = notifications.length

  return (
    <>
      <header className="h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0 relative z-30">
        {/* Mobile: logo; Desktop: page title */}
        <img src="/planr-logo.svg" alt="Planr" className="h-6 md:hidden dark:hidden" />
        <h1 className="hidden md:flex text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        <div className="flex items-center gap-3">

          {/* Cmd+K hint */}
          <button
            onClick={() => {
              const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
              document.dispatchEvent(e)
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full text-[9px] font-bold text-primary flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {/* Desktop dropdown */}
            {notifOpen && (
              <div className="hidden md:block absolute right-0 top-10 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    View all <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <Bell className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-xs font-medium">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex-shrink-0 mt-0.5">
                          {n.type === "success"
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" fill="#10b981" color="white" />
                            : <Info className="w-5 h-5 text-secondary" fill="#81B9E9" color="white" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.body}</p>
                        </div>
                        <button onClick={(e) => dismiss(n.id, e)} className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                    <Link
                      href="/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="block w-full text-center text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg"
                    >
                      See all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

          {/* User button */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => setUserOpen(o => !o)}
              className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary/25 dark:bg-secondary/20 flex items-center justify-center text-xs font-bold text-primary dark:text-secondary">
                {initials}
              </div>
              <span className="hidden sm:inline">{userName || userEmail}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform ${userOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Desktop dropdown */}
            {userOpen && (
              <div className="hidden md:block absolute right-0 top-11 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/25 dark:bg-secondary/20 flex items-center justify-center text-xs font-bold text-primary dark:text-secondary flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName || userEmail}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{userEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
                  <Link href="/profile" onClick={() => setUserOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link href="/settings" onClick={() => setUserOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
                  <button
                    onClick={() => { setUserOpen(false); setShowSignOut(true) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/8 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile full-screen notifications */}
      {notifOpen && (
        <div className="fixed inset-0 bg-white dark:bg-[#07111E] z-50 flex flex-col md:hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-base font-bold text-gray-900 dark:text-white">Notifications</p>
            <button onClick={() => setNotifOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-20">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {n.type === "success"
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" fill="#10b981" color="white" />
                      : <Info className="w-5 h-5 text-secondary" fill="#81B9E9" color="white" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{n.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{n.body}</p>
                  </div>
                  <button onClick={(e) => dismiss(n.id, e)} className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/notifications"
                onClick={() => setNotifOpen(false)}
                className="block w-full text-center text-sm font-semibold text-gray-600 dark:text-gray-300 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                See all notifications
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Mobile full-screen profile */}
      {userOpen && (
        <div className="fixed inset-0 bg-white dark:bg-[#07111E] z-50 flex flex-col md:hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-base font-bold text-gray-900 dark:text-white">Account</p>
            <button onClick={() => setUserOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Profile block */}
            <div className="px-5 py-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary/25 dark:bg-secondary/20 flex items-center justify-center text-lg font-bold text-primary dark:text-secondary flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{userName || userEmail}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{userEmail}</p>
                </div>
              </div>
            </div>
            {/* Menu items */}
            <div className="py-2">
              <Link href="/profile" onClick={() => setUserOpen(false)} className="w-full flex items-center gap-4 px-5 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <User className="w-5 h-5 text-gray-400" />
                My Profile
              </Link>
              <Link href="/settings" onClick={() => setUserOpen(false)} className="w-full flex items-center gap-4 px-5 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      )}

      {showSignOut && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOut(false)}
        />
      )}
    </>
  )
}
