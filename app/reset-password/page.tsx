"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    if (!password) return
    if (password !== confirm) { setError("Passwords do not match"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    setError("")
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
      router.refresh()
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
            Choose a strong new password
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Make it something memorable but hard to guess.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Set new password</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter and confirm your new password below.</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl pr-11"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleReset()}
                className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl pr-11"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <Button
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Updating…" : "Update password"}
          </Button>
        </div>
      </div>
    </div>
  )
}
