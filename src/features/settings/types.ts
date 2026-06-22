export interface AdminPermission {
  id: number
  name: string
  code: string
}

export interface RolePageParams {
  page: number
  size: number
  rname?: string
}

export interface RolePageResult {
  records: AdminRole[]
  total: number
  size: number
  current: number
}

export interface PermissionSyncItem {
  name: string
  code: string
}

export interface PermissionTreeNode {
  id: string
  label: string
  code: string
  depth: number
  children: PermissionTreeNode[]
  permissionIds: number[]
  permission?: AdminPermission
}

export interface AdminRole {
  id: number
  rname: string
  description?: string | null
  updatedTime?: string
  createdTime?: string
}

export interface RolePermissionTreeNode {
  id: string
  label: string
  code: string
  depth: number
  children: RolePermissionTreeNode[]
  permissionCodes: string[]
}
