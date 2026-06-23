import type { GoodsCategoryTreeNode } from '../types'

/** 分类最大层级深度 */
export const MAX_CATEGORY_LEVEL = 3

export interface CategoryOption {
  id: number
  name: string
  level: number
  label: string
}

export interface CategoryNodeMeta {
  id: number
  childCount: number
  descendantCount: number
  path: GoodsCategoryTreeNode[]
}

export function flattenCategoryTree(nodes: GoodsCategoryTreeNode[], depth = 0): CategoryOption[] {
  return nodes.flatMap((node) => {
    const prefix = depth > 0 ? `${'　'.repeat(depth)}└ ` : ''
    const current = {
      id: node.id,
      name: node.name,
      level: node.level,
      label: `${prefix}${node.name}`,
    }
    return [current, ...flattenCategoryTree(node.children ?? [], depth + 1)]
  })
}

export function createCategoryMetaMap(nodes: GoodsCategoryTreeNode[]) {
  const metaMap = new Map<number, CategoryNodeMeta>()

  function visit(node: GoodsCategoryTreeNode, path: GoodsCategoryTreeNode[]): number {
    const currentPath = [...path, node]
    const children = node.children ?? []
    const descendantCount = children.reduce((total, child) => total + 1 + visit(child, currentPath), 0)

    metaMap.set(node.id, {
      id: node.id,
      childCount: children.length,
      descendantCount,
      path: currentPath,
    })

    return descendantCount
  }

  nodes.forEach((node) => visit(node, []))
  return metaMap
}

export function findCategory(nodes: GoodsCategoryTreeNode[], id: number): GoodsCategoryTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findCategory(node.children ?? [], id)
    if (child) return child
  }
  return null
}

/** 返回从根到指定分类的路径（用于面包屑导航）。未找到时返回空数组。 */
export function getCategoryPath(nodes: GoodsCategoryTreeNode[], id: number): GoodsCategoryTreeNode[] {
  for (const node of nodes) {
    if (node.id === id) return [node]
    const childPath = getCategoryPath(node.children ?? [], id)
    if (childPath.length) return [node, ...childPath]
  }
  return []
}

export function countTree(nodes: GoodsCategoryTreeNode[]): number {
  return nodes.reduce((total, node) => total + 1 + countTree(node.children ?? []), 0)
}

export function getMaxLevel(nodes: GoodsCategoryTreeNode[]): number {
  return nodes.reduce((max, node) => Math.max(max, node.level, getMaxLevel(node.children ?? [])), 0)
}

export function countEnabled(nodes: GoodsCategoryTreeNode[]): number {
  return nodes.reduce((total, node) => {
    const self = node.status === 1 ? 1 : 0
    return total + self + countEnabled(node.children ?? [])
  }, 0)
}
