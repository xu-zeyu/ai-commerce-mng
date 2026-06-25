"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { getAdminSelf } from "@/features/auth/api/get-admin-self";
import { isAxiosError } from "axios";
import pageLoading from "@/assets/pageLoading.png";
import Image from "next/image";

const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [hydrated, setHydrated] = useState(false);
  const [ready, setReady] = useState(false);
  // 保证每次页面刷新（组件挂载）只主动拉取一次最新权限信息
  const refreshedRef = useRef(false);

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    const persist = useAuthStore.persist;

    if (persist?.hasHydrated()) {
      queueMicrotask(() => setHydrated(true));
      return;
    }

    const unsubscribe = persist?.onFinishHydration(() => {
      setHydrated(true);
    });
    void Promise.resolve(persist?.rehydrate()).finally(() => {
      setHydrated(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    async function checkAuth() {
      if (!token) {
        if (!isPublic) {
          router.replace("/login");
        }
        setReady(true);
        return;
      }

      // 已有缓存用户时先放行渲染，避免刷新时出现整页 loading 闪烁
      if (user && !cancelled) setReady(true);

      // 页面刷新（组件挂载）后主动调用 getAdminSelf 刷新最新权限信息
      if (!refreshedRef.current) {
        refreshedRef.current = true;
        try {
          const self = await getAdminSelf();
          if (!cancelled) {
            setUser(self);
          }
        } catch (err) {
          if (isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
            if (!cancelled) logout();
            if (!isPublic) router.replace("/login");
          }
        }
      }

      if (!cancelled && isPublic && token) {
        router.replace("/");
      }

      if (!cancelled) setReady(true);
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [hydrated, token, user, isPublic, router, setUser, logout]);

  if (!hydrated || !ready) {
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

  if (!isPublic && !token) {
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
