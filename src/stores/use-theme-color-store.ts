'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_THEME_COLOR, THEME_COLOR_STORAGE_KEY, type ThemeColorKey } from '@/styles/theme-colors'

interface State {
  color: ThemeColorKey
  setColor: (color: ThemeColorKey) => void
}

export const useThemeColorStore = create<State>()(
  persist(
    (set) => ({
      color: DEFAULT_THEME_COLOR,
      setColor: (color) => set({ color }),
    }),
    {
      name: THEME_COLOR_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
