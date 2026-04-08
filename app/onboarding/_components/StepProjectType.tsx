import { Building2, Hammer, Sofa, Expand } from "lucide-react"

const options = [
  { value: "new_build", label: "New Build", description: "Build from the ground up", icon: Building2 },
  { value: "renovation", label: "Renovation", description: "Update an existing space", icon: Hammer },
  { value: "interior_design", label: "Interior Design", description: "Refresh your interiors", icon: Sofa },
  { value: "extension", label: "Extension", description: "Expand your current home", icon: Expand },
]

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function StepProjectType({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">What type of project is it?</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Select the option that best describes your project.</p>
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
