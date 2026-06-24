import { Permissions } from '@/permissions/rbac'

export const SUPPLIER_VIEW_CODES = [
  Permissions.SUPPLIER_PAGE,
] as const

export const SUPPLIER_CREATE_CODES = [
  Permissions.SUPPLIER_CREATE,
] as const

export const SUPPLIER_UPDATE_CODES = [
  Permissions.SUPPLIER_UPDATE,
] as const

export const SUPPLIER_DELETE_CODES = [
  Permissions.SUPPLIER_DELETE,
] as const
