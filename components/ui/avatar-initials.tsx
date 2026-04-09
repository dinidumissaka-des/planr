const palette = [
  { bg: "bg-violet-100 dark:bg-violet-900/40", text: "text-violet-700 dark:text-violet-300" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
  { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
  { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300" },
  { bg: "bg-sky-100 dark:bg-sky-900/40", text: "text-sky-700 dark:text-sky-300" },
  { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-700 dark:text-teal-300" },
  { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300" },
  { bg: "bg-pink-100 dark:bg-pink-900/40", text: "text-pink-700 dark:text-pink-300" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300" },
  { bg: "bg-lime-100 dark:bg-lime-900/40", text: "text-lime-700 dark:text-lime-300" },
]

function getColor(initials: string) {
  const index = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % palette.length
  return palette[index]
}

interface AvatarProps {
  initials: string
  size?: string
  textSize?: string
  rounded?: string
}

export function AvatarInitials({ initials, size = "w-8 h-8", textSize = "text-[10px]", rounded = "rounded-full" }: AvatarProps) {
  const { bg, text } = getColor(initials)
  return (
    <div className={`${size} ${bg} ${rounded} flex items-center justify-center flex-shrink-0`}>
      <span className={`${textSize} font-bold ${text}`}>{initials}</span>
    </div>
  )
}
