"use client"

import { ArrowLeft, Home, HelpCircle, MessageSquare, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"customer" | "architect">("customer")

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Left Panel ── */}
      <div
        className="relative w-[52%] h-full overflow-hidden"
        style={{ background: "linear-gradient(160deg, #c8cfc0 0%, #b8bfaa 40%, #d4c9a8 100%)" }}
      >
        {/* Logo */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
            <Home className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">planr.</span>
        </div>

        {/* Dashed oval SVG */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 520 800"
          preserveAspectRatio="none"
        >
          <ellipse
            cx="270" cy="370"
            rx="195" ry="240"
            fill="none"
            stroke="black"
            strokeWidth="1.5"
            strokeDasharray="7 6"
            strokeOpacity="0.35"
          />
        </svg>

        {/* Floating icon circles */}
        {/* Question mark — top left */}
        <div className="absolute z-20 w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center shadow-lg"
          style={{ top: "24%", left: "8%" }}>
          <HelpCircle className="w-8 h-8 text-white" />
        </div>

        {/* Chat bubble — top right */}
        <div className="absolute z-20 rounded-full flex items-center justify-center shadow-lg"
          style={{ top: "10%", left: "44%", width: "130px", height: "130px", background: "rgba(200,220,215,0.85)" }}>
          <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-blue-500" fill="#3b82f6" />
          </div>
        </div>

        {/* Video camera — bottom center */}
        <div className="absolute z-20 rounded-full flex items-center justify-center shadow-lg"
          style={{ top: "64%", left: "34%", width: "110px", height: "110px", background: "rgba(200,220,215,0.85)" }}>
          <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center">
            <Video className="w-8 h-8 text-red-500" fill="#ef4444" />
          </div>
        </div>

        {/* Person photo */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-15 w-72 h-[68%]"
          style={{ zIndex: 15 }}
        >
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
            alt="Person"
            className="w-full h-full object-cover object-top"
            style={{ maskImage: "linear-gradient(to top, transparent 0%, black 25%)", WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 25%)" }}
          />
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-8 left-6 z-20">
          <p className="text-3xl font-bold text-gray-900 leading-tight">
            You can dream,<br />create, design,<br />and build It
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-[#f5f5f5] dark:bg-[#07111E] flex flex-col px-14 py-10 overflow-y-auto">
        {/* Go back */}
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </Link>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            You are few clicks away from<br />creating your account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-7">
            Manage all your consultations efficiently. Lets get all set up so you
            can verify your personal account and begin setting up your profile.
          </p>

          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setTab("customer")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                tab === "customer"
                  ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white -mb-px"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setTab("architect")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                tab === "architect"
                  ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white -mb-px"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              Architect
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-3 mb-5">
            <div className="flex gap-3">
              <Input placeholder="First name" className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm" />
              <Input placeholder="Last Name" className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm" />
            </div>
            <Input type="email" placeholder="Email address" className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm" />
            <Input type="tel" placeholder="Mobile Number" className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm" />
            <Input type="password" placeholder="Password" className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm" />
            <Input type="password" placeholder="Re-type password" className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm" />
          </div>

          {/* Privacy checkbox */}
          <div className="flex items-center gap-2 mb-8">
            <Checkbox id="privacy" />
            <Label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              I agree all{" "}
              <Link href="#" className="font-semibold text-gray-900 dark:text-white hover:underline">
                Privacy Policy
              </Link>{" "}
              and Fees
            </Label>
          </div>

          <Button
            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-base rounded-xl mb-4"
            onClick={() => router.push("/ask")}
          >
            Sign Up
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have a account{" "}
            <Link href="/login" className="font-semibold text-gray-900 dark:text-white hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
