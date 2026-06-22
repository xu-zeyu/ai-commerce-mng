'use client'

import { useMemo, useState } from 'react'
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

function hasActiveChild(item: NavItemType, pathname: string): boolean {
  return Boolean(item.children?.some((child) => (
    pathname === child.href ||
    (child.href !== '/' && pathname.startsWith(`${child.href}/`)) ||
    hasActiveChild(child as NavItemType, pathname)
  )))
}

function findFirstLeaf(item: NavItemType): string {
  const firstChild = item.children?.[0]
  if (!firstChild) return item.href
  return findFirstLeaf(firstChild as NavItemType)
}

export function NavItem({ item, collapsed, isActive }: NavItemProps) {
  const pathname = usePathname()
  const hasChildren = item.children && item.children.length > 0
  const active = isActive(item.href)
  const childActive = hasActiveChild(item, pathname)
  const [open, setOpen] = useState(active || childActive)
  const displayOpen = open || active || childActive
  const leafHref = useMemo(() => findFirstLeaf(item), [item])

  const Icon = item.icon

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={hasChildren ? leafHref : item.href}
            className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto transition-colors ${
              active || childActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {Icon && <Icon className="size-5" />}
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
        className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
          active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span>{item.label}</span>
      </Link>
    )
  }

  // 父级带子层级：激活时不显示激活背景色，仅高亮文字，激活背景由子层级承载
  return (
    <Collapsible open={displayOpen} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors hover:bg-muted hover:text-foreground ${
          childActive ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="flex-1 text-left">{item.label}</span>
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="size-3.5 text-muted-foreground/60" />
        </motion.div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-3">
          {item.children!.map((child) => (
            child.children?.length ? (
              <NavItem
                key={child.href}
                item={child as NavItemType}
                collapsed={false}
                isActive={isActive}
              />
            ) : (
              <Link
                key={child.href}
                href={child.href}
                className={`block rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  pathname === child.href
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {child.label}
              </Link>
            )
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
