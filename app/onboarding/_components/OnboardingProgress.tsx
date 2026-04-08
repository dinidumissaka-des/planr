interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
}

export default function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep
        return (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              isCompleted
                ? "bg-gray-900 dark:bg-white"
                : isActive
                ? "bg-gray-900 dark:bg-white"
                : "bg-gray-200 dark:bg-white/10"
            }`}
          />
        )
      })}
    </div>
  )
}
