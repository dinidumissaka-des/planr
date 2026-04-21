"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import {
  fetchOrCreateConsultantProfile,
  updateConsultantProfile,
  type ExperienceEntry,
  type EducationEntry,
} from "@/lib/data"

const ROLES = [
  "Architect",
  "Interior Designer",
  "Landscape Architect",
  "Urban Designer",
  "Structural Engineer",
  "Contractor",
  "Quantity Surveyor",
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

const TOTAL_STEPS = 3

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all ${
            i + 1 === step
              ? "w-6 h-2 bg-gray-900 dark:bg-white"
              : i + 1 < step
              ? "w-2 h-2 bg-gray-900 dark:bg-white opacity-40"
              : "w-2 h-2 bg-gray-200 dark:bg-white/15"
          }`}
        />
      ))}
    </div>
  )
}

function EmptyExperience(): ExperienceEntry {
  return { company: "", role: "", type: "Full-time", period: "", description: "" }
}

function EmptyEducation(): EducationEntry {
  return { school: "", dept: "", period: "" }
}

export default function ConsultantOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  // Step 1 fields
  const [selectedRole, setSelectedRole] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [workingHours, setWorkingHours] = useState("9AM – 6PM")

  // Step 2 fields
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [bio, setBio] = useState("")
  const [years, setYears] = useState("")

  // Step 3 fields
  const [experience, setExperience] = useState<ExperienceEntry[]>([EmptyExperience()])
  const [education, setEducation] = useState<EducationEntry[]>([EmptyEducation()])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setUserId(user.id)
      const first = user.user_metadata?.first_name ?? ""
      const last  = user.user_metadata?.last_name  ?? ""
      const name  = first && last ? `${first} ${last}` : (user.email ?? "")
      await fetchOrCreateConsultantProfile(user.id, name)
    }
    load()
  }, [router])

  const availableSpecs = selectedRole ? (SPECIALIZATIONS_BY_ROLE[selectedRole] ?? []) : []

  function toggleSpec(s: string) {
    setSelectedSpecs(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  // Experience helpers
  function updateExp(i: number, field: keyof ExperienceEntry, val: string) {
    setExperience(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }
  function addExp() { setExperience(prev => [...prev, EmptyExperience()]) }
  function removeExp(i: number) { setExperience(prev => prev.filter((_, idx) => idx !== i)) }

  // Education helpers
  function updateEdu(i: number, field: keyof EducationEntry, val: string) {
    setEducation(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }
  function addEdu() { setEducation(prev => [...prev, EmptyEducation()]) }
  function removeEdu(i: number) { setEducation(prev => prev.filter((_, idx) => idx !== i)) }

  function step1Valid() { return !!selectedRole && !!company.trim() && !!location.trim() }
  function step2Valid() { return selectedSpecs.length > 0 && !!bio.trim() }

  async function handleFinish() {
    if (!userId) return
    setSaving(true)
    setError("")

    const cleanExp = experience.filter(e => e.company.trim() && e.role.trim())
    const cleanEdu = education.filter(e => e.school.trim() && e.dept.trim())

    await updateConsultantProfile(userId, {
      role: selectedRole,
      category: ROLE_CATEGORIES[selectedRole] ?? selectedRole,
      company: company.trim(),
      location: location.trim(),
      working_hours: workingHours.trim() || "9AM – 6PM",
      specializations: selectedSpecs,
      specialization: selectedSpecs[0] ?? selectedRole,
      bio: bio.trim(),
      years_experience: years ? parseInt(years, 10) : null,
      experience: cleanExp,
      education: cleanEdu,
      is_visible: true,
      profile_completed: true,
    })

    const supabase = createClient()
    await supabase.auth.updateUser({
      data: { consultant_profile_completed: true },
    })

    setSaving(false)
    router.push("/consultant/dashboard")
    router.refresh()
  }

  const inputCls = "h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Left panel */}
      <div
        className="relative hidden md:flex w-[30%] h-full overflow-hidden flex-col justify-between p-8"
        style={{ background: "linear-gradient(to bottom right, #1A3050 0%, #81B9E9 100%)" }}
      >
        <div className="absolute inset-0 bg-cover bg-center mix-blend-screen" style={{ backgroundImage: "url('/pattern-portrait-2.png')" }} />
        <div className="relative z-10">
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7" />
        </div>
        <div className="flex-1" />
        <div className="relative z-10">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Step {step} of {TOTAL_STEPS}</p>
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            {step === 1 && "Tell us about your practice."}
            {step === 2 && "What are your areas of expertise?"}
            {step === 3 && "Your background & experience."}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {step === 1 && "This is what clients will see first when browsing for a consultant."}
            {step === 2 && "Clients search by specialty — choose what best describes your work."}
            {step === 3 && "Add your experience and education so clients can trust your credentials. You can skip for now and add later."}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto py-8">

          <StepDots step={step} />

          {/* ── Step 1: Basic info ── */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your professional profile</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">This appears on your public profile visible to clients.</p>

              <div className="space-y-4">

                {/* Role selection */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Your role</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setSelectedRole(r); setSelectedSpecs([]) }}
                        className={`h-11 px-4 rounded-xl text-sm font-medium text-left border transition-all ${
                          selectedRole === r
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                            : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Company / Firm name</label>
                  <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Perera & Associates" className={inputCls} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Location</label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Colombo 03, Sri Lanka" className={inputCls} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Working hours</label>
                  <Input value={workingHours} onChange={e => setWorkingHours(e.target.value)} placeholder="e.g. 9AM – 6PM" className={inputCls} />
                </div>
              </div>

              <button
                onClick={() => step1Valid() && setStep(2)}
                disabled={!step1Valid()}
                className="w-full h-12 mt-8 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step 2: Expertise ── */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your expertise</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">Select all that apply — clients filter by these.</p>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecs.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpec(s)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedSpecs.includes(s)
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                            : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30"
                        }`}
                      >
                        {selectedSpecs.includes(s) && <Check className="w-3 h-3" />}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Years of experience</label>
                  <Input type="number" min="0" max="60" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 8" className={inputCls} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">About you</label>
                  <textarea
                    rows={5}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your background and what makes your approach unique…"
                    className="w-full resize-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={() => step2Valid() && setStep(3)}
                  disabled={!step2Valid()}
                  className="flex-[2] h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Experience & Education ── */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your background</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">Add your work history and education. You can skip and fill this in later from your profile.</p>

              <div className="space-y-6">

                {/* Experience entries */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Experience</p>
                    <button onClick={addExp} className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {experience.map((e, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3 relative">
                        {experience.length > 1 && (
                          <button onClick={() => removeExp(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Company</label>
                            <Input value={e.company} onChange={ev => updateExp(i, "company", ev.target.value)} placeholder="Company name" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Your role</label>
                            <Input value={e.role} onChange={ev => updateExp(i, "role", ev.target.value)} placeholder="e.g. Senior Architect" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
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
                            <Input value={e.period} onChange={ev => updateExp(i, "period", ev.target.value)} placeholder="e.g. Jan 2018 – Present" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Description (optional)</label>
                          <Input value={e.description} onChange={ev => updateExp(i, "description", ev.target.value)} placeholder="Brief description of your work…" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education entries */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Education</p>
                    <button onClick={addEdu} className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {education.map((e, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3 relative">
                        {education.length > 1 && (
                          <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">School / University</label>
                          <Input value={e.school} onChange={ev => updateEdu(i, "school", ev.target.value)} placeholder="e.g. University of Moratuwa" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Degree / Department</label>
                            <Input value={e.dept} onChange={ev => updateEdu(i, "dept", ev.target.value)} placeholder="e.g. Architecture" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Period</label>
                            <Input value={e.period} onChange={ev => updateEdu(i, "period", ev.target.value)} placeholder="e.g. 2010 – 2015" className="h-9 text-xs bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 h-12 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-[2] h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors"
                >
                  {saving ? "Saving…" : "Complete profile"}
                </button>
              </div>

              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full mt-3 h-10 text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
