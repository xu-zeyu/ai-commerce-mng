import { Permissions } from '@/permissions/rbac'

export const PRODUCT_VIEW_CODES = [
  Permissions.PRODUCT_SPU_PAGE,
] as const

export const PRODUCT_CREATE_CODES = [
  Permissions.PRODUCT_SPU_CREATE,
] as const

export const PRODUCT_UPDATE_CODES = [
  Permissions.PRODUCT_SPU_UPDATE,
] as const

export const PRODUCT_DELETE_CODES = [
  Permissions.PRODUCT_SPU_DELETE,
] as const
