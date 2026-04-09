"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import OnboardingProgress from "./OnboardingProgress"
import OnboardingActions from "./OnboardingActions"
import StepProjectType from "./StepProjectType"
import StepBudget from "./StepBudget"
import StepTimeline from "./StepTimeline"
import StepLocation from "./StepLocation"

type OnboardingAnswers = {
  project_type: string
  budget_range: string
  timeline: string
  location: string
}

const TOTAL_STEPS = 4

export default function OnboardingShell() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    project_type: "",
    budget_range: "",
    timeline: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function setAnswer(key: keyof OnboardingAnswers, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function canAdvance() {
    if (step === 1) return !!answers.project_type
    if (step === 2) return !!answers.budget_range
    if (step === 3) return !!answers.timeline
    if (step === 4) return !!answers.location.trim()
    return false
  }

  async function handleFinish() {
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        project_type: answers.project_type,
        budget_range: answers.budget_range,
        timeline: answers.timeline,
        location: answers.location.trim(),
        onboarding_completed: true,
      },
    })
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Left Panel */}
      <div
        className="relative hidden md:flex w-[30%] h-full overflow-hidden flex-col justify-between p-8"
        style={{
          background: "linear-gradient(to bottom right, #1A3050 0%, #81B9E9 100%)",
        }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-60" style={{ backgroundImage: "url('/pattern-portrait-2.png')" }} />
        <div className="relative z-10">
          <img src="/planr-logo-light.svg" alt="Planr" className="h-7" />
        </div>
        <div className="flex-1" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-3">
            Let's personalise your experience
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            A few quick questions so we can match you with the right consultants.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white dark:bg-[#07111E] flex flex-col overflow-hidden">

        {/* Progress — pinned to top on mobile */}
        <div className="px-6 md:px-14 pt-8 md:pt-10 max-w-sm w-full mx-auto w-full">
          <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />
          <div className="mt-2 mb-0 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Step {step} of {TOTAL_STEPS}
          </div>
        </div>

        {/* Content — scrollable middle */}
        <div className="flex-1 overflow-y-auto px-6 md:px-14 py-6 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            {step === 1 && (
              <StepProjectType value={answers.project_type} onChange={v => setAnswer("project_type", v)} />
            )}
            {step === 2 && (
              <StepBudget value={answers.budget_range} onChange={v => setAnswer("budget_range", v)} />
            )}
            {step === 3 && (
              <StepTimeline value={answers.timeline} onChange={v => setAnswer("timeline", v)} />
            )}
            {step === 4 && (
              <StepLocation value={answers.location} onChange={v => setAnswer("location", v)} />
            )}
            {error && (
              <p className="text-sm text-red-500 mt-4">{error}</p>
            )}
          </div>
        </div>

        {/* Actions — pinned to bottom on mobile */}
        <div className="px-6 md:px-14 pb-8 md:pb-10 max-w-sm w-full mx-auto w-full">
          <OnboardingActions
            step={step}
            totalSteps={TOTAL_STEPS}
            canAdvance={canAdvance()}
            loading={loading}
            onBack={() => setStep(s => s - 1)}
            onNext={() => setStep(s => s + 1)}
            onFinish={handleFinish}
          />
        </div>

      </div>
    </div>
  )
}
