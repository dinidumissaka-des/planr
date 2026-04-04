"use client"

import { useState } from "react"
import { CheckCircle2, Info, X, Bell } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

const initialNotifications = [
  { id: 1, type: "success", title: "Good news, everyone", body: "Nothing to worry about, everything is going great!" },
  { id: 2, type: "success", title: "Good news, everyone", body: "Nothing to worry about, everything is going great!" },
  { id: 3, type: "info",    title: "Hey, did you know...", body: "This alert needs your attention, but its not super important." },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  function dismiss(id: number) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Notification" icon={<Bell className="w-5 h-5 text-gray-700" />} />

        <div className="flex-1 overflow-y-auto p-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Recent Notification</p>

          <div className="flex flex-col gap-0 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50/60 transition-colors">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {n.type === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" fill="#10b981" color="white" />
                  ) : (
                    <Info className="w-6 h-6 text-indigo-500" fill="#6366f1" color="white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 mb-0.5">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.body}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => dismiss(n.id)}
                  className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
