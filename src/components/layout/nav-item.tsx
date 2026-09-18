'use client'

import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { NavItem as NavItemType } from './nav-config'

interface NavItemProps {
  item: NavItemType
  collapsed: boolean
  isActive: (href: string) => boolean
}

export function NavItem({ item, collapsed, isActive }: NavItemProps) {
  const active = isActive(item.href)
  const Icon = item.icon
  const link = (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={`group flex items-center rounded-xl text-[13px] font-medium transition-colors ${
        collapsed ? 'mx-auto size-10 justify-center' : 'gap-3 px-3 py-2.5'
      } ${
        active
          ? 'bg-primary/12 text-primary ring-1 ring-primary/10'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>{item.label}</TooltipContent>
    </Tooltip>
  )
}
