'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { NavItem as NavItemType } from './nav-config'

interface NavItemProps {
  item: NavItemType
  collapsed: boolean
  isActive: (href: string) => boolean
}

export function NavItem({ item, collapsed, isActive }: NavItemProps) {
  const pathname = usePathname()
  const hasChildren = item.children && item.children.length > 0
  const active = isActive(item.href)
  const childActive = hasChildren && item.children!.some((c) => pathname === c.href)
  const [open, setOpen] = useState(active || childActive)

  const Icon = item.icon

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={hasChildren ? item.children![0].href : item.href}
            className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto transition-colors ${
              active || childActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="size-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <Icon className="size-4.5 shrink-0" />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <Icon className="size-4.5 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="size-4 text-muted-foreground/60" />
        </motion.div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-3">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === child.href
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
