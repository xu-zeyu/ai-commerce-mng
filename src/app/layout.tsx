import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "金晗智能助手",
    template: "%s | 金晗智能助手",
  },
  description: "知识管理、AI 内容创作与企业客户服务工作台",
};

const themeColorScript = `
(function(){
  try {
    var raw = localStorage.getItem('jh-theme-color');
    if (raw) {
      var parsed = JSON.parse(raw);
      var color = parsed && parsed.state && parsed.state.color;
      if (color) document.documentElement.setAttribute('data-theme-color', color);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeColorScript }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
