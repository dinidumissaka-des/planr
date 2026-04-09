import { DollarSign, Wallet, TrendingUp, Gem } from "lucide-react"

const options = [
  { value: "under_50k",  label: "Under $50k",      description: "Smaller scope projects",  icon: DollarSign, image: "/onboarding2.webp" },
  { value: "50k_150k",   label: "$50k – $150k",    description: "Mid-range budget",         icon: Wallet,     image: "/onboarding3.webp" },
  { value: "150k_300k",  label: "$150k – $300k",   description: "Larger renovations",       icon: TrendingUp, image: "/onboarding1.webp" },
  { value: "300k_plus",  label: "$300k+",           description: "Premium or large builds",  icon: Gem,        image: "/onboarding4.webp" },
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
        {options.map(({ value: v, label, description, icon: Icon, image }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`relative rounded-xl border text-left transition-all overflow-hidden ${
              value === v
                ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white"
                : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
            <div className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-50" style={{ backgroundImage: "url('/bg-grain-1.png')" }} />
            <div className={`absolute inset-0 transition-all ${value === v ? "bg-white/40 dark:bg-gray-900/50" : "bg-white/60 dark:bg-gray-900/60"}`} />
            <div className="relative p-4">
              <Icon className="w-5 h-5 mb-2 text-gray-900 dark:text-white drop-shadow" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white drop-shadow">{label}</p>
              <p className="text-xs text-gray-700 dark:text-gray-200 mt-0.5 drop-shadow">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
