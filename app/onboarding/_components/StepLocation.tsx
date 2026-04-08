import { Input } from "@/components/ui/input"

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function StepLocation({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Where is the project located?</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We'll use this to find consultants in your area.</p>
      <Input
        placeholder="e.g. Melbourne, VIC"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-12 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 text-sm rounded-xl"
      />
    </div>
  )
}
