"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { getAdminSelf } from "@/features/auth/api/get-admin-self";
import { ApiError } from "@/services/api-client";
import pageLoading from "@/assets/pageLoading.png";
import Image from "next/image";

/** 无需登录即可访问的路径 */
const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const logout = useAuthStore((s) => s.logout);

  const [ready, setReady] = useState(false);

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      if (!token) {
        // 无 token：公开页面放行，其他跳登录
        if (!isPublic) {
          router.replace("/login");
        }
        setReady(true);
        return;
      }

      // 有 token 但没 user：尝试获取用户信息
      if (!user) {
        try {
          const self = await getAdminSelf();
          if (!cancelled) {
            setUser(self);
          }
        } catch (err) {
          // token 过期或无效
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            if (!cancelled) logout();
            if (!isPublic) router.replace("/login");
          }
          // 网络错误时保留 token 和当前页面，让用户重试
        }
      }

      // 已登录用户访问登录页 → 跳回首页
      if (!cancelled && isPublic && token) {
        router.replace("/");
      }

      if (!cancelled) setReady(true);
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [token, user, isPublic, router, setUser, logout]);

  // 未就绪时显示加载页
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={pageLoading}
            alt="加载中"
            width={80}
            height={80}
            className="animate-pulse"
            priority
          />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  // 公开页面直接展示
  if (isPublic) {
    return <>{children}</>;
  }

  // 受保护页面但无 token → 不渲染（useEffect 已触发跳转）
  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={pageLoading}
            alt="跳转中"
            width={80}
            height={80}
            className="animate-pulse"
            priority
          />
          <p className="text-sm text-muted-foreground">正在跳转...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
