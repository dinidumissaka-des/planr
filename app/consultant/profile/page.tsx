"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConsultantSidebar } from "@/components/consultant-sidebar"
import { AppHeader } from "@/components/app-header"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import { fetchOrCreateConsultantProfile, updateConsultantProfile, type ConsultantProfile } from "@/lib/data"

const SPECIALIZATIONS = [
  "General",
  "Residential Architecture",
  "Commercial Architecture",
  "Interior Design",
  "Structural Engineering",
  "Urban Planning",
  "Landscape Design",
  "Project Management",
]

export default function ConsultantProfilePage() {
  const router = useRouter()
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [profile, setProfile]     = useState<ConsultantProfile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [specialization, setSpecialization] = useState("General")
  const [bio, setBio]             = useState("")
  const [years, setYears]         = useState("")
  const [email, setEmail]         = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      setEmail(user.email ?? "")
      const first = user.user_metadata?.first_name ?? ""
      const last  = user.user_metadata?.last_name  ?? ""
      const name  = first && last ? `${first} ${last}` : (user.email ?? "")

      const p = await fetchOrCreateConsultantProfile(user.id, name)
      if (p) {
        setProfile(p)
        setDisplayName(p.display_name)
        setSpecialization(p.specialization)
        setBio(p.bio ?? "")
        setYears(p.years_experience != null ? String(p.years_experience) : "")
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    await updateConsultantProfile(profile.user_id, {
      display_name: displayName,
      specialization,
      bio: bio || null,
      years_experience: years ? parseInt(years, 10) : null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <ConsultantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Profile" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-lg mx-auto flex flex-col gap-5">

            {/* Avatar card */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6 flex items-center gap-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ backgroundColor: "rgba(129,185,233,0.20)", color: "#1A3050" }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900 dark:text-white truncate">{displayName || "—"}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{email}</p>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-2"
                  style={{ backgroundColor: "rgba(129,185,233,0.18)", color: "#1A3050" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#81B9E9]" />
                  Consultant
                </span>
              </div>
            </div>

            {/* Form */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 flex flex-col gap-4 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Professional details</p>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Display name</label>
                  <Input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Full name"
                    className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Specialization</label>
                  <select
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    className="h-11 w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    {SPECIALIZATIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Years of experience</label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={years}
                    onChange={e => setYears(e.target.value)}
                    placeholder="e.g. 8"
                    className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell clients about your background and expertise…"
                    className="w-full resize-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !displayName.trim()}
                  className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
                >
                  {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
