"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Plus, Trash2, Loader2, Clock, X } from "lucide-react"
import { ConsultantSidebar } from "@/components/consultant-sidebar"
import { AppHeader } from "@/components/app-header"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import {
  fetchOrCreateConsultantProfile, updateConsultantProfile,
  fetchCredentials, submitCredential, deleteCredential,
  type ConsultantProfile, type ConsultantCredential,
} from "@/lib/data"

const CREDENTIAL_TYPES: { value: ConsultantCredential["credential_type"]; label: string }[] = [
  { value: "license",       label: "Professional License" },
  { value: "certification", label: "Certification" },
  { value: "degree",        label: "Degree / Qualification" },
  { value: "membership",    label: "Professional Membership" },
]

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
  const [userId, setUserId]       = useState("")

  // Credentials
  const [credentials, setCredentials]   = useState<ConsultantCredential[]>([])
  const [showCredForm, setShowCredForm] = useState(false)
  const [credType, setCredType]         = useState<ConsultantCredential["credential_type"]>("license")
  const [credTitle, setCredTitle]       = useState("")
  const [credIssuer, setCredIssuer]     = useState("")
  const [credYear, setCredYear]         = useState("")
  const [credFile, setCredFile]         = useState<File | null>(null)
  const [submittingCred, setSubmittingCred] = useState(false)
  const credFileRef = useRef<HTMLInputElement>(null)

  const isVerified = credentials.some(c => c.status === "verified")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      setEmail(user.email ?? "")
      const first = user.user_metadata?.first_name ?? ""
      const last  = user.user_metadata?.last_name  ?? ""
      const name  = first && last ? `${first} ${last}` : (user.email ?? "")

      setUserId(user.id)
      const [p, creds] = await Promise.all([
        fetchOrCreateConsultantProfile(user.id, name),
        fetchCredentials(user.id),
      ])
      if (p) {
        setProfile(p)
        setDisplayName(p.display_name)
        setSpecialization(p.specialization)
        setBio(p.bio ?? "")
        setYears(p.years_experience != null ? String(p.years_experience) : "")
      }
      setCredentials(creds)
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

  async function handleSubmitCredential() {
    if (!credTitle.trim() || !credIssuer.trim() || !userId) return
    setSubmittingCred(true)
    const cred = await submitCredential(userId, {
      credential_type: credType,
      title: credTitle.trim(),
      issuing_body: credIssuer.trim(),
      issued_year: credYear ? parseInt(credYear, 10) : null,
      file: credFile,
    })
    if (cred) setCredentials(prev => [cred, ...prev])
    setSubmittingCred(false)
    setShowCredForm(false)
    setCredTitle("")
    setCredIssuer("")
    setCredYear("")
    setCredFile(null)
  }

  async function handleDeleteCredential(cred: ConsultantCredential) {
    setCredentials(prev => prev.filter(c => c.id !== cred.id))
    await deleteCredential(cred)
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
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(129,185,233,0.18)", color: "#1A3050" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#81B9E9]" />
                    Consultant
                  </span>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
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

            {/* Credentials & Verification */}
            {!loading && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5 flex flex-col gap-4 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Credentials &amp; Verification
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Submit licenses or certifications to earn a Verified badge</p>
                  </div>
                  {!showCredForm && (
                    <button
                      onClick={() => setShowCredForm(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  )}
                </div>

                {/* Add credential form */}
                {showCredForm && (
                  <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 flex flex-col gap-3 border border-gray-100 dark:border-white/8">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">New credential</p>
                      <button onClick={() => setShowCredForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Type</label>
                      <select
                        value={credType}
                        onChange={e => setCredType(e.target.value as ConsultantCredential["credential_type"])}
                        className="h-10 w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      >
                        {CREDENTIAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Title / Name *</label>
                      <Input
                        value={credTitle}
                        onChange={e => setCredTitle(e.target.value)}
                        placeholder="e.g. Sri Lanka Institute of Architects"
                        className="h-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Issuing body *</label>
                      <Input
                        value={credIssuer}
                        onChange={e => setCredIssuer(e.target.value)}
                        placeholder="e.g. SLIA, IESL, University of Moratuwa"
                        className="h-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl"
                      />
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Year issued</label>
                        <Input
                          type="number"
                          min="1970"
                          max={new Date().getFullYear()}
                          value={credYear}
                          onChange={e => setCredYear(e.target.value)}
                          placeholder="e.g. 2018"
                          className="h-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white text-sm rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Supporting doc</label>
                        <input ref={credFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setCredFile(e.target.files?.[0] ?? null)} className="hidden" />
                        <button
                          onClick={() => credFileRef.current?.click()}
                          className="h-10 border border-dashed border-gray-300 dark:border-white/15 rounded-xl text-xs text-gray-400 dark:text-gray-500 hover:border-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-3 truncate"
                        >
                          {credFile ? credFile.name : "Upload PDF / image"}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitCredential}
                      disabled={submittingCred || !credTitle.trim() || !credIssuer.trim()}
                      className="mt-1 w-full h-10 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {submittingCred ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit for review"}
                    </button>
                  </div>
                )}

                {/* Credential list */}
                {credentials.length === 0 && !showCredForm ? (
                  <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-3">No credentials submitted yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {credentials.map(cred => (
                      <div key={cred.id} className="group flex items-start gap-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl px-3.5 py-3 border border-gray-100 dark:border-white/8">
                        <ShieldCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cred.status === "verified" ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{cred.title}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {CREDENTIAL_TYPES.find(t => t.value === cred.credential_type)?.label} · {cred.issuing_body}{cred.issued_year ? ` · ${cred.issued_year}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            cred.status === "verified"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : cred.status === "rejected"
                              ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}>
                            {cred.status === "verified" ? "Verified" : cred.status === "rejected" ? "Rejected" : "Pending"}
                          </span>
                          {cred.status !== "verified" && (
                            <button
                              onClick={() => handleDeleteCredential(cred)}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {credentials.some(c => c.status === "pending") && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3.5 py-2.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    Credentials are reviewed by the Planr team within 2–3 business days.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
