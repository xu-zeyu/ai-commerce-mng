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
    <div className="relative flex h-screen overflow-hidden bg-[linear-gradient(135deg,hsl(var(--background)),hsl(var(--secondary)/0.35))]">
      <aside className="z-20 hidden h-screen shrink-0 p-3 lg:flex lg:flex-col transition-all duration-300">
        <div
          className={`flex h-full flex-col overflow-hidden rounded-2xl border border-white/55 bg-card/60 shadow-md ring-1 ring-black/[0.03] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 dark:border-white/10 dark:bg-card/45 dark:ring-white/[0.04] ${
            collapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          <Sidebar />
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 px-3 pt-3 lg:px-4">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/55 bg-card/65 px-4 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-card/45 dark:ring-white/[0.04] sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 border-white/40 bg-card/75 p-0 backdrop-blur-2xl dark:border-white/10 dark:bg-card/60"
              >
                <SheetTitle className="sr-only">导航菜单</SheetTitle>
                <SheetDescription className="sr-only">侧边栏导航</SheetDescription>
                <Sidebar onNavigate={() => setMobileOpen(false)} forceExpanded />
              </SheetContent>
            </Sheet>
            <Topbar />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
