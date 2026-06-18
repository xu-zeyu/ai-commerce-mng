export interface AdminPermission {
  id: number
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
