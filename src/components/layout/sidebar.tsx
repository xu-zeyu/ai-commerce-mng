'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { NAV_SECTIONS } from './nav-config'
import { ThemeSwitcher } from './theme-switcher'
import { ThemeColorSwitcher } from './theme-color-switcher'
import { cn } from '@/lib/utils'
import logo from '@/assets/logo.png'

interface Props {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname()

  const activeHref = useMemo(() => {
    let best = ''
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        const matched =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
        if (matched && item.href.length > best.length) best = item.href
      }
    }
    return best
  }, [pathname])

  return (
    <div className="flex h-full flex-col">
      {/* Logo 区域 */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image src={logo} alt="金晗跨境" width={36} height={36} className="rounded-xl shadow-sm" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold">金晗跨境</div>
            <div className="text-xs text-muted-foreground">电商管理后台</div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 导航区域 */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="space-y-2">
              <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = item.href === activeHref
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/60 hover:bg-muted/60 hover:text-foreground',
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-primary"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <item.icon className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* 底部设置区 */}
      <Separator />
      <div className="space-y-3 px-4 py-3">
        <ThemeColorSwitcher />
        <ThemeSwitcher />
      </div>
      <Separator />
      <div className="px-4 py-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} 金晗跨境电商
      </div>
    </div>
  )
}
