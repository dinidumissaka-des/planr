"use client"

import { use } from "react"
import { notFound, useRouter } from "next/navigation"
import { Star, MapPin, Briefcase, GraduationCap, Award, ArrowLeft, CalendarCheck } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { architects } from "@/lib/architects"
import Link from "next/link"
import { AvatarInitials } from "@/components/ui/avatar-initials"

export default function ConsultantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const architect = architects.find(a => a.id === Number(id))

  if (!architect) notFound()

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
                initials={architect.name.split(" ").map(n => n[0]).join("")}
                size="w-20 h-20"
                textSize="text-xl"
                rounded="rounded-2xl"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{architect.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{architect.role} · {architect.company}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(architect.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{architect.rating}</span>
                      <span className="text-sm text-gray-400 dark:text-gray-500">({architect.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" /> {architect.location}
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
                    📅 Available from {architect.available}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                    🕐 {architect.hours}
                  </span>
                </div>
              </div>
            </div>

            {/* ── About ── */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">About</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{architect.about}</p>
            </div>

            {/* ── Specializations ── */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {architect.specializations.map(s => (
                  <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary/15 dark:bg-secondary/10 text-primary dark:text-secondary">{s}</span>
                ))}
              </div>
            </div>

            {/* ── Experience ── */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Experience
              </p>
              <div className="space-y-5">
                {architect.experience.map((e, i) => (
                  <div key={i} className="border-l-2 border-secondary/30 pl-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{e.company}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{e.role} · <span className="text-secondary">{e.type}</span></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{e.period}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Education ── */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </p>
              {architect.education.map((e, i) => (
                <div key={i} className="border-l-2 border-gray-200 dark:border-white/10 pl-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{e.school}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{e.dept}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{e.period}</p>
                </div>
              ))}
            </div>

            {/* ── Reviews ── */}
            <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Client Reviews
              </p>
              <div className="space-y-3">
                {architect.reviews.map((r, i) => (
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

          </div>
        </div>
      </div>
    </div>
  )
}
