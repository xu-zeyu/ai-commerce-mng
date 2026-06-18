import {
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: '运营',
    items: [
      { label: '概览',   href: '/',         icon: LayoutDashboard },
    ],
  },
]
