"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Star, MapPin, Briefcase, GraduationCap, Award, ArrowLeft, CalendarCheck } from "lucide-react"
import { PortfolioGallery } from "@/components/ui/portfolio-gallery"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { AvatarInitials } from "@/components/ui/avatar-initials"
import { fetchConsultantByUserId, type ConsultantProfile } from "@/lib/data"
import Link from "next/link"

export default function ConsultantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultantByUserId(id).then(c => {
      setConsultant(c)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader title="Consultant Profile" />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-600 dark:border-white/20 dark:border-t-white animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (!consultant) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader title="Consultant Profile" />
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Consultant not found</p>
            <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

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

            {/* Hero card */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
              <AvatarInitials
                initials={consultant.display_name.split(" ").map(n => n[0]).join("")}
                size="w-20 h-20"
                textSize="text-xl"
                rounded="rounded-2xl"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{consultant.display_name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {consultant.role ?? "Consultant"}{consultant.company ? ` · ${consultant.company}` : ""}
                    </p>
                    {consultant.rating > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(consultant.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{consultant.rating}</span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">({consultant.review_count} reviews)</span>
                      </div>
                    )}
                    {consultant.location && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5" /> {consultant.location}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/bookings"
                    className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Consultation
                  </Link>
                </div>

                {consultant.working_hours && (
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                      🕐 {consultant.working_hours}
                    </span>
                    {consultant.years_experience != null && (
                      <span className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                        💼 {consultant.years_experience} yrs experience
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            {consultant.bio && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">About</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{consultant.bio}</p>
              </div>
            )}

            {/* Specializations */}
            {consultant.specializations?.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {consultant.specializations.map(s => (
                    <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary/15 dark:bg-secondary/10 text-primary dark:text-secondary">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {consultant.experience?.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Experience
                </p>
                <div className="space-y-5">
                  {consultant.experience.map((e, i) => (
                    <div key={i} className="border-l-2 border-secondary/30 pl-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{e.company}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{e.role} · <span className="text-secondary">{e.type}</span></p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{e.period}</p>
                      {e.description && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{e.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {consultant.education?.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </p>
                {consultant.education.map((e, i) => (
                  <div key={i} className="border-l-2 border-gray-200 dark:border-white/10 pl-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{e.school}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{e.dept}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{e.period}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Portfolio */}
            {consultant.portfolio?.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <PortfolioGallery portfolio={consultant.portfolio} />
              </div>
            )}

            {/* Reviews */}
            {consultant.reviews?.length > 0 && (
              <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Client Reviews
                </p>
                <div className="space-y-3">
                  {consultant.reviews.map((r, i) => (
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
