'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { NAV_SECTIONS } from './nav-config'

export function Breadcrumb() {
  const pathname = usePathname()

  const trail: string[] = []

  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      const exactItem = pathname === item.href
      const prefixItem = item.href !== '/' && pathname.startsWith(`${item.href}/`)

      if (item.children) {
        for (const child of item.children) {
          if (pathname === child.href) {
            trail.push(section.label, item.label, child.label)
            break
          }
        }
        if (trail.length > 0) break
      }

      if (exactItem || prefixItem) {
        trail.push(section.label, item.label)
        break
      }
    }
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
