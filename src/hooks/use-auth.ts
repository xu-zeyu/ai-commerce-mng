"use client";

import { useAuthStore } from "@/stores/use-auth-store";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return {
    token,
    user,
    isAuthenticated: !!token,
    logout,
    permissions: user?.authorities ?? [],
  };
}

export function useHasPermission(permission: string): boolean {
  const authorities = useAuthStore((s) => s.user?.authorities ?? []);
  return authorities.includes(permission);
}
