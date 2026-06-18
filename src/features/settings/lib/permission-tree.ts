import type { AdminPermission, PermissionTreeNode } from '../types'

function splitCode(code: string): string[] {
  if (code.includes(':')) return code.split(':').filter(Boolean)
  if (code.includes('.')) return code.split('.').filter(Boolean)
  if (code.includes('_')) return code.split('_').filter(Boolean)
  return [code]
}

function toTitle(segment: string): string {
  if (!segment) return segment
  if (segment === segment.toUpperCase()) return segment
  return segment.slice(0, 1).toUpperCase() + segment.slice(1)
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
        node = createNode(nodeId, isLeaf ? permission.name : toTitle(segment), prefix, index)
        nodeMap.set(nodeId, node)
        parentList.push(node)
      }

      if (isLeaf) {
        node.permission = permission
        node.label = permission.name
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
