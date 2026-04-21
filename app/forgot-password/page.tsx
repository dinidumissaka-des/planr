"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleReset() {
    if (!email) return
    setError("")
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`)
    }
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
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

          <div className="mb-8">
            <Link href="/login" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors block mb-1">Go back</Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot password?</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your account email and we'll send a reset link.</p>
          </div>

          <div className="mb-6">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleReset()}
              className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <Button
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </div>
      </div>
    </div>
  )
}
