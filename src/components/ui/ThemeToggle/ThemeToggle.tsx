import { useState, useEffect, useRef, type JSX } from "react"
import styles from "./ThemeToggle.module.css"

type Theme = "system" | "light" | "dark"

// ─── SVG ───────────────────────────────────────────────────────────────

const IconMonitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
)

const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// ─── Options ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: Theme; label: string; Icon: () => JSX.Element }[] = [
  { value: "system", label: "System", Icon: IconMonitor },
  { value: "light",  label: "Light",  Icon: IconSun    },
  { value: "dark",   label: "Dark",   Icon: IconMoon   },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return

  const root        = document.documentElement
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (theme === "dark" || (theme === "system" && prefersDark)) {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

function getSavedTheme(): Theme {
  if (typeof localStorage === "undefined") return "light"
  return (localStorage.getItem("theme") as Theme) ?? "light"
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme)
  const [open,  setOpen]  = useState(false)
  const wrapperRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (theme !== "system") return

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")

    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme
        setTheme(newTheme)
        applyTheme(newTheme)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const handleSelect = (value: Theme) => {
    setTheme(value)
    setOpen(false)
  }

  const ActiveIcon = OPTIONS.find(o => o.value === theme)!.Icon

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Select theme"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ActiveIcon />
      </button>

      <div className={styles.dropdown} data-open={String(open)} role="listbox">
        {OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            role="option"
            aria-selected={theme === value}
            className={`${styles.option} ${theme === value ? styles.optionActive : ""}`}
            onClick={() => handleSelect(value)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}