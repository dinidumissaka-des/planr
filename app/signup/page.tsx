"use client"

import { Eye, EyeOff, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

function ConfirmModal({ tab, onConfirm, onCancel }: { tab: "customer" | "architect"; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end md:items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0D1B2E] w-full md:max-w-sm rounded-t-3xl md:rounded-2xl p-7 shadow-2xl">

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-secondary/15 dark:bg-secondary/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-secondary" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Create your account?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6">
          You're signing up as a <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{tab}</span>. You can always change your role later from your profile settings.
        </p>

        {/* Actions */}
        <button
          onClick={onConfirm}
          className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl mb-3 transition-colors"
        >
          Yes, create account
        </button>
        <button
          onClick={onCancel}
          className="w-full h-12 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"customer" | "architect">("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="relative hidden md:flex w-[30%] h-full overflow-hidden flex-col justify-between p-8"
        style={{
          backgroundColor: '#1A3050',
          backgroundImage: "url('/pattern-portrait-2.png'), linear-gradient(to bottom right, #1A3050 0%, #81B9E9 100%)",
          backgroundBlendMode: "screen, normal",
          backgroundSize: "cover, cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7" />
        </div>
        <div className="flex-1" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">
            You can dream, create, design and build it
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Join thousands of homeowners and professionals managing their projects on Planr.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col px-6 md:px-14 py-8 md:py-10 overflow-y-auto relative">

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-8">
          <div className="mb-7">
            <Link href="/login" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors block mb-1">Go back</Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">Create your account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get started with Planr — it only takes a minute.</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
            {(["customer", "architect"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                  tab === t
                    ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <Input placeholder="First name" className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
              <Input placeholder="Last name" className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
            </div>
            <Input type="email" placeholder="Email address" className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
            <Input type="tel" placeholder="Mobile number" className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl" />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
                className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl pr-11"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-6">
            <Checkbox id="privacy" className="mt-0.5" />
            <Label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed">
              I agree to the{" "}
              <Link href="#" className="font-semibold text-gray-900 dark:text-white hover:underline">Privacy Policy</Link>
              {" "}and{" "}
              <Link href="#" className="font-semibold text-gray-900 dark:text-white hover:underline">Terms of Use</Link>
            </Label>
          </div>

          <Button
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl mb-4"
            onClick={() => setShowModal(true)}
          >
            Create Account
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
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-900 dark:text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showModal && (
        <ConfirmModal
          tab={tab}
          onConfirm={() => router.push("/ask")}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
