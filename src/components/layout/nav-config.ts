import {
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Permissions } from '@/permissions/rbac'

export interface NavChildItem {
  label: string
  href: string
  permission?: string
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  permission?: string
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
        permission: Permissions.SETTINGS_MANAGE,
        children: [
          { label: '权限管理', href: '/settings/permissions', permission: Permissions.PERMISSION_MANAGE },
          { label: '角色管理', href: '/settings/roles', permission: Permissions.ROLE_MANAGE },
        ],
      },
    ],
  },
]
