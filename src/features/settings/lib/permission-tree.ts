import type { AdminPermission, PermissionTreeNode } from '../types'

const CODE_LABELS: Record<string, string> = {
  admin: '管理员',
  brand: '品牌',
  category: '分类',
  create: '新增',
  dashboard: '工作台',
  delete: '删除',
  goods: '商品',
  list: '列表',
  manage: '管理',
  order: '订单',
  page: '分页',
  permission: '权限',
  product: '商品',
  read: '查看',
  role: '角色',
  setting: '设置',
  settings: '设置',
  store: '店铺',
  sub: '超级管理员',
  tree: '树形',
  update: '编辑',
  user: '用户',
  view: '查看',
}

const FULL_CODE_LABELS: Record<string, string> = {
  SUB_ADMIN: '超级管理员',
  GOODS_CATEGORY_CREATE: '商品分类新增',
  GOODS_CATEGORY_PAGE: '商品分类分页',
  GOODS_CATEGORY_TREE: '商品分类树形',
  GOODS_BRAND_CREATE: '商品品牌新增',
  GOODS_BRAND_PAGE: '商品品牌分页',
  GOODS_BRAND_UPDATE: '商品品牌编辑',
  GOODS_BRAND_DELETE: '商品品牌删除',
  SUPPLIER_CREATE: '供应商新增',
  SUPPLIER_PAGE: '供应商分页',
  SUPPLIER_UPDATE: '供应商编辑',
  SUPPLIER_DELETE: '供应商删除',
  PERMISSION_MANAGE: '权限管理',
  ROLE_MANAGE: '角色管理',
  SETTINGS_MANAGE: '设置管理',
}

function splitCode(code: string): string[] {
  if (code.includes(':')) return code.split(':').filter(Boolean)
  if (code.includes('.')) return code.split('.').filter(Boolean)
  if (code.includes('_')) return code.split('_').filter(Boolean)
  return [code]
}

function toChineseLabel(segment: string): string {
  const normalized = segment.trim()
  if (!normalized) return normalized
  return CODE_LABELS[normalized.toLowerCase()] ?? FULL_CODE_LABELS[normalized] ?? normalized
}

function getPermissionLabel(permission: AdminPermission, segments: string[]): string {
  if (permission.name && permission.name !== permission.code) return permission.name
  return FULL_CODE_LABELS[permission.code] ?? segments.map(toChineseLabel).join('')
}

function createNode(id: string, label: string, code: string, depth: number): PermissionTreeNode {
  return {
    id,
    label,
    code,
    depth,
    children: [],
    permissionIds: [],
  }
}

export function isSuperAdminPermission(permission: AdminPermission): boolean {
  const code = permission.code.trim().toLowerCase()
  const name = permission.name.trim().toLowerCase()

  return (
    code === 'sub_admin' ||
    code === 'sub:admin' ||
    code === 'sub.admin' ||
    code === 'subadmin' ||
    code === 'super_admin' ||
    code === 'super:admin' ||
    code === 'super.admin' ||
    code === 'superadmin' ||
    permission.code === 'SUB_ADMIN' ||
    permission.name.includes('超级管理员') ||
    name.includes('super admin')
  )
}

export function filterVisiblePermissions(permissions: AdminPermission[]): AdminPermission[] {
  return permissions.filter((permission) => !isSuperAdminPermission(permission))
}

export function buildPermissionTree(permissions: AdminPermission[]): PermissionTreeNode[] {
  const roots: PermissionTreeNode[] = []
  const nodeMap = new Map<string, PermissionTreeNode>()

  const sorted = [...permissions].sort((a, b) => a.code.localeCompare(b.code))

  sorted.forEach((permission) => {
    const segments = splitCode(permission.code)
    let parentList = roots
    let prefix = ''

    segments.forEach((segment, index) => {
      prefix = prefix ? `${prefix}:${segment}` : segment
      const isLeaf = index === segments.length - 1
      const nodeId = `permission:${prefix}`
      let node = nodeMap.get(nodeId)

      if (!node) {
        node = createNode(
          nodeId,
          isLeaf ? getPermissionLabel(permission, segments) : toChineseLabel(segment),
          prefix,
          index,
        )
        nodeMap.set(nodeId, node)
        parentList.push(node)
      }

      if (isLeaf) {
        node.permission = permission
        node.label = getPermissionLabel(permission, segments)
      }

      parentList = node.children
    })
  })

  function collectIds(node: PermissionTreeNode): number[] {
    const ids = node.permission ? [node.permission.id] : []
    node.children.forEach((child) => ids.push(...collectIds(child)))
    node.permissionIds = ids
    node.children.sort((a, b) => a.label.localeCompare(b.label))
    return ids
  }

  roots.forEach(collectIds)
  roots.sort((a, b) => a.label.localeCompare(b.label))

  return roots
}
