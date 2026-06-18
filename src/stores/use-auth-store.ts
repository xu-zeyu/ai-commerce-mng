'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AdminSelf } from '@/features/auth/types'

interface AuthState {
  token: string | null
  user: AdminSelf | null
}

interface AuthActions {
  setToken: (token: string) => void
  setUser: (user: AdminSelf) => void
  logout: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken(token) {
        set({ token })
      },
      setUser(user) {
        set({ user })
      },
      logout() {
        set({ token: null, user: null })
      },
    }),
    {
      name: 'jh-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      skipHydration: true,
    },
  ),
)
