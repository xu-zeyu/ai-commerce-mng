'use client'

import {
  DataTableFilterField,
  DataTableFilterGroup,
  DataTableFilterSelect,
} from '@/components/common/data-table-filters'
import type { CategoryTreeNode } from '../api/get-category-tree'
import type { BrandStatus } from '../types'

type StatusFilter = 'all' | BrandStatus

interface BrandFilterFieldsProps {
  categoryId: number
  status: StatusFilter
  categories: { id: number; label: string }[]
  onCategoryChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
}

export function flattenCategoryTree(
  nodes: CategoryTreeNode[],
  parentPath = '',
): { id: number; label: string }[] {
  const result: { id: number; label: string }[] = []
  for (const node of nodes) {
    const path = parentPath ? `${parentPath} > ${node.name}` : node.name
    result.push({ id: node.id, label: path })
    if (node.children && node.children.length > 0) {
      result.push(...flattenCategoryTree(node.children, path))
    }
  }
  return result
}

export function BrandFilterFields({
  categoryId,
  status,
  categories,
  onCategoryChange,
  onStatusChange,
}: BrandFilterFieldsProps) {
  return (
    <DataTableFilterGroup className="2xl:grid-cols-4">
      <DataTableFilterField label="所属分类">
        <DataTableFilterSelect
          value={String(categoryId)}
          onValueChange={onCategoryChange}
          options={[
            { value: '0', label: '全部分类' },
            ...categories.map((category) => ({
              value: String(category.id),
              label: category.label,
            })),
          ]}
        />
      </DataTableFilterField>

      <DataTableFilterField label="状态">
        <DataTableFilterSelect
          value={status === 'all' ? 'all' : String(status)}
          onValueChange={(value) =>
            onStatusChange(
              value === 'all'
                ? 'all'
                : (Number(value) as BrandStatus),
            )
          }
          options={[
            { value: 'all', label: '全部状态' },
            { value: '1', label: '启用' },
            { value: '0', label: '停用' },
          ]}
        />
      </DataTableFilterField>
    </DataTableFilterGroup>
  )
}
