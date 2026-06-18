import type { ReactNode } from "react";

export const metadata = {
  title: "登录 - 金晗跨境电商管理后台",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* 背景装饰 */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
