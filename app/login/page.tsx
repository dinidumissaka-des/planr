"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DEMO_EMAIL = "demo@planr.app"
const DEMO_PASSWORD = "demo1234"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="relative hidden md:flex w-[30%] h-full overflow-hidden flex-col justify-between p-8"
        style={{
          backgroundColor: '#1A3050',
          backgroundImage: "url('/pattern-portrait-1.png'), linear-gradient(to bottom right, #1A3050 0%, #81B9E9 100%)",
          backgroundBlendMode: "screen, normal",
          backgroundSize: "cover, cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">
            Connect with expert architects & designers
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Book consultations, get answers to your building questions, and manage your projects — all in one place.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 relative overflow-hidden overflow-y-auto">

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors block mb-1">Go back</Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your Planr account to continue.</p>
          </div>

          {/* Demo credentials banner */}
          <button
            onClick={fillDemo}
            className="w-full mb-5 flex items-center justify-between px-4 py-3 rounded-xl border border-secondary/40 bg-secondary/8 dark:bg-secondary/10 hover:bg-secondary/15 dark:hover:bg-secondary/15 transition-colors group"
          >
            <div className="text-left">
              <p className="text-xs font-bold text-primary dark:text-secondary mb-0.5">Try the demo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{DEMO_EMAIL} · {DEMO_PASSWORD}</p>
            </div>
            <span className="text-xs font-semibold text-secondary bg-secondary/15 px-2.5 py-1 rounded-lg group-hover:bg-secondary/25 transition-colors whitespace-nowrap">
              Fill in →
            </span>
          </button>

          <div className="space-y-3 mb-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Remember me</Label>
            </div>
            <Link href="#" className="text-sm text-secondary font-medium hover:underline">Forgot password?</Link>
          </div>

          <Button
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl mb-4"
            onClick={() => router.push("/dashboard")}
          >
            Sign In
          </Button>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <button className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-gray-900 dark:text-white hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
