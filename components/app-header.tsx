"use client"

import { Bell, ChevronDown, CheckCircle2, Info, X, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

const initialNotifications = [
  { id: 1, type: "success", title: "Good news, everyone",  body: "Nothing to worry about, everything is going great!" },
  { id: 2, type: "success", title: "Good news, everyone",  body: "Nothing to worry about, everything is going great!" },
  { id: 3, type: "info",    title: "Hey, did you know...", body: "This alert needs your attention, but its not super important." },
]

interface AppHeaderProps {
  title: string
  icon?: React.ReactNode
}

export function AppHeader({ title, icon }: AppHeaderProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  function dismiss(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unread = notifications.length

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 relative z-30">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Bell with dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="relative text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-gray-900 flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Notifications</p>
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
                >
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {/* List */}
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-xs font-medium">No notifications</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">
                        {n.type === "success"
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500" fill="#10b981" color="white" />
                          : <Info className="w-5 h-5 text-indigo-500" fill="#6366f1" color="white" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 mb-0.5">{n.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{n.body}</p>
                      </div>
                      <button
                        onClick={(e) => dismiss(n.id, e)}
                        className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <Link
                    href="/notifications"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg"
                  >
                    See all notifications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200" />

        <button className="flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            SF
          </div>
          <span>Sahan Fernando</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </header>
  )
}
