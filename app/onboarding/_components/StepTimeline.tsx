import { Zap, CalendarDays, CalendarRange, Clock } from "lucide-react"

const options = [
  { value: "asap",            label: "ASAP",            description: "Ready to start now",       icon: Zap,          image: "/onboarding1.webp" },
  { value: "within_3_months", label: "Within 3 months", description: "Planning soon",            icon: CalendarDays, image: "/onboarding4.webp" },
  { value: "3_6_months",      label: "3 – 6 months",    description: "Building up to it",        icon: CalendarRange, image: "/onboarding2.webp" },
  { value: "flexible",        label: "Flexible",         description: "No rush, just exploring", icon: Clock,        image: "/onboarding3.webp" },
]

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function StepTimeline({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">What's your timeline?</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">When are you looking to get started?</p>
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
