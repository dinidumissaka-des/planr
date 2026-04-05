"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const resolved = stored ?? system
    setTheme(resolved)
    document.documentElement.classList.toggle("dark", resolved === "dark")
  }, [])

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem("theme", next)
  }

  return { theme, toggleTheme }
}
