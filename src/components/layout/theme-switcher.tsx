'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMounted } from '@/hooks/use-mounted'

type ThemeKey = 'light' | 'dark' | 'system'

const OPTIONS: { key: ThemeKey; label: string; icon: typeof Sun }[] = [
  { key: 'light',  label: '浅色', icon: Sun },
  { key: 'dark',   label: '深色', icon: Moon },
  { key: 'system', label: '系统', icon: Monitor },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  const active = (mounted ? (theme as ThemeKey) : 'system') ?? 'system'

  return (
    <div className="space-y-2">
      <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">主题</div>
      <div
        role="radiogroup"
        aria-label="切换主题"
        className="relative flex items-center gap-1 rounded-2xl border border-border/60 bg-muted/40 p-1"
      >
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          const selected = mounted && active === opt.key
          return (
            <button
              key={opt.key}
              role="radio"
              aria-checked={selected}
              aria-label={opt.label}
              onClick={() => setTheme(opt.key)}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors',
                selected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="theme-switcher-active"
                  className="absolute inset-0 rounded-xl bg-card shadow-sm ring-1 ring-border/60"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative size-3.5" />
              <span className="relative">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
