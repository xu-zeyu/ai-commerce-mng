'use client'

import { useEffect, type ReactNode } from 'react'
import { useThemeColorStore } from '@/stores/use-theme-color-store'

function applyColor(color: string) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme-color', color)
}

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const result = useThemeColorStore.persist.rehydrate()
    if (result && 'then' in result) {
      result.then(() => applyColor(useThemeColorStore.getState().color))
    } else {
      applyColor(useThemeColorStore.getState().color)
    }
    const unsub = useThemeColorStore.subscribe((state) => applyColor(state.color))
    return () => unsub()
  }, [])

  return <>{children}</>
}
