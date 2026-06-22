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
    code: 'BANNER',
    label: 'Banner管理',
    pages: [
      {
        code: 'BANNER_LIST',
        label: 'Banner列表',
        actions: [
          { code: 'BANNER_LIST_CREATE', label: '创建Banner' },
          { code: 'BANNER_LIST_UPDATE', label: '编辑Banner' },
          { code: 'BANNER_LIST_DELETE', label: '删除Banner' },
        ],
      },
    ],
  },
  {
    code: 'PRODUCT',
    label: '商品管理',
    pages: [
      {
        code: 'PRODUCT_LIST',
        label: '商品列表',
        actions: [
          { code: 'PRODUCT_LIST_VIEW', label: '查看商品' },
          { code: 'PRODUCT_LIST_CREATE', label: '创建商品' },
          { code: 'PRODUCT_LIST_UPDATE', label: '编辑商品' },
          { code: 'PRODUCT_LIST_DELETE', label: '删除商品' },
          { code: 'PRODUCT_LIST_ORDER', label: '商品下单' },
        ],
      },
    ],
  },
  {
    code: 'ORDER',
    label: '订单管理',
    pages: [
      {
        code: 'ORDER_LIST',
        label: '订单列表',
        actions: [
          { code: 'ORDER_LIST_VIEW', label: '查看订单' },
          { code: 'ORDER_LIST_AUDIT', label: '审核订单' },
          { code: 'ORDER_LIST_SHIP', label: '订单发货' },
          { code: 'ORDER_LIST_CANCEL', label: '取消订单' },
          { code: 'ORDER_LIST_PAY', label: '订单付款' },
        ],
      },
    ],
  },
  {
    code: 'USER',
    label: '用户管理',
    pages: [
      {
        code: 'USER_LIST',
        label: '用户列表',
        actions: [
          { code: 'USER_LIST_CREATE', label: '创建用户' },
          { code: 'USER_LIST_UPDATE', label: '编辑用户' },
          { code: 'USER_LIST_DELETE', label: '删除用户' },
        ],
      },
    ],
  },
  {
    code: 'VARIETY',
    label: '品种管理',
    pages: [
      {
        code: 'VARIETY_LIST',
        label: '品种列表',
        actions: [
          { code: 'VARIETY_LIST_CREATE', label: '创建品种' },
          { code: 'VARIETY_LIST_UPDATE', label: '编辑品种' },
          { code: 'VARIETY_LIST_DELETE', label: '删除品种' },
        ],
      },
    ],
  },
  {
    code: 'ADMIN',
    label: '系统管理',
    pages: [
      {
        code: 'ADMIN_ROLE',
        label: '角色管理',
        actions: [
          { code: 'ADMIN_ROLE_CREATE', label: '创建角色' },
          { code: 'ADMIN_ROLE_UPDATE', label: '编辑角色' },
          { code: 'ADMIN_ROLE_DELETE', label: '删除角色' },
          { code: 'ADMIN_ROLE_ASSIGN_PERMISSION', label: '分配权限' },
        ],
      },
      {
        code: 'ADMIN_PERMISSION',
        label: '权限管理',
        actions: [{ code: 'ADMIN_PERMISSION_SYNC', label: '同步权限' }],
      },
    ],
  },
  {
    code: 'FINANCE',
    label: '财务管理',
    pages: [
      {
        code: 'FINANCE_INCOME',
        label: '收入管理',
        actions: [
          { code: 'FINANCE_INCOME_LIST', label: '收入列表' },
          { code: 'FINANCE_INCOME_CREATE', label: '创建收入' },
          { code: 'FINANCE_INCOME_UPDATE', label: '编辑收入' },
          { code: 'FINANCE_INCOME_DELETE', label: '删除收入' },
          { code: 'FINANCE_INCOME_AUDIT', label: '审核' },
        ],
      },
    ],
  },
  {
    code: 'SHIPPING',
    label: '发货管理',
    pages: [
      {
        code: 'SHIPPING_LIST',
        label: '发货列表',
        actions: [
          { code: 'SHIPPING_LIST_VIEW', label: '查看发货' },
          { code: 'SHIPPING_LIST_CREATE', label: '创建发货' },
          { code: 'SHIPPING_LIST_UPDATE', label: '编辑发货' },
          { code: 'SHIPPING_LIST_STATUS_UPDATE', label: '更新发货状态' },
          { code: 'SHIPPING_LIST_DELETE', label: '删除发货' },
        ],
      },
    ],
  },
  {
    code: 'FOSTER_CARE',
    label: '寄养服务',
    pages: [
      {
        code: 'FOSTER_CARE_LIST',
        label: '寄养服务列表',
        actions: [
          { code: 'FOSTER_CARE_LIST_VIEW', label: '查看寄养服务' },
          { code: 'FOSTER_CARE_LIST_CREATE', label: '创建寄养服务' },
          { code: 'FOSTER_CARE_LIST_UPDATE', label: '编辑寄养服务' },
          { code: 'FOSTER_CARE_LIST_STATUS_UPDATE', label: '更新寄养服务状态' },
          { code: 'FOSTER_CARE_LIST_DELETE', label: '删除寄养服务' },
        ],
      },
    ],
  },
  {
    code: 'LOG',
    label: '日志管理',
    pages: [
      {
        code: 'LOG_LIST',
        label: '日志列表',
        actions: [
          { code: 'LOG_LIST_VIEW', label: '查看日志' },
          { code: 'LOG_LIST_DELETE', label: '删除日志' },
        ],
      },
    ],
  },
]

