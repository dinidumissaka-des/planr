"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")

  function applyTheme(t: Theme) {
    document.documentElement.classList.toggle("dark", t === "dark")
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute("content", t === "dark" ? "#0A1525" : "#ffffff")
  }

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const resolved = stored ?? system
    setTheme(resolved)
    applyTheme(resolved)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light"
    setTheme(next)
    applyTheme(next)
    localStorage.setItem("theme", next)
  }

  return { theme, toggleTheme }
}
