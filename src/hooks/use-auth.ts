"use client";

import { useAuthStore } from "@/stores/use-auth-store";

/**
 * 认证 hook — 提供用户登录状态与权限信息的便捷访问。
 */
export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    logout,
    /** 当前用户拥有的权限编码列表 */
    permissions: user?.authorities ?? [],
  };
}

/**
 * 检查当前用户是否拥有某个权限。
 * 需要在组件内调用，因为依赖了 Zustand 的响应式。
 */
export function useHasPermission(permission: string): boolean {
  const authorities = useAuthStore((s) => s.user?.authorities ?? []);
  return authorities.includes(permission);
}
