import { Button } from "@/components/ui/button"

interface Props {
  step: number
  totalSteps: number
  canAdvance: boolean
  loading: boolean
  onBack: () => void
  onNext: () => void
  onFinish: () => void
}

export default function OnboardingActions({ step, totalSteps, canAdvance, loading, onBack, onNext, onFinish }: Props) {
  const isLast = step === totalSteps

  return (
    <div className="flex gap-3 mt-8">
      {step > 1 && (
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
      )}
      <Button
        className="flex-1 h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl"
        onClick={isLast ? onFinish : onNext}
        disabled={!canAdvance || loading}
      >
        {loading ? "Saving…" : isLast ? "Finish Setup" : "Continue"}
      </Button>
    </div>
  )
}
