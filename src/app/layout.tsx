import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "金晗跨境电商管理后台",
  description: "现代化跨境电商管理后台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
