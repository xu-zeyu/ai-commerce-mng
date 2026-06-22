'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useThemeColorStore } from '@/stores/use-theme-color-store'
import { DEFAULT_THEME_COLOR, THEME_COLORS, type ThemeColorKey } from '@/styles/theme-colors'
import { cn } from '@/lib/utils'
import { useMounted } from '@/hooks/use-mounted'

export function ThemeColorSwitcher() {
  const color = useThemeColorStore((s) => s.color)
  const setColor = useThemeColorStore((s) => s.setColor)
  const mounted = useMounted()

  const active: ThemeColorKey = mounted ? color : DEFAULT_THEME_COLOR

  return (
    <div className="space-y-2">
      <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">主题色</div>
      <div
        role="radiogroup"
        aria-label="切换主题色"
        className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-muted/40 px-2.5 py-2"
      >
        {THEME_COLORS.map((opt) => {
          const selected = active === opt.key
          return (
            <button
              key={opt.key}
              role="radio"
              aria-checked={selected}
              aria-label={opt.label}
              title={opt.label}
              onClick={() => setColor(opt.key)}
              className={cn(
                'relative grid size-6 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none',
              )}
              style={{ backgroundColor: opt.swatch }}
            >
              {selected && (
                <motion.span
                  layoutId="theme-color-active"
                  className="absolute inset-[-3px] rounded-full ring-2 ring-foreground/70 ring-offset-2 ring-offset-background"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              {selected && <Check className="relative size-3.5 text-white drop-shadow-sm" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
