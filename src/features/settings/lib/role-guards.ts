import type { AdminRole } from '../types'

const PROTECTED_ROLE_NAMES = new Set([
  'sub',
  'sub_admin',
  'sub-admin',
  'subadmin',
  'super_admin',
  'super-admin',
  'superadmin',
])

export function isProtectedRole(role: AdminRole): boolean {
  const name = role.rname.trim().toLowerCase()
  const description = role.description?.trim().toLowerCase() ?? ''

  return (
    PROTECTED_ROLE_NAMES.has(name) ||
    role.rname.includes('超级管理员') ||
    description.includes('超级管理员')
  )
}

export function getRoleDisplayName(role: AdminRole): string {
  if (isProtectedRole(role)) return '超级管理员'
  return role.rname
}
