import { Permissions } from '@/permissions/rbac'

export const BRAND_VIEW_CODES = [
  Permissions.GOODS_BRAND_PAGE,
] as const

export const BRAND_CREATE_CODES = [
  Permissions.GOODS_BRAND_CREATE,
] as const

export const BRAND_UPDATE_CODES = [
  Permissions.GOODS_BRAND_UPDATE,
] as const

export const BRAND_DELETE_CODES = [
  Permissions.GOODS_BRAND_DELETE,
] as const

export const BRAND_MUTATE_CODES = [
  Permissions.GOODS_BRAND_CREATE,
  Permissions.GOODS_BRAND_UPDATE,
] as const
