"use client"

import { Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase"

function SentContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? "your email"
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    setResent(true)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="relative hidden md:flex w-[30%] h-full overflow-hidden flex-col justify-between p-8"
        style={{
          background: 'linear-gradient(to bottom right, #1A3050 0%, #81B9E9 100%)',
        }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-cover bg-center mix-blend-screen" style={{ backgroundImage: "url('/pattern-portrait-1.png')" }} />

        <div className="relative z-10">
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">
            We'll get you back in
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Check your inbox for the reset link and follow the instructions.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto text-center">

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 dark:bg-secondary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-secondary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset link sent</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1">
            We sent a password reset link to
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-8">{email}</p>

          <p className="text-xs text-gray-400 dark:text-gray-600 leading-relaxed mb-8">
            The link expires in 1 hour. If you don't see it, check your spam folder.
          </p>

          <Link
            href="/login"
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center mb-3"
          >
            Back to sign in
          </Link>

          <button
            onClick={handleResend}
            disabled={loading || resent}
            className="w-full h-12 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {resent ? "Resent!" : loading ? "Resending…" : "Resend email"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordSentPage() {
  return (
    <Suspense>
      <SentContent />
    </Suspense>
  )
}
