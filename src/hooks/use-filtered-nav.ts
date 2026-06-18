'use client'

import { useMemo } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { NAV_SECTIONS, type NavSection, type NavItem } from '@/components/layout/nav-config'
import { hasPermission } from '@/permissions/rbac'

function filterItem<T extends NavItem>(item: T, authorities: string[]): T | null {
  if (item.permission && !hasPermission(authorities, item.permission)) {
    return null
  }

  if (!item.children) return item

  const children = item.children
    .map((child) => filterItem(child as NavItem, authorities))
    .filter(Boolean) as T['children']

  if (!children?.length) return null
  return { ...item, children }
}

export function useFilteredNav(): NavSection[] {
  const authorities = useAuthStore((s) => s.user?.authorities ?? [])

  return useMemo(() => {
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items
        .map((item) => filterItem(item, authorities))
        .filter(Boolean) as NavItem[],
    })).filter((section) => section.items.length > 0)
  }, [authorities])
}
