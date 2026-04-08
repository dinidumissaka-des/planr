import { DollarSign, Wallet, TrendingUp, Gem } from "lucide-react"

const options = [
  { value: "under_50k", label: "Under $50k", description: "Smaller scope projects", icon: DollarSign },
  { value: "50k_150k", label: "$50k – $150k", description: "Mid-range budget", icon: Wallet },
  { value: "150k_300k", label: "$150k – $300k", description: "Larger renovations", icon: TrendingUp },
  { value: "300k_plus", label: "$300k+", description: "Premium or large builds", icon: Gem },
]

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function StepBudget({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">What's your budget range?</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This helps us match you with the right consultants.</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ value: v, label, description, icon: Icon }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`p-4 rounded-xl border text-left transition-all ${
              value === v
                ? "border-gray-900 dark:border-white bg-gray-900/5 dark:bg-white/10"
                : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <Icon className={`w-5 h-5 mb-2 ${value === v ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`} />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
