"use client"

import { use, useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { Star, MapPin, Briefcase, GraduationCap, Award, ArrowLeft, CalendarCheck, ShieldCheck } from "lucide-react"
import { PortfolioGallery } from "@/components/ui/portfolio-gallery"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { architects } from "@/lib/architects"
import { architectToDisplay, fetchConsultantById, type DisplayConsultant } from "@/lib/data"
import Link from "next/link"
import { AvatarInitials } from "@/components/ui/avatar-initials"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ConsultantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const isUUID = UUID_RE.test(id)
  const staticArchitect = isUUID ? null : architects.find(a => a.id === Number(id))
  const initialConsultant = staticArchitect ? architectToDisplay(staticArchitect) : null

  const [consultant, setConsultant] = useState<DisplayConsultant | null>(initialConsultant)
  const [loading, setLoading] = useState(isUUID)

  useEffect(() => {
    if (!isUUID) return
    fetchConsultantById(id).then(data => {
      setConsultant(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, isUUID])

  if (!loading && !consultant) notFound()

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader title="Consultant Profile" />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-white/20 border-t-gray-900 dark:border-t-white animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  const c = consultant!

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Consultant Profile" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="max-w-3xl mx-auto flex flex-col gap-5">

            {/* ── Hero card ── */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
              <AvatarInitials
                initials={c.name.split(" ").map((n: string) => n[0]).join("")}
                size="w-20 h-20"
                textSize="text-xl"
                rounded="rounded-2xl"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{c.name}</h1>
                      {c.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {c.role}{c.company ? ` · ${c.company}` : ""}
                    </p>
                    {c.rating > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(c.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{c.rating}</span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">({c.reviewCount} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" /> {c.location}
                    </div>
                  </div>

                  <Link
                    href="/bookings"
                    className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Consultation
                  </Link>
                </div>

                <div className="flex items-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                    📅 {c.available}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                    🕐 {c.hours}
                  </span>
                  {c.rate > 0 && (
                    <span className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                      💰 ${c.rate}/hr
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── About ── */}
            {c.about && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">About</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{c.about}</p>
              </div>
            )}

            {/* ── Specializations ── */}
            {c.specializations.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {c.specializations.map(s => (
                    <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary/15 dark:bg-secondary/10 text-primary dark:text-secondary">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Experience ── */}
            {c.experience.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Experience
                </p>
                <div className="space-y-5">
                  {c.experience.map((e, i) => (
                    <div key={i} className="border-l-2 border-secondary/30 pl-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{e.company}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{e.role} · <span className="text-secondary">{e.type}</span></p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{e.period}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Education ── */}
            {c.education.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </p>
                {c.education.map((e, i) => (
                  <div key={i} className="border-l-2 border-gray-200 dark:border-white/10 pl-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{e.school}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{e.dept}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{e.period}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Portfolio ── */}
            {c.portfolio?.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <PortfolioGallery portfolio={c.portfolio} />
              </div>
            )}

            {/* ── Reviews ── */}
            {c.reviews.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Client Reviews
                </p>
                <div className="space-y-3">
                  {c.reviews.map((r, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.name}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
