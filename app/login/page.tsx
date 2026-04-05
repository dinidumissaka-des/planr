"use client"

import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="8" width="16" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 2L2 8h16L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="7" y="12" width="3" height="4" rx="0.5" fill="currentColor" />
    <rect x="11" y="12" width="3" height="3" rx="0.5" fill="currentColor" />
  </svg>
)

const architectCards = [
  {
    label: "Residential\nArchitect",
    style: "circle",
    pos: { top: "20%", left: "12%" },
    active: false,
  },
  {
    label: "Interior Architect",
    style: "pill",
    pos: { top: "44%", left: "38%" },
    active: true,
  },
  {
    label: "Landscape Architect",
    style: "pill",
    pos: { top: "63%", left: "4%" },
    active: true,
  },
  {
    label: "Urban\nDesign",
    style: "circle",
    pos: { top: "76%", left: "36%" },
    active: false,
  },
]

export default function LoginPage() {
  const router = useRouter()
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="relative w-[52%] h-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1400&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Logo */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
            <Home className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            planr.
          </span>
        </div>

        {/* SVG Dashed Lines */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 520 800"
          preserveAspectRatio="none"
        >
          {/* Residential → Interior */}
          <line
            x1="120" y1="185"
            x2="280" y2="365"
            stroke="white" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity="0.7"
          />
          {/* Interior → Landscape */}
          <line
            x1="280" y1="395"
            x2="130" y2="525"
            stroke="white" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity="0.7"
          />
          {/* Landscape → Urban */}
          <line
            x1="210" y1="540"
            x2="295" y2="635"
            stroke="white" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity="0.7"
          />
        </svg>

        {/* Floating Cards */}
        {architectCards.map((card) =>
          card.style === "circle" ? (
            <div
              key={card.label}
              className="absolute z-20 w-28 h-28 rounded-full bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center shadow-md -translate-x-1/2 -translate-y-1/2"
              style={{ top: card.pos.top, left: card.pos.left }}
            >
              <div className="text-yellow-500 mb-1">
                <BuildingIcon />
              </div>
              <p className="text-xs font-semibold text-center text-gray-800 leading-tight whitespace-pre-line px-2">
                {card.label}
              </p>
            </div>
          ) : (
            <div
              key={card.label}
              className="absolute z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-4 py-2.5 shadow-md -translate-y-1/2"
              style={{ top: card.pos.top, left: card.pos.left }}
            >
              <span className="text-yellow-500">
                <BuildingIcon />
              </span>
              <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                {card.label}
              </span>
            </div>
          )
        )}
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-[#f5f5f5] dark:bg-[#07111E] flex flex-col px-14 py-10">
        {/* Go back */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </Link>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Hello again!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
            Welcome back! Please enter your details. Manage all your consultations
            efficiently. Lets get all set up so you can verify your personal account
            and begin setting up your profile.
          </p>

          <div className="space-y-3 mb-5">
            <Input
              type="email"
              placeholder="Email address"
              className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              className="h-12 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm"
            />
          </div>

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-base rounded-xl mb-4" onClick={() => router.push("/dashboard")}>
            Sign In
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Not a member yet{" "}
            <Link href="/signup" className="font-semibold text-gray-900 dark:text-white hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
