'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { NAV_SECTIONS } from './nav-config'

export function Breadcrumb() {
  const pathname = usePathname()
  const current = NAV_SECTIONS.flatMap((section) => section.items).find(
    (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`)),
  )

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="面包屑">
      <span>智能工作台</span>
      <ChevronRight className="size-3.5 opacity-60" />
      <span className="font-medium text-foreground">{current?.label ?? 'AI 创作'}</span>
    </nav>
  )
}
