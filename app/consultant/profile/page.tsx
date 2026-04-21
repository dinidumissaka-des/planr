"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { ConsultantSidebar } from "@/components/consultant-sidebar"
import { AppHeader } from "@/components/app-header"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import {
  fetchOrCreateConsultantProfile,
  updateConsultantProfile,
  type ConsultantProfile,
  type ExperienceEntry,
  type EducationEntry,
  type PortfolioItem,
} from "@/lib/data"

const ROLES = [
  "Architect", "Interior Designer", "Landscape Architect",
  "Urban Designer", "Structural Engineer", "Contractor", "Quantity Surveyor",
]

const ROLE_CATEGORIES: Record<string, string> = {
  "Architect": "Architecture",
  "Interior Designer": "Interior Design",
  "Landscape Architect": "Landscape Architecture",
  "Urban Designer": "Urban Design",
  "Structural Engineer": "Structural Engineering",
  "Contractor": "Construction",
  "Quantity Surveyor": "Quantity Surveying",
}

const SPECIALIZATIONS_BY_ROLE: Record<string, string[]> = {
  "Architect": ["Residential Design", "Commercial Architecture", "Tropical Modernism", "Hospitality & Resorts", "Sustainable Construction", "Heritage Restoration", "Coastal Architecture", "Passive Design"],
  "Interior Designer": ["Luxury Residential", "Boutique Hospitality", "Local Craft Integration", "Space Planning", "Heritage Renovation", "Colonial Interiors", "Material Sourcing"],
  "Landscape Architect": ["Tropical Garden Design", "Resort Landscaping", "Water Features", "Sustainable Planting", "Urban Green Spaces"],
  "Urban Designer": ["Urban Regeneration", "Public Space Design", "Mixed-Use Development", "Community Planning", "Walkability & Green Infrastructure"],
  "Structural Engineer": ["Hillside Construction", "Structural Assessments", "Residential Engineering", "Renovation Structural Work", "Earthquake-Resistant Design"],
  "Contractor": ["Residential Construction", "Commercial Builds", "Renovation & Extension", "Project Management", "Hotel Construction"],
  "Quantity Surveyor": ["Cost Estimation", "Bill of Quantities", "Contract Administration", "Value Engineering", "Tender Negotiation"],
}

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"]

function emptyExp(): ExperienceEntry {
  return { company: "", role: "", type: "Full-time", period: "", description: "" }
}
function emptyEdu(): EducationEntry { return { school: "", dept: "", period: "" } }
function emptyPortfolio(): PortfolioItem { return { url: "", caption: "", category: "" } }

