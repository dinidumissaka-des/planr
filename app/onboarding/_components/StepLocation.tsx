import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function StepLocation({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Where is the project located?</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We'll use this to find consultants in your area.</p>

      {/* Decorative image card */}
      <div className="relative rounded-2xl overflow-hidden mb-5 h-36">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/onboarding1.webp')" }} />
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/60" />
        <div className="relative h-full flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/70 px-4 py-2 rounded-xl shadow-sm">
            <MapPin className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {value || "Your project location"}
            </span>
          </div>
        </div>
      </div>

      <Input
        placeholder="e.g. Colombo, Western Province"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
      />
    </div>
  )
}
