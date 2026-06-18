import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AdminSelf } from '@/features/auth/types'

interface AuthState {
  token: string | null
  user: AdminSelf | null
  isLoading: boolean
  setToken: (token: string | null) => void
  setUser: (user: AdminSelf | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'jh-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
