"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { applyReferralCode } from "@/lib/data"

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<"client" | "consultant">("client")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) localStorage.setItem("planr_ref", ref)
  }, [searchParams])

  async function handleSignUp() {
    if (!firstName || !lastName) { setError("Please enter your first and last name"); return }
    if (!email) { setError("Please enter your email address"); return }
    if (!password) { setError("Please enter a password"); return }
    if (!confirm) { setError("Please confirm your password"); return }
    if (password !== confirm) { setError("Passwords do not match"); return }
    setError("")
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone, role },
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      // Apply referral code if present
      const ref = searchParams.get("ref") ?? localStorage.getItem("planr_ref")
      if (ref) {
        const supabase = createClient()
        const { data: { user: newUser } } = await supabase.auth.getUser()
        if (newUser) await applyReferralCode(ref, newUser.id)
        localStorage.removeItem("planr_ref")
      }
      router.push(`/signup/verify?email=${encodeURIComponent(email)}&role=${role}`)
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
        <div className="absolute inset-0 bg-cover bg-center mix-blend-screen" style={{ backgroundImage: "url('/pattern-portrait-2.png')" }} />

        {/* Logo */}
        <div className="relative z-10">
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7" />
        </div>

        <div className="flex-1" />

        {/* Bottom text */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">
            Great spaces don't happen by accident.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Connect with certified architects, track every milestone, and get expert answers — all in one place.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 overflow-y-auto relative">

        {/* Form */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-8">
          <div className="mb-7">
            <Link href="/login" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors block mb-1">Go back</Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">Create your account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get started with Planr — it only takes a minute.</p>
          </div>

          {/* Role toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${
                role === "client"
                  ? "bg-white dark:bg-[#1A3050] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              I&apos;m a client
            </button>
            <button
              type="button"
              onClick={() => setRole("consultant")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${
                role === "consultant"
                  ? "bg-white dark:bg-[#1A3050] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              I&apos;m a consultant
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <Input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
              <Input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
            </div>
            <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
            <Input type="tel" placeholder="Mobile number" value={phone} onChange={e => setPhone(e.target.value)} className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
                placeholder="Confirm password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl pr-11"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          <Button
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl mb-4"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </Button>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <button disabled className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-900 dark:text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
