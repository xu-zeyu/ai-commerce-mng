'use client'

import { useState, type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = useSidebarStore((s) => s.collapsed)

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* 背景渐变装饰 */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* 桌面端玻璃侧边栏 */}
      <aside className="z-20 hidden h-screen shrink-0 p-3 lg:flex lg:flex-col transition-all duration-300">
        <div
          className={`flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-card/50 transition-all duration-300 ${
            collapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          <Sidebar />
        </div>
      </aside>

      {/* 主内容区域 */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* 玻璃顶栏 */}
        <header className="sticky top-0 z-30 mx-3 mt-3">
          <div className="flex h-16 items-center gap-3 rounded-2xl border border-border/50 bg-card/70 px-4 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/50 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">导航菜单</SheetTitle>
                <SheetDescription className="sr-only">侧边栏导航</SheetDescription>
                <Sidebar onNavigate={() => setMobileOpen(false)} forceExpanded />
              </SheetContent>
            </Sheet>
            <Topbar />
          </div>
        </header>

        {/* 可滚动内容区 */}
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
