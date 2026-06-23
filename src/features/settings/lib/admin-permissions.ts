import { Permissions } from '@/permissions/rbac'
import type { AdminPermission, PermissionSyncItem, RolePermissionTreeNode } from '../types'

interface PermissionAction {
  code: string
  label: string
}

interface PermissionPage {
  code: string
  label: string
  actions: PermissionAction[]
}

interface PermissionModule {
  code: string
  label: string
  pages: PermissionPage[]
}

export const ADMIN_PERMISSION_MODULES: PermissionModule[] = [
  {
    code: 'GOODS',
    label: '商品管理',
    pages: [
      {
        code: 'GOODS_CATEGORY',
        label: '商品分类',
        actions: [
          { code: Permissions.GOODS_CATEGORY_CREATE, label: '新增分类' },
          { code: Permissions.GOODS_CATEGORY_PAGE, label: '分页/层级列表' },
          { code: Permissions.GOODS_CATEGORY_TREE, label: '树形列表' },
        ],
      },
      {
        code: 'GOODS_BRAND',
        label: '商品品牌',
        actions: [
          { code: Permissions.GOODS_BRAND_CREATE, label: '新增品牌' },
          { code: Permissions.GOODS_BRAND_PAGE, label: '分页列表' },
          { code: Permissions.GOODS_BRAND_UPDATE, label: '编辑品牌' },
          { code: Permissions.GOODS_BRAND_DELETE, label: '删除品牌' },
        ],
      },
    ],
  },
]

const selectableCodes = new Set(
  ADMIN_PERMISSION_MODULES.flatMap((module) =>
    module.pages.flatMap((page) => page.actions.map((action) => action.code)),
  ),
)

export function getPermissionSyncPayload(): PermissionSyncItem[] {
  return ADMIN_PERMISSION_MODULES.flatMap((module) =>
    module.pages.flatMap((page) =>
      page.actions.map((action) => ({ name: action.label, code: action.code })),
    ),
  )
}

export function buildRolePermissionTree(): RolePermissionTreeNode[] {
  return ADMIN_PERMISSION_MODULES.map((module) => ({
    id: module.code,
    label: module.label,
    code: module.code,
    depth: 0,
    permissionCodes: module.pages.flatMap((page) => page.actions.map((action) => action.code)),
    children: module.pages.map((page) => ({
      id: page.code,
      label: page.label,
      code: page.code,
      depth: 1,
      permissionCodes: page.actions.map((action) => action.code),
      children: page.actions.map((action) => ({
        id: action.code,
        label: action.label,
        code: action.code,
        depth: 2,
        permissionCodes: [action.code],
        children: [],
      })),
    })),
  }))
}

export function getAssignedPermissionCodes(permissions: AdminPermission[]): string[] {
  return permissions
    .map((permission) => permission.code)
    .filter((code) => selectableCodes.has(code))
}

export function getAssignedActionCodes(permissions: AdminPermission[]): string[] {
  return getAssignedPermissionCodes(permissions)
}

export function convertCheckedCodesToPermissionIds(
  checkedCodes: string[],
  allPermissions: AdminPermission[],
): number[] {
  const selectedCodes = new Set(checkedCodes.filter((code) => selectableCodes.has(code)))

  return allPermissions
    .filter((permission) => selectedCodes.has(permission.code))
    .map((permission) => permission.id)
}
