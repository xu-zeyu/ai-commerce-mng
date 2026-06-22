import {
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { Permissions, type PermissionCode } from '@/permissions/rbac'

export interface NavChildItem {
  label: string
  href: string
  icon?: LucideIcon
  permission?: PermissionCode
  children?: NavChildItem[]
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  permission?: PermissionCode
  children?: NavChildItem[]
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: '运营',
    items: [
      { label: '概览', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: '系统',
    items: [
      {
        label: '设置',
        href: '/settings',
        icon: Settings,
        children: [
          {
            label: '角色管理',
            href: '/settings/roles',
            permission: [Permissions.ROLE_MANAGE, Permissions.ROLE_MANAGE_LEGACY],
          },
        ],
      },
    ],
  },
]
