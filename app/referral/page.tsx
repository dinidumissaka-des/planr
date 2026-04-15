"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, Gift, Users, Star } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import { fetchOrCreateReferralCode } from "@/lib/data"

const STEPS = [
  {
    step: "1",
    title: "Share your link",
    desc: "Copy your unique referral link and send it to friends who are planning a build.",
  },
  {
    step: "2",
    title: "Friend signs up",
    desc: "They create a Planr account using your link and subscribe to a plan.",
  },
  {
    step: "3",
    title: "Both get rewarded",
    desc: "You get one month free. Your friend gets one month free. Everyone wins.",
  },
]

export default function ReferralPage() {
  const router = useRouter()
  const [code, setCode]             = useState("")
  const [referralUrl, setReferralUrl] = useState("")
  const [conversions, setConversions] = useState(0)
  const [copied, setCopied]         = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const stats = await fetchOrCreateReferralCode(user.id)
      setCode(stats.code)
      setReferralUrl(`${window.location.origin}/signup?ref=${stats.code}`)
      setConversions(stats.conversions)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Refer a Friend" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-5">

            {/* ── Hero gradient card ── */}
            <div
              className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
              style={{
                backgroundImage: `url('/bg-gradient.png'), linear-gradient(to right, #1A3050 0%, #81B9E9 100%)`,
                backgroundBlendMode: "overlay",
                backgroundSize: "cover, cover",
              }}
            >
              <Gift className="w-8 h-8 mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">Invite a builder, both get rewarded</h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                Share your link — when a friend signs up and subscribes, you both get a month free.
              </p>
            </div>

            {/* ── Referral link card ── */}
            <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Your referral link</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Share this link with anyone planning a construction or renovation project.</p>

              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                  {loading ? "Generating your link…" : referralUrl}
                </div>
                <button
                  onClick={handleCopy}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40 whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Share via */}
              {!loading && (
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Share via</p>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Join me on Planr — the platform for managing architecture and construction projects. Sign up with my link and we both get a reward: ${referralUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-green-600 dark:text-green-400 hover:opacity-70 transition-opacity"
                  >
                    WhatsApp
                  </a>
                  <span className="text-gray-200 dark:text-white/10">·</span>
                  <a
                    href={`mailto:?subject=Join me on Planr&body=${encodeURIComponent(`I've been using Planr to manage my construction projects and thought you'd find it useful.\n\nSign up with my referral link and we both get a month free:\n${referralUrl}`)}`}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:opacity-70 transition-opacity"
                  >
                    Email
                  </a>
                </div>
              )}
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "#81B9E9",
                  backgroundImage: "url('/bg-grain-3.png')",
                  backgroundBlendMode: "screen",
                  backgroundSize: "cover",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-[#07111E]" />
                </div>
                <p className="text-2xl font-bold text-[#07111E]">{conversions}</p>
                <p className="text-sm font-medium text-[#07111E]/70 mt-0.5">Friends joined</p>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "#E1C1A5",
                  backgroundImage: "url('/bg-grain-2.png')",
                  backgroundBlendMode: "screen",
                  backgroundSize: "cover",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-[#07111E]" />
                </div>
                <p className="text-2xl font-bold text-[#07111E]">{conversions}</p>
                <p className="text-sm font-medium text-[#07111E]/70 mt-0.5">Months earned</p>
              </div>
            </div>

            {/* ── How it works ── */}
            <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl border border-gray-100 dark:border-white/8 p-5 shadow-[inset_0_0_1px_0_rgba(7,16,29,0.32)]">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-5">How it works</p>
              <div className="space-y-5">
                {STEPS.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0 text-sm font-bold text-secondary">
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
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
