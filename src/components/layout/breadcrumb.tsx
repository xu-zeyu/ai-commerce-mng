'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { NAV_SECTIONS, type NavChildItem, type NavItem } from './nav-config'

function findTrail(items: Array<NavItem | NavChildItem>, pathname: string): string[] {
  for (const item of items) {
    const exact = pathname === item.href
    const prefix = item.href !== '/' && pathname.startsWith(`${item.href}/`)
    const childTrail = item.children ? findTrail(item.children, pathname) : []

    if (childTrail.length > 0) return [item.label, ...childTrail]
    if (exact || prefix) return [item.label]
  }

  return []
}

export function Breadcrumb() {
  const pathname = usePathname()

  const trail: string[] = []

  for (const section of NAV_SECTIONS) {
    const sectionTrail = findTrail(section.items, pathname)
    if (sectionTrail.length > 0) trail.push(section.label, ...sectionTrail)
    if (trail.length > 0) break
  }

  if (trail.length === 0) trail.push('管理后台')

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {trail.map((label, idx) => (
        <span key={`${label}-${idx}`} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="size-3.5 opacity-60" />}
          <span className={idx === trail.length - 1 ? 'font-medium text-foreground' : ''}>
            {label}
          </span>
        </span>
      ))}
    </nav>
  )
}
