import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "金晗跨境电商管理后台",
  description: "现代化跨境电商管理后台",
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
