'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useFilteredNav } from '@/hooks/use-filtered-nav'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { NavItem } from './nav-item'
import { ThemeSwitcher } from './theme-switcher'
import { ThemeColorSwitcher } from './theme-color-switcher'
import logo from '@/assets/logo.png'

interface Props {
  onNavigate?: () => void
  forceExpanded?: boolean
}

export function Sidebar({ onNavigate, forceExpanded }: Props) {
  const pathname = usePathname()
  const sections = useFilteredNav()
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggle = useSidebarStore((s) => s.toggle)

  const isCollapsed = forceExpanded ? false : collapsed

  const isActive = useCallback(
    (href: string) =>
      pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)),
    [pathname],
  )

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col" onClick={onNavigate}>
        {/* Logo */}
        <div className={`px-4 py-5 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Image src={logo} alt="金晗跨境" width={36} height={36} className="rounded-xl shadow-sm shrink-0" />
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="text-sm font-semibold">金晗跨境</div>
                <div className="text-[11px] text-muted-foreground">电商管理后台</div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.label} className="space-y-1.5">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {section.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      collapsed={isCollapsed}
                      isActive={isActive}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom */}
        {!isCollapsed && (
          <>
            <Separator />
            <div className="space-y-3 px-4 py-3">
              <ThemeColorSwitcher />
              <ThemeSwitcher />
            </div>
          </>
        )}

        <Separator />
        <div className={`flex items-center px-3 py-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} 金晗跨境</span>
          )}
          {!forceExpanded && (
            <button
              onClick={(e) => { e.stopPropagation(); toggle() }}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