export default function ConsultantProfilePage() {
  const router = useRouter()
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [profile, setProfile]     = useState<ConsultantProfile | null>(null)
  const [email, setEmail]         = useState("")

  // Basic fields
  const [displayName, setDisplayName]     = useState("")
  const [role, setRole]                   = useState("")
  const [company, setCompany]             = useState("")
  const [location, setLocation]           = useState("")
  const [workingHours, setWorkingHours]   = useState("")
  const [years, setYears]                 = useState("")
  const [bio, setBio]                     = useState("")

  // Specializations
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])

  // Experience / Education / Portfolio
  const [experience, setExperience]   = useState<ExperienceEntry[]>([])
  const [education, setEducation]     = useState<EducationEntry[]>([])
  const [portfolio, setPortfolio]     = useState<PortfolioItem[]>([])

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
        setRole(p.role ?? "")
        setCompany(p.company ?? "")
        setLocation(p.location ?? "")
        setWorkingHours(p.working_hours ?? "")
        setYears(p.years_experience != null ? String(p.years_experience) : "")
        setBio(p.bio ?? "")
        setSelectedSpecs(p.specializations ?? [])
        setExperience(p.experience?.length ? p.experience : [])
        setEducation(p.education?.length ? p.education : [])
        setPortfolio(p.portfolio?.length ? p.portfolio : [])
      }
      setLoading(false)
    }
    load()
  }, [router])

  const availableSpecs = role ? (SPECIALIZATIONS_BY_ROLE[role] ?? []) : []

  function toggleSpec(s: string) {
    setSelectedSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  // Experience helpers
  function updateExp(i: number, field: keyof ExperienceEntry, val: string) {
    setExperience(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  // Education helpers
  function updateEdu(i: number, field: keyof EducationEntry, val: string) {
    setEducation(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  // Portfolio helpers
  function updatePortfolio(i: number, field: keyof PortfolioItem, val: string) {
    setPortfolio(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p))
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    const cleanExp  = experience.filter(e => e.company.trim() && e.role.trim())
    const cleanEdu  = education.filter(e => e.school.trim() && e.dept.trim())
    const cleanPort = portfolio.filter(p => p.url.trim())
    await updateConsultantProfile(profile.user_id, {
      display_name: displayName,
      role: role || null,
      category: role ? (ROLE_CATEGORIES[role] ?? role) : null,
      company: company.trim() || null,
      location: location.trim() || null,
      working_hours: workingHours.trim() || null,
      specializations: selectedSpecs,
      specialization: selectedSpecs[0] ?? "General",
      bio: bio.trim() || null,
      years_experience: years ? parseInt(years, 10) : null,
      experience: cleanExp,
      education: cleanEdu,
      portfolio: cleanPort,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"

  const inputCls = "h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
  const sectionCls = "bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 flex flex-col gap-4 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]"

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

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
              </div>
            ) : (
              <>
                {/* Basic info */}
                <div className={sectionCls}>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Basic information</p>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Display name</label>
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Full name" className={inputCls} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Role</label>
                    <select
                      value={role}
                      onChange={e => { setRole(e.target.value); setSelectedSpecs([]) }}
                      className="h-11 w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    >
                      <option value="">Select role…</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Company / Firm</label>
                    <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Perera & Associates" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Location</label>
                      <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Colombo 03" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Working hours</label>
                      <Input value={workingHours} onChange={e => setWorkingHours(e.target.value)} placeholder="e.g. 9AM – 6PM" className={inputCls} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Years of experience</label>
                    <Input type="number" min="0" max="60" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 8" className={inputCls} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">About you</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell clients about your background and expertise…"
                      className="w-full resize-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                </div>

                {/* Specializations */}
                {availableSpecs.length > 0 && (
                  <div className={sectionCls}>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSpecs.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSpec(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            selectedSpecs.includes(s)
                              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                              : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                <div className={sectionCls}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Experience</p>
                    <button
                      onClick={() => setExperience(prev => [...prev, emptyExp()])}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {experience.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-600">No experience added yet.</p>
                  )}

                  {experience.map((e, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3 relative">
                      <button onClick={() => setExperience(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Company</label>
                          <Input value={e.company} onChange={ev => updateExp(i, "company", ev.target.value)} placeholder="Company name" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Your role</label>
                          <Input value={e.role} onChange={ev => updateExp(i, "role", ev.target.value)} placeholder="e.g. Principal Architect" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Type</label>
                          <select
                            value={e.type}
                            onChange={ev => updateExp(i, "type", ev.target.value)}
                            className="h-9 w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-xs rounded-lg px-3 focus:outline-none"
                          >
                            {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Period</label>
                          <Input value={e.period} onChange={ev => updateExp(i, "period", ev.target.value)} placeholder="Jan 2018 – Present" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
                        <Input value={e.description} onChange={ev => updateExp(i, "description", ev.target.value)} placeholder="Brief description of your responsibilities…" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className={sectionCls}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Education</p>
                    <button
                      onClick={() => setEducation(prev => [...prev, emptyEdu()])}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {education.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-600">No education added yet.</p>
                  )}

                  {education.map((e, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3 relative">
                      <button onClick={() => setEducation(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">School / University</label>
                        <Input value={e.school} onChange={ev => updateEdu(i, "school", ev.target.value)} placeholder="e.g. University of Moratuwa" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Degree / Department</label>
                          <Input value={e.dept} onChange={ev => updateEdu(i, "dept", ev.target.value)} placeholder="e.g. Architecture" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Period</label>
                          <Input value={e.period} onChange={ev => updateEdu(i, "period", ev.target.value)} placeholder="e.g. 2010 – 2015" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio */}
                <div className={sectionCls}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Portfolio</p>
                    <button
                      onClick={() => setPortfolio(prev => [...prev, emptyPortfolio()])}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add item
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-600 -mt-2">Add image URLs from your project work.</p>

                  {portfolio.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-600">No portfolio items yet.</p>
                  )}

                  {portfolio.map((p, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3 relative">
                      <button onClick={() => setPortfolio(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Image URL</label>
                        <Input value={p.url} onChange={ev => updatePortfolio(i, "url", ev.target.value)} placeholder="https://…" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Caption</label>
                          <Input value={p.caption} onChange={ev => updatePortfolio(i, "caption", ev.target.value)} placeholder="e.g. Villa, Colombo" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
                          <Input value={p.category} onChange={ev => updatePortfolio(i, "category", ev.target.value)} placeholder="e.g. Residential" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={saving || !displayName.trim()}
                  className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
                >
                  {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
