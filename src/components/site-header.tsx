'use client'

import {
  BookOpenText,
  FolderKanban,
  Github,
  Home,
  Laptop,
  Moon,
  Sun,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/site'

const navItemClass = 'flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  type Theme = 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState<Theme>('system')
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false)

  // Read theme from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    setSystemPrefersDark(prefersDark)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keep DOM in sync with current theme state (resolving system preference)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const resolved
        = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme
      document.documentElement.classList.toggle('dark', resolved === 'dark')
      document.documentElement.style.colorScheme = resolved
    }
  }, [theme, systemPrefersDark])

  // Track system changes and sync cross-tab updates
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const onMediaChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches)
    }

    media.addEventListener('change', onMediaChange)

    // Sync across tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const value = e.newValue as Theme | null
        if (value === 'light' || value === 'dark') setTheme(value)
        if (value === null) setTheme('system')
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      media.removeEventListener('change', onMediaChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggleTheme = () => {
    const nextOrder: Record<Theme, Theme> = {
      dark: 'light',
      light: 'system',
      system: 'dark',
    }
    const nextTheme = nextOrder[theme]
    setTheme(nextTheme)
    if (nextTheme === 'system') {
      localStorage.removeItem('theme')
    }
    else {
      localStorage.setItem('theme', nextTheme)
    }
  }

  return (
    <header
      className={`sticky top-0 z-20 transition-colors duration-300 ${
        isScrolled
          ? 'border-b border-border/60 bg-background/70 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-end px-4 py-3 md:px-0">
        <nav className="flex items-center gap-1 md:gap-3">
          <Link
            href="/"
            className={navItemClass}
            aria-label="Home"
            title="Home"
          >
            <Home className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/posts"
            className={navItemClass}
            aria-label="Blog"
            title="Blog"
          >
            <BookOpenText className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/projects"
            className={navItemClass}
            aria-label="Projects"
            title="Projects"
          >
            <FolderKanban className="h-4.5 w-4.5" />
          </Link>
          <Link
            href={siteConfig.links.github}
            className={navItemClass}
            aria-label="Github"
            title="Github"
          >
            <Github className="h-4.5 w-4.5" />
          </Link>
          <Link
            href={siteConfig.links.twitter}
            className={navItemClass}
            aria-label="Twitter"
            title="Twitter"
          >
            <Twitter className="h-4.5 w-4.5" />
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={navItemClass}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === 'system'
              ? (
                  <Laptop className="h-4.5 w-4.5" />
                )
              : theme === 'dark'
                ? (
                    <Sun className="h-4.5 w-4.5" />
                  )
                : (
                    <Moon className="h-4.5 w-4.5" />
                  )}
          </button>
        </nav>
      </div>
    </header>
  )
}
