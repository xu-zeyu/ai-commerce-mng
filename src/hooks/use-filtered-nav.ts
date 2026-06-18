'use client'

import { useMemo } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { NAV_SECTIONS, type NavSection, type NavItem } from '@/components/layout/nav-config'

export function useFilteredNav(): NavSection[] {
  const authorities = useAuthStore((s) => s.user?.authorities ?? [])

  return useMemo(() => {
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          if (item.permission && !authorities.includes(item.permission)) {
            return null
          }
          if (item.children) {
            const filtered = item.children.filter(
              (child) => !child.permission || authorities.includes(child.permission),
            )
            if (filtered.length === 0) return null
            return { ...item, children: filtered }
          }
          return item
        })
        .filter(Boolean) as NavItem[],
    })).filter((section) => section.items.length > 0)
  }, [authorities])
}
