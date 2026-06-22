import { Permissions } from '@/permissions/rbac'

export const CATEGORY_VIEW_CODES = [
  Permissions.CATEGORY_VIEW,
  Permissions.CATEGORY_MANAGE,
  'GOODS_CATEGORY_PAGE',
  'GOODS_CATEGORY_TREE',
] as const

export const CATEGORY_CREATE_CODES = [
  Permissions.CATEGORY_MANAGE,
  'GOODS_CATEGORY_CREATE',
] as const

export const CATEGORY_MUTATE_CODES = [
  Permissions.CATEGORY_MANAGE,
  'GOODS_CATEGORY_CREATE',
  'GOODS_CATEGORY_UPDATE',
  'GOODS_CATEGORY_DELETE',
] as const
