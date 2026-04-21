"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Check, Eye, EyeOff, LogOut, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteUserAccount } from "@/lib/data"

export default function SettingsPage() {
  const router = useRouter()

  // Password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState("")

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [bookingReminders, setBookingReminders] = useState(true)
  const [newsletters, setNewsletters] = useState(false)

  // Danger
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  async function handleChangePassword() {
    if (!newPassword) { setPwError("Please enter a new password"); return }
    if (newPassword !== confirmPassword) { setPwError("Passwords do not match"); return }
    if (newPassword.length < 6) { setPwError("Password must be at least 6 characters"); return }
    setPwError("")
    setPwSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwSaving(false)
    if (error) { setPwError(error.message); return }
    setPwSaved(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setPwSaved(false), 2500)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") { setDeleteError('Type "DELETE" to confirm'); return }
    setDeleteError("")
    setDeleting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    await deleteUserAccount(user.id)
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Account Settings" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-5">

            {/* Change password */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Change Password</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Choose a strong password you haven't used before.</p>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">New password</label>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl pr-11"
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3.5 bottom-3 text-gray-400 hover:text-gray-600 transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Confirm new password</label>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl pr-11"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3.5 bottom-3 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {pwError && <p className="text-xs text-red-500 mt-2">{pwError}</p>}
              <Button
                onClick={handleChangePassword}
                disabled={pwSaving}
                className={`mt-4 h-10 px-5 text-sm font-semibold rounded-xl transition-all ${pwSaved ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"}`}
              >
                {pwSaved ? <><Check className="w-4 h-4 mr-2" />Updated</> : pwSaving ? "Updating…" : "Update Password"}
              </Button>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Notifications</p>
              <div className="flex flex-col divide-y divide-gray-50 dark:divide-white/5">
                {[
                  { label: "Email notifications", sub: "Receive updates about your consultations via email", value: emailNotifs, set: setEmailNotifs },
                  { label: "Booking reminders", sub: "Get reminded before upcoming consultations", value: bookingReminders, set: setBookingReminders },
                  { label: "Newsletters & tips", sub: "Occasional product updates and design tips", value: newsletters, set: setNewsletters },
                ].map(({ label, sub, value, set }) => (
                  <div key={label} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
                    </div>
                    <button
                      onClick={() => set(v => !v)}
                      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 outline-none shadow-none ${value ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-white/10"}`}
                    >
                      <span
                        style={{ transform: `translateX(${value ? 22 : 2}px)` }}
                        className={`absolute top-1 left-0 w-4 h-4 rounded-full shadow-none transition-transform duration-200 ${value ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-400"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Danger Zone</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Permanent actions that cannot be undone.</p>
              <div className="flex flex-col gap-3">
                {!showSignOutConfirm ? (
                  <button
                    onClick={() => setShowSignOutConfirm(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Sign out</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">Sign out of your account on this device</p>
                    </div>
                  </button>
                ) : (
                  <div className="px-4 py-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/8">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Are you sure you want to sign out?</p>
                    <div className="flex gap-2">
                      <button onClick={handleSignOut} className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors">Yes, sign out</button>
                      <button onClick={() => setShowSignOutConfirm(false)} className="flex-1 h-9 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => { setShowDeleteConfirm(true); setDeleteInput(""); setDeleteError("") }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 dark:border-red-500/15 text-sm text-left hover:bg-red-50 dark:hover:bg-red-500/8 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-500">Delete account</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">Permanently delete your account and all data</p>
                    </div>
                  </button>
                ) : (
                  <div className="px-4 py-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/8">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Delete your account?</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">This will permanently erase all your projects, bookings, chats, and personal data. This cannot be undone.</p>
                    <Input
                      value={deleteInput}
                      onChange={e => setDeleteInput(e.target.value)}
                      placeholder='Type "DELETE" to confirm'
                      className="h-9 text-sm bg-white dark:bg-white/5 border-red-200 dark:border-red-500/30 dark:text-white rounded-lg mb-2"
                    />
                    {deleteError && <p className="text-xs text-red-500 mb-2">{deleteError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="flex-1 h-9 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        {deleting ? "Deleting…" : "Delete account"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 h-9 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
