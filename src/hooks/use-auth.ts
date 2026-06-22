"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import {
  EMPTY_AUTHORITIES,
  hasPermission,
  type PermissionCode,
  type PermissionMatchMode,
} from "@/permissions/rbac";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return {
    token,
    user,
    isAuthenticated: !!token,
    logout,
    permissions: user?.authorities ?? EMPTY_AUTHORITIES,
  };
}

export function useHasPermission(
  permission: PermissionCode,
  mode: PermissionMatchMode = "any",
): boolean {
  const authorities = useAuthStore((s) => s.user?.authorities ?? EMPTY_AUTHORITIES);
  return hasPermission(authorities, permission, mode);
}
