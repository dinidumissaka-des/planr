"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Check, Camera } from "lucide-react"

const PROJECT_TYPE_LABELS: Record<string, string> = {
  new_build: "New Build",
  renovation: "Renovation",
  interior_design: "Interior Design",
  extension: "Extension",
}

const BUDGET_LABELS: Record<string, string> = {
  under_50k: "Under $50k",
  "50k_150k": "$50k – $150k",
  "150k_300k": "$150k – $300k",
  "300k_plus": "$300k+",
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  within_3_months: "Within 3 months",
  "3_6_months": "3 – 6 months",
  flexible: "Flexible",
}

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [projectType, setProjectType] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [timeline, setTimeline] = useState("")
  const [location, setLocation] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email ?? "")
        setFirstName(user.user_metadata?.first_name ?? "")
        setLastName(user.user_metadata?.last_name ?? "")
        setPhone(user.user_metadata?.phone ?? "")
        setProjectType(user.user_metadata?.project_type ?? "")
        setBudgetRange(user.user_metadata?.budget_range ?? "")
        setTimeline(user.user_metadata?.timeline ?? "")
        setLocation(user.user_metadata?.location ?? "")
      }
    }
    load()
  }, [])

  const initials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || email.slice(0, 2).toUpperCase()

  async function handleSave() {
    if (!firstName || !lastName) { setError("First and last name are required"); return }
    setError("")
    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName, phone, project_type: projectType, budget_range: budgetRange, timeline, location },
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="My Profile" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-5">

            {/* Avatar + name banner */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6 flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-secondary/25 dark:bg-secondary/20 flex items-center justify-center text-2xl font-bold text-primary dark:text-secondary">
                  {initials}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{firstName} {lastName}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
              </div>
            </div>

            {/* Personal info */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Personal Information</p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">First name</label>
                    <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Last name</label>
                    <Input value={lastName} onChange={e => setLastName(e.target.value)} className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Email address</label>
                  <Input value={email} disabled className="h-11 bg-gray-100 dark:bg-white/3 border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-600 text-sm rounded-xl cursor-not-allowed" />
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Email cannot be changed here.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Mobile number</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl" />
                </div>
              </div>
            </div>

            {/* Project preferences */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Project Preferences</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Project type</label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-xl px-3 outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                  >
                    <option value="">Select type</option>
                    {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Budget range</label>
                  <select
                    value={budgetRange}
                    onChange={e => setBudgetRange(e.target.value)}
                    className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-xl px-3 outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                  >
                    <option value="">Select budget</option>
                    {Object.entries(BUDGET_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Timeline</label>
                  <select
                    value={timeline}
                    onChange={e => setTimeline(e.target.value)}
                    className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-xl px-3 outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                  >
                    <option value="">Select timeline</option>
                    {Object.entries(TIMELINE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Project location</label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Melbourne, VIC" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl" />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              onClick={handleSave}
              disabled={saving}
              className={`h-11 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"}`}
            >
              {saved ? <><Check className="w-4 h-4 mr-2" />Saved</> : saving ? "Saving…" : "Save Changes"}
            </Button>

          </div>
        </div>
      </div>
    </div>
  )
}
