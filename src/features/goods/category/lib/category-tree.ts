import type { GoodsCategoryTreeNode } from '../types'

export interface CategoryOption {
  id: number
  name: string
  level: number
  label: string
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

export function findCategory(nodes: GoodsCategoryTreeNode[], id: number): GoodsCategoryTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findCategory(node.children ?? [], id)
    if (child) return child
  }
  return null
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