const actionCodes = new Set(ADMIN_PERMISSION_MODULES.flatMap((m) => m.pages.flatMap((p) => p.actions.map((a) => a.code))))
const pageToModule = new Map(ADMIN_PERMISSION_MODULES.flatMap((m) => m.pages.map((p) => [p.code, m.code])))
const actionToPage = new Map(ADMIN_PERMISSION_MODULES.flatMap((m) => m.pages.flatMap((p) => p.actions.map((a) => [a.code, p.code]))))

export function getPermissionSyncPayload(): PermissionSyncItem[] {
  return ADMIN_PERMISSION_MODULES.flatMap((module) => [
    { name: module.label, code: module.code },
    ...module.pages.flatMap((page) => [
      { name: page.label, code: page.code },
      ...page.actions.map((action) => ({ name: action.label, code: action.code })),
    ]),
  ])
}

export function buildRolePermissionTree(): RolePermissionTreeNode[] {
  return ADMIN_PERMISSION_MODULES.map((module) => ({
    id: module.code,
    label: module.label,
    code: module.code,
    depth: 0,
    permissionCodes: module.pages.flatMap((page) => [page.code, ...page.actions.map((action) => action.code)]),
    children: module.pages.map((page) => ({
      id: page.code,
      label: page.label,
      code: page.code,
      depth: 1,
      permissionCodes: [page.code, ...page.actions.map((action) => action.code)],
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

export function getAssignedActionCodes(permissions: AdminPermission[]): string[] {
  return permissions.map((permission) => permission.code).filter((code) => actionCodes.has(code))
}

export function convertCheckedCodesToPermissionIds(checkedCodes: string[], allPermissions: AdminPermission[]): number[] {
  const expanded = new Set<string>()

  checkedCodes.forEach((code) => {
    expanded.add(code)

    const pageCode = actionToPage.get(code)
    if (pageCode) {
      expanded.add(pageCode)
      const moduleCode = pageToModule.get(pageCode)
      if (moduleCode) expanded.add(moduleCode)
      return
    }

    const moduleCode = pageToModule.get(code)
    if (moduleCode) expanded.add(moduleCode)
  })

  return Array.from(expanded)
    .map((code) => allPermissions.find((permission) => permission.code === code)?.id)
    .filter((id): id is number => typeof id === 'number')
}
