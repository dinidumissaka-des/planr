"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Info, X, Bell } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import { fetchNotifications, dismissNotification, type Notification } from "@/lib/data"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const data = await fetchNotifications(user.id)
      setNotifications(data)
      setLoading(false)
    }
    load()
  }, [])

  async function dismiss(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
    await dismissNotification(id)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Notification" icon={<Bell className="w-5 h-5 text-gray-700 dark:text-gray-400" />} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Notification</p>

          <div className="flex flex-col gap-0 bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-white/8">
            {loading ? (
              <div className="divide-y divide-gray-100 dark:divide-white/8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 px-6 py-5">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/8 animate-pulse flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-40 bg-gray-100 dark:bg-white/8 rounded animate-pulse" />
                      <div className="h-3 w-64 bg-gray-100 dark:bg-white/8 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50/60 dark:hover:bg-white/4 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {n.type === "success" ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" fill="#10b981" color="white" />
                    ) : (
                      <Info className="w-6 h-6 text-secondary" fill="#81B9E9" color="white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{n.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{n.body}</p>
                  </div>

                  <button
                    onClick={() => dismiss(n.id)}
                    className="text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
