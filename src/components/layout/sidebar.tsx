'use client'

import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Bot, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { NAV_SECTIONS } from './nav-config'
import { NavItem } from './nav-item'
import { ThemeColorSwitcher } from './theme-color-switcher'

interface SidebarProps {
  onNavigate?: () => void
  forceExpanded?: boolean
}

export function Sidebar({ onNavigate, forceExpanded }: SidebarProps) {
  const pathname = usePathname()
  const collapsed = useSidebarStore((state) => state.collapsed)
  const toggle = useSidebarStore((state) => state.toggle)
  const isCollapsed = forceExpanded ? false : collapsed
  const isActive = useCallback(
    (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)),
    [pathname],
  )

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col" onClick={onNavigate}>
        <div className={`px-4 py-5 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Bot className="size-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-semibold">金晗智能助手</div>
                <div className="truncate text-[11px] text-muted-foreground">企业 AI 工作台</div>
              </div>
            )}
          </div>
        </div>

        <Separator />
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className="space-y-1.5">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {section.label}
                  </p>
                )}
                {section.items.map((item) => (
                  <NavItem key={item.href} item={item} collapsed={isCollapsed} isActive={isActive} />
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {!isCollapsed && (
          <>
            <Separator />
            <div className="px-4 py-3"><ThemeColorSwitcher /></div>
          </>
        )}
        <Separator />
        <div className={`flex items-center px-3 py-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span className="text-xs text-muted-foreground">AI Workspace</span>}
          {!forceExpanded && (
            <button
              type="button"
              aria-label={isCollapsed ? '展开导航' : '收起导航'}
              onClick={(event) => { event.stopPropagation(); toggle() }}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
